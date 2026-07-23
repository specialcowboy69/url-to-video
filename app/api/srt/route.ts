import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxFileSizeBytes = 500 * 1024 * 1024;
const requestTimeoutMs = 10 * 60 * 1000;

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

  const status = (payload as Record<string, unknown>).status;

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

function normalizeWordsPerSegment(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.max(1, Math.min(20, parsed));
}

function isAllowedMedia(file: File) {
  const name = file.name.toLowerCase();
  const allowedExtensions = [
    ".mp3",
    ".wav",
    ".m4a",
    ".aac",
    ".ogg",
    ".opus",
    ".flac",
    ".mp4",
    ".webm",
    ".mov",
    ".mkv",
    ".avi",
    ".mpeg",
    ".mpg",
  ];

  return (
    file.type.startsWith("audio/") ||
    file.type.startsWith("video/") ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_SRT_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_SRT_GENERATE_WEBHOOK_URL en el servidor.",
      500
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return jsonError("Sube un archivo de audio o video valido.");
  }

  if (file.size <= 0) {
    return jsonError("El archivo esta vacio.");
  }

  if (file.size > maxFileSizeBytes) {
    return jsonError("El archivo supera el limite de 500 MB.");
  }

  if (!isAllowedMedia(file)) {
    return jsonError("Formato no permitido. Sube un archivo de audio o video.");
  }

  const wordsPerSegment = normalizeWordsPerSegment(
    formData ? formData.get("wordsPerSegment") : null
  );
  const n8nFormData = new FormData();
  n8nFormData.append("data", file, file.name || "audio.mp3");
  n8nFormData.append("originalName", file.name || "audio.mp3");
  n8nFormData.append("wordsPerSegment", String(wordsPerSegment));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      body: n8nFormData,
      signal: controller.signal,
    });

    const payload = await n8nResponse.json().catch(() => null);

    if (!n8nResponse.ok) {
      return jsonError(
        "n8n no ha aceptado la generacion de subtitulos.",
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
        ? "La subida del archivo ha tardado demasiado."
        : "No se ha podido conectar con n8n.",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
