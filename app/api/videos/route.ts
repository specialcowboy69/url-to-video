import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const createVideoSchema = z.object({
  sourceUrl: z.string().url(),
  mediaMode: z.enum(["videos", "images"]).default("videos"),
});

const requestTimeoutMs = 30000;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

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

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_GENERATE_WEBHOOK_URL en el servidor.",
      500
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createVideoSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Introduce una URL valida y un modo de media correcto.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceUrl: parsed.data.sourceUrl,
        link: parsed.data.sourceUrl,
        mediaMode: parsed.data.mediaMode,
      }),
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
