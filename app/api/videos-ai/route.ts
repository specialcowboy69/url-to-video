import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  maxArticleTextLength,
  maxCreateVideoRequestBytes,
  minArticleTextLength,
} from "@/app/lib/videoInputLimits";

export const runtime = "nodejs";

const requestTimeoutMs = 30000;
const turnstileTimeoutMs = 10000;
const rateLimitWindowSeconds = 24 * 60 * 60;
const defaultDailyLimit = 3;
const privateHostnameSuffixes = [".localhost", ".local", ".internal"];
const memoryRateLimit = new Map<string, { count: number; expiresAt: number }>();

let redis: Redis | null | undefined;

function jsonError(message: string, status = 400, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part));

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [first, second] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");

  if (
    normalized === "localhost" ||
    privateHostnameSuffixes.some((suffix) => normalized.endsWith(suffix))
  ) {
    return true;
  }

  const ipVersion = isIP(normalized);

  if (ipVersion === 4) {
    return isPrivateIpv4(normalized);
  }

  if (ipVersion === 6) {
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80")
    );
  }

  return false;
}

const publicUrlSchema = z.string().trim().transform((value, context) => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Introduce una URL valida.",
    });
    return z.NEVER;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La URL debe usar http o https.",
    });
    return z.NEVER;
  }

  if (isBlockedHostname(url.hostname)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "La URL debe ser publica.",
    });
    return z.NEVER;
  }

  return url.toString();
});

const createVideoSchema = z.object({
  inputMode: z.enum(["url", "text"]).default("url"),
  sourceUrl: publicUrlSchema.optional(),
  articleText: z
    .string()
    .trim()
    .min(minArticleTextLength)
    .max(maxArticleTextLength)
    .optional(),
  mediaMode: z.enum(["videos", "images"]).default("images"),
  language: z.enum(["es", "en"]).default("es"),
  turnstileToken: z.string().trim().min(1),
}).superRefine((data, context) => {
  if (data.inputMode === "url" && !data.sourceUrl) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "sourceUrl is required when inputMode is url.",
      path: ["sourceUrl"],
    });
  }

  if (data.inputMode === "text" && !data.articleText) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "articleText is required when inputMode is text.",
      path: ["articleText"],
    });
  }
});

function normalizeJobId(payload: unknown) {
  if (Array.isArray(payload)) {
    return normalizeJobId(payload[0]);
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const jobId = record.jobId ?? record.id ?? record.executionId;

  if (typeof jobId === "string" && jobId.trim().length > 0) {
    return jobId.trim();
  }

  if (typeof jobId === "number" && Number.isFinite(jobId)) {
    return String(jobId);
  }

  return null;
}

function normalizeStatus(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "pending";
  }

  const record = payload as Record<string, unknown>;
  const status = record.status;

  if (
    status === "pending" ||
    status === "processing" ||
    status === "completed" ||
    status === "failed"
  ) {
    return status;
  }

  return "pending";
}

function getRequestByteLength(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (!contentLength) {
    return null;
  }

  const parsed = Number(contentLength);
  return Number.isFinite(parsed) ? parsed : null;
}

function getClientIp(request: Request) {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();

  if (cloudflareIp) {
    return cloudflareIp;
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwardedFor) {
    return forwardedFor;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getDailyLimit() {
  const parsed = Number(process.env.AI_VIDEO_DAILY_LIMIT ?? defaultDailyLimit);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : defaultDailyLimit;
}

function getRedis() {
  if (redis !== undefined) {
    return redis;
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = null;
    return redis;
  }

  redis = Redis.fromEnv();
  return redis;
}

function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_HASH_SALT ?? process.env.NEXTAUTH_SECRET ?? "urltovideo";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV !== "production" && token === "dev-turnstile-token";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), turnstileTimeoutMs);
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip !== "unknown") {
    formData.append("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null) as {
      success?: boolean;
      action?: string;
    } | null;

    return Boolean(payload?.success) && (!payload?.action || payload.action === "article_to_video_ai");
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkRateLimit(ip: string) {
  const limit = getDailyLimit();
  const key = `ai-video:${hashIp(ip)}`;
  const store = getRedis();

  if (!store) {
    if (process.env.NODE_ENV === "production") {
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: rateLimitWindowSeconds,
        error: "Falta configurar UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.",
      };
    }

    const now = Date.now();
    const existing = memoryRateLimit.get(key);
    const current = existing && existing.expiresAt > now
      ? existing
      : { count: 0, expiresAt: now + rateLimitWindowSeconds * 1000 };
    current.count += 1;
    memoryRateLimit.set(key, current);

    return {
      allowed: current.count <= limit,
      limit,
      remaining: Math.max(limit - current.count, 0),
      retryAfterSeconds: Math.ceil((current.expiresAt - now) / 1000),
    };
  }

  const count = await store.incr(key);

  if (count === 1) {
    await store.expire(key, rateLimitWindowSeconds);
  }

  const ttl = await store.ttl(key);

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(limit - count, 0),
    retryAfterSeconds: ttl > 0 ? ttl : rateLimitWindowSeconds,
  };
}

function rateLimitHeaders(result: {
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(result.retryAfterSeconds),
  };
}

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_AI_VIDEO_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_AI_VIDEO_GENERATE_WEBHOOK_URL en el servidor.",
      500
    );
  }

  const requestByteLength = getRequestByteLength(request);

  if (requestByteLength && requestByteLength > maxCreateVideoRequestBytes) {
    return jsonError("El texto enviado es demasiado largo.", 413);
  }

  const rawBody = await request.text().catch(() => "");

  if (rawBody.length > maxCreateVideoRequestBytes) {
    return jsonError("El texto enviado es demasiado largo.", 413);
  }

  let body: unknown = null;

  try {
    body = JSON.parse(rawBody);
  } catch {
    body = null;
  }

  const parsed = createVideoSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Introduce una URL valida o pega un texto suficiente.");
  }

  const clientIp = getClientIp(request);
  const captchaIsValid = await verifyTurnstile(parsed.data.turnstileToken, clientIp);

  if (!captchaIsValid) {
    return jsonError("No se ha podido verificar el captcha.", 403);
  }

  const limitResult = await checkRateLimit(clientIp);

  if ("error" in limitResult) {
    return jsonError(
      limitResult.error ?? "El limite de uso no esta configurado.",
      503,
      rateLimitHeaders(limitResult)
    );
  }

  if (!limitResult.allowed) {
    return jsonError(
      "Has alcanzado el limite diario de generaciones con imagenes IA.",
      429,
      rateLimitHeaders(limitResult)
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nPayload =
      parsed.data.inputMode === "text"
        ? {
            inputMode: parsed.data.inputMode,
            articleText: parsed.data.articleText,
            mediaMode: "images",
            visualSource: "ai",
            language: parsed.data.language,
          }
        : {
            inputMode: parsed.data.inputMode,
            sourceUrl: parsed.data.sourceUrl,
            mediaMode: parsed.data.mediaMode,
            visualSource: "ai",
            language: parsed.data.language,
          };

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal,
    });

    const payload = await n8nResponse.json().catch(() => null);

    if (!n8nResponse.ok) {
      return jsonError(
        "n8n no ha aceptado la solicitud de generacion.",
        n8nResponse.status
      );
    }

    const jobId = normalizeJobId(payload);

    if (!jobId) {
      return jsonError("n8n no ha devuelto un jobId valido.", 502);
    }

    return NextResponse.json(
      {
        jobId,
        status: normalizeStatus(payload),
      },
      {
        headers: rateLimitHeaders(limitResult),
      }
    );
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";

    return jsonError(
      aborted
        ? "n8n ha tardado demasiado en responder."
        : "No se ha podido conectar con n8n.",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }
}