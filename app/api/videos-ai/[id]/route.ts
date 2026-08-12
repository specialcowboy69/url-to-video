import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const requestTimeoutMs = 30000;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ status: "failed", error: message }, { status });
}

function buildStatusUrl(baseUrl: string, jobId: string) {
  if (baseUrl.includes("{jobId}")) {
    return baseUrl.replaceAll("{jobId}", encodeURIComponent(jobId));
  }

  return baseUrl;
}

function normalizeStatus(payload: Record<string, unknown>) {
  const status =
    typeof payload.status === "string" ? payload.status.toLowerCase() : "pending";

  if (
    status === "failed" ||
    status === "error" ||
    status === "rejected" ||
    payload.fatal === true
  ) {
    return "failed";
  }

  if (status === "completed" || status === "success" || status === "done") {
    return "completed";
  }

  if (
    status !== "completed" &&
    typeof payload.error === "string" &&
    payload.error.trim() !== ""
  ) {
    return "failed";
  }

  if (status === "pending" || status === "processing") {
    return status;
  }

  return "processing";
}

function normalizePublicUrl(payload: Record<string, unknown>) {
  const direct =
    payload.videoUrl ??
    payload.downloadUrl ??
    payload.publicUrl;

  if (
    typeof direct === "string" &&
    (direct.startsWith("http://") || direct.startsWith("https://"))
  ) {
    return direct;
  }

  if (typeof direct === "string" && direct.startsWith("/api/")) {
    return direct;
  }

  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const webhookUrl = process.env.N8N_AI_VIDEO_STATUS_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError("Falta configurar N8N_AI_VIDEO_STATUS_WEBHOOK_URL en el servidor.", 500);
  }

  const { id } = await context.params;

  if (!id || id.trim().length === 0) {
    return jsonError("El jobId no es valido.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nResponse = await fetch(buildStatusUrl(webhookUrl, id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId: id, id }),
      signal: controller.signal,
      cache: "no-store",
    });

    const payload = (await n8nResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!n8nResponse.ok || !payload) {
      return jsonError("No se ha podido consultar el estado del video.", 502);
    }

    const status = normalizeStatus(payload);
    const videoUrl = normalizePublicUrl(payload);
    const message =
      typeof payload.message === "string" ? payload.message : undefined;
    const error = typeof payload.error === "string" ? payload.error : undefined;

    if (status === "completed" && !videoUrl) {
      return NextResponse.json({
        status: "failed",
        error:
          "El render termino, pero todavia no hay una URL publica del MP4.",
      });
    }

    return NextResponse.json({
      status,
      message,
      stage: typeof payload.stage === "string" ? payload.stage : undefined,
      videoUrl: videoUrl ?? undefined,
      downloadUrl:
        typeof payload.downloadUrl === "string" ? payload.downloadUrl : videoUrl ?? undefined,
      error,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";

    return jsonError(
      aborted
        ? "La consulta de estado ha tardado demasiado."
        : "No se ha podido conectar con n8n para consultar el estado.",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
