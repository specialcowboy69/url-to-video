import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  maxArticleTextLength,
  maxCreateVideoRequestBytes,
  minArticleTextLength,
} from "@/app/lib/videoInputLimits";

export const runtime = "nodejs";

const requestTimeoutMs = 30000;
const privateHostnameSuffixes = [".localhost", ".local", ".internal"];

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
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
  mediaMode: z.enum(["videos", "images"]).default("videos"),
  language: z.enum(["es", "en"]).default("es"),
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

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_GENERATE_WEBHOOK_URL en el servidor.",
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nPayload =
      parsed.data.inputMode === "text"
        ? {
            inputMode: parsed.data.inputMode,
            articleText: parsed.data.articleText,
            mediaMode: parsed.data.mediaMode,
            language: parsed.data.language,
          }
        : {
            inputMode: parsed.data.inputMode,
            sourceUrl: parsed.data.sourceUrl,
            mediaMode: parsed.data.mediaMode,
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

    return NextResponse.json({
      jobId,
      status: normalizeStatus(payload),
    });
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
