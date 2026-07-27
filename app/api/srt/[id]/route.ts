import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StatusRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeStatus(payload: Record<string, unknown>) {
  const status =
    typeof payload.status === "string" ? payload.status.toLowerCase() : "pending";

  if (status === "failed" || status === "error" || status === "rejected") {
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
    payload.srtUrl ??
    payload.downloadUrl ??
    payload.publicUrl ??
    payload.url ??
    payload.fileUrl;

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

export async function GET(_request: Request, { params }: StatusRouteProps) {
  const webhookUrl = process.env.N8N_SRT_STATUS_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_SRT_STATUS_WEBHOOK_URL en el servidor.",
      500
    );
  }

  const { id } = await params;
  const jobId = decodeURIComponent(id).trim();

  if (!jobId) {
    return jsonError("Falta el jobId.");
  }

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, id: jobId }),
      cache: "no-store",
    });

    const payload = (await n8nResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!n8nResponse.ok || !payload) {
      return jsonError(
        "No se ha podido consultar el estado de los subtitulos.",
        n8nResponse.status || 502
      );
    }

    const status = normalizeStatus(payload);
    const publicUrl = normalizePublicUrl(payload);
    const error =
      typeof payload.error === "string" && payload.error.trim()
        ? payload.error.trim()
        : undefined;

    return NextResponse.json({
      jobId,
      status,
      stage: payload.stage,
      message: payload.message,
      srtUrl: publicUrl,
      downloadUrl: publicUrl,
      transcript: payload.transcript,
      cueCount: payload.cueCount,
      wordCount: payload.wordCount,
      wordsPerSegment: payload.wordsPerSegment,
      outputFormat: payload.outputFormat,
      error,
    });
  } catch {
    return jsonError("No se ha podido conectar con n8n.", 502);
  }
}
