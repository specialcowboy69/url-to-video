import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxFileSizeBytes = 1024 * 1024 * 1024;
const requestTimeoutMs = 10 * 60 * 1000;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isAllowedVideo(file: File) {
  const name = file.name.toLowerCase();
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
    file.type.startsWith("video/") ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

function normalizeSlug(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizePayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return normalizePayload(payload[0]);
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  return payload as Record<string, unknown>;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_SHARE_VIDEO_GENERATE_WEBHOOK_URL;

  if (!webhookUrl) {
    return jsonError(
      "Falta configurar N8N_SHARE_VIDEO_GENERATE_WEBHOOK_URL en el servidor.",
      500
    );
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

  const slug = normalizeSlug(formData ? formData.get("slug") : null);
  const n8nFormData = new FormData();
  n8nFormData.append("data", file, file.name || "video.mp4");
  n8nFormData.append("originalName", file.name || "video.mp4");

  if (slug) {
    n8nFormData.append("slug", slug);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      body: n8nFormData,
      signal: controller.signal,
    });

    const payload = normalizePayload(await n8nResponse.json().catch(() => null));

    if (!n8nResponse.ok || !payload) {
      return jsonError(
        "n8n no ha aceptado la creacion del enlace.",
        n8nResponse.status || 502
      );
    }

    const status = typeof payload.status === "string" ? payload.status : "failed";
    const responseSlug = payload.slug;
    const shareUrl = payload.shareUrl;

    if (
      status === "failed" ||
      typeof responseSlug !== "string" ||
      typeof shareUrl !== "string"
    ) {
      return jsonError(
        typeof payload.error === "string"
          ? payload.error
          : "n8n no ha devuelto un enlace valido.",
        502
      );
    }

    return NextResponse.json(payload);
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
