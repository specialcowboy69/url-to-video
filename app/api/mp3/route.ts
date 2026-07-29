import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxFileSizeBytes = 1024 * 1024 * 1024;
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

function isAllowedVideo(file: File) {
  const name = file.name.toLowerCase();
  const allowedExtensions = [".mp4", ".webm", ".mov", ".mkv", ".avi", ".mpeg", ".mpg"];

  return (
    file.type.startsWith("video/") ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

function isAllowedVideoMetadata(fileName: string, mimeType: string) {
  const name = fileName.toLowerCase();
  const allowedExtensions = [
    ".mp4",
    ".webm",
    ".mov",
    ".mkv",
    ".avi",
    ".mpeg",
    ".mpg",
  ];

  return (
    mimeType.startsWith("video/") ||
    mimeType === "application/octet-stream" ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

function normalizeObjectKey(value: unknown) {
  const objectKey = String(value || "").trim();

  if (!objectKey || objectKey.includes("..") || objectKey.startsWith("/")) {
    return null;
  }

  if (!objectKey.startsWith("mp3/uploads/")) {
    return null;
  }

  return objectKey;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_MP3_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_MP3_GENERATE_WEBHOOK_URL en el servidor.",
      500
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const input = (await request.json().catch(() => null)) as
      | Record<string, unknown>
      | null;
    const sourceKey = normalizeObjectKey(input?.sourceKey ?? input?.objectKey);
    const originalName = String(input?.originalName || input?.fileName || "video.mp4");
    const mimeType = String(input?.mimeType || "").toLowerCase();
    const fileSizeBytes = Number(input?.fileSizeBytes || input?.fileSize || 0);
    const sourceUrl = typeof input?.sourceUrl === "string" ? input.sourceUrl : undefined;

    if (!sourceKey) {
      return jsonError("Falta una referencia valida del archivo subido.");
    }

    if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) {
      return jsonError("El archivo esta vacio.");
    }

    if (fileSizeBytes > maxFileSizeBytes) {
      return jsonError("El archivo supera el limite de 1 GB.");
    }

    if (!isAllowedVideoMetadata(originalName, mimeType)) {
      return jsonError("Formato no permitido. Sube un archivo de video.");
    }

    try {
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceKey,
          objectKey: sourceKey,
          sourceUrl,
          originalName,
          mimeType,
          fileSizeBytes,
          uploadMode: "r2",
        }),
      });

      const payload = await n8nResponse.json().catch(() => null);

      if (!n8nResponse.ok) {
        return jsonError(
          "n8n no ha aceptado la conversion a MP3.",
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
    } catch {
      return jsonError("No se ha podido conectar con n8n.", 502);
    }
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return jsonError("Sube un archivo de video valido.");
  }

  if (file.size <= 0) {
    return jsonError("El archivo esta vacio.");
  }

  if (file.size > maxFileSizeBytes) {
    return jsonError("El archivo supera el limite de 1 GB.");
  }

  if (!isAllowedVideo(file)) {
    return jsonError("Formato no permitido. Sube un archivo de video.");
  }

  const n8nFormData = new FormData();
  n8nFormData.append("data", file, file.name || "video.mp4");
  n8nFormData.append("originalName", file.name || "video.mp4");

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
        "n8n no ha aceptado la conversion a MP3.",
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
        ? "La subida del video ha tardado demasiado."
        : "No se ha podido conectar con n8n.",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
