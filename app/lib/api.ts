import type {
  CreateAudioResponse,
  CreateSharedVideoResponse,
  CreateSubtitlesResponse,
  CreateVideoResponse,
  InputMode,
  JobResponse,
  MediaMode,
  SubtitleOutputFormat,
  VideoLanguage,
} from "@/app/types";

async function readJsonResponse<T>(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    const hint = text.trim().startsWith("<!DOCTYPE")
      ? "El servidor devolvio HTML en vez de JSON."
      : text.trim();

    throw new Error(hint || fallbackMessage);
  }

  return (await response.json()) as T & {
    error?: string;
  };
}

function normalizeCreateJobPayload(payload: unknown) {
  const record = Array.isArray(payload) ? payload[0] : payload;

  if (!record || typeof record !== "object") {
    return null;
  }

  const data = record as Record<string, unknown>;
  const jobId = data.jobId ?? data.id ?? data.executionId;
  const status = typeof data.status === "string" ? data.status : "pending";

  if (typeof jobId === "string" && jobId.trim()) {
    return {
      jobId: jobId.trim(),
      status,
      outputFormat:
        data.outputFormat === "vtt" || data.outputFormat === "csv"
          ? data.outputFormat
          : data.outputFormat === "srt"
            ? "srt"
            : undefined,
      error: typeof data.error === "string" ? data.error : undefined,
    };
  }

  if (typeof jobId === "number" && Number.isFinite(jobId)) {
    return {
      jobId: String(jobId),
      status,
      outputFormat:
        data.outputFormat === "vtt" || data.outputFormat === "csv"
          ? data.outputFormat
          : data.outputFormat === "srt"
            ? "srt"
            : undefined,
      error: typeof data.error === "string" ? data.error : undefined,
    };
  }

  return null;
}

type DirectUploadResponse = {
  uploadUrl: string;
  objectKey: string;
  sourceUrl: string;
  originalName: string;
  mimeType?: string;
  fileSizeBytes: number;
};

async function createDirectUpload(file: File, service: "mp3" | "srt") {
  const response = await fetch("/api/uploads/r2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    }),
  });

  const payload = await readJsonResponse<DirectUploadResponse>(
    response,
    "No se ha podido preparar la subida del archivo."
  );

  if (!response.ok) {
    throw new Error(payload.error ?? "No se ha podido preparar la subida.");
  }

  return payload;
}

async function uploadFileToSignedUrl(file: File, uploadUrl: string) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: file.type ? { "Content-Type": file.type } : undefined,
    body: file,
  });

  if (!response.ok) {
    throw new Error("No se ha podido subir el archivo a Cloudflare R2.");
  }
}

export async function createVideo(
  input: string,
  inputMode: InputMode,
  mediaMode: MediaMode,
  language: VideoLanguage
) {
  const response = await fetch("/api/videos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      inputMode === "text"
        ? { inputMode, articleText: input, mediaMode, language }
        : { inputMode, sourceUrl: input, mediaMode, language }
    ),
  });

  const payload = await readJsonResponse<CreateVideoResponse>(
    response,
    "No se ha podido crear el trabajo."
  );

  if (!response.ok) {
    throw new Error(payload.error ?? "No se ha podido crear el trabajo.");
  }

  return payload;
}

export async function getVideoJob(jobId: string) {
  const response = await fetch(`/api/videos/${encodeURIComponent(jobId)}`, {
    method: "GET",
    cache: "no-store",
  });

  const payload = await readJsonResponse<JobResponse>(
    response,
    "No se ha podido consultar el trabajo."
  );

  if (!response.ok) {
    throw new Error(payload.error ?? "No se ha podido consultar el trabajo.");
  }

  return payload;
}

export async function createAudio(file: File) {
  const upload = await createDirectUpload(file, "mp3");
  await uploadFileToSignedUrl(file, upload.uploadUrl);

  const response = await fetch("/api/mp3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceKey: upload.objectKey,
      sourceUrl: upload.sourceUrl,
      originalName: upload.originalName,
      mimeType: upload.mimeType || file.type,
      fileSizeBytes: upload.fileSizeBytes,
    }),
  });

  const payload = await readJsonResponse<unknown>(
    response,
    "No se ha podido crear el trabajo de audio."
  );
  const normalizedPayload = normalizeCreateJobPayload(payload);

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : undefined;

    throw new Error(errorMessage ?? "No se ha podido crear el trabajo de audio.");
  }

  if (!normalizedPayload) {
    throw new Error("n8n no ha devuelto un jobId valido.");
  }

  return normalizedPayload as CreateAudioResponse;
}

export async function getAudioJob(jobId: string) {
  const response = await fetch(`/api/mp3/${encodeURIComponent(jobId)}`, {
    method: "GET",
    cache: "no-store",
  });

  const payload = await readJsonResponse<JobResponse>(
    response,
    "No se ha podido consultar el trabajo de audio."
  );

  if (!response.ok) {
    throw new Error(payload.error ?? "No se ha podido consultar el trabajo de audio.");
  }

  return payload;
}

export async function createSubtitles(
  file: File,
  wordsPerSegment: number,
  outputFormat: SubtitleOutputFormat
) {
  const upload = await createDirectUpload(file, "srt");
  await uploadFileToSignedUrl(file, upload.uploadUrl);

  const response = await fetch("/api/srt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceKey: upload.objectKey,
      sourceUrl: upload.sourceUrl,
      originalName: upload.originalName,
      mimeType: upload.mimeType || file.type,
      fileSizeBytes: upload.fileSizeBytes,
      wordsPerSegment,
      outputFormat,
    }),
  });

  const payload = await readJsonResponse<unknown>(
    response,
    "No se ha podido crear el trabajo de subtitulos."
  );
  const normalizedPayload = normalizeCreateJobPayload(payload);

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : undefined;

    throw new Error(
      errorMessage ?? "No se ha podido crear el trabajo de subtitulos."
    );
  }

  if (!normalizedPayload) {
    throw new Error("n8n no ha devuelto un jobId valido.");
  }

  return normalizedPayload as CreateSubtitlesResponse;
}

export async function getSubtitlesJob(jobId: string) {
  const response = await fetch(`/api/srt/${encodeURIComponent(jobId)}`, {
    method: "GET",
    cache: "no-store",
  });

  const payload = await readJsonResponse<JobResponse>(
    response,
    "No se ha podido consultar el trabajo de subtitulos."
  );

  if (!response.ok) {
    throw new Error(
      payload.error ?? "No se ha podido consultar el trabajo de subtitulos."
    );
  }

  return payload;
}

export async function createSharedVideo(file: File, slug: string) {
  const formData = new FormData();
  formData.append("file", file);

  if (slug.trim()) {
    formData.append("slug", slug.trim());
  }

  const response = await fetch("/api/share-video", {
    method: "POST",
    body: formData,
  });

  const payload = await readJsonResponse<CreateSharedVideoResponse>(
    response,
    "No se ha podido crear el enlace del video."
  );

  if (!response.ok || payload.status === "failed") {
    throw new Error(payload.error ?? "No se ha podido crear el enlace del video.");
  }

  if (!payload.slug || !payload.shareUrl) {
    throw new Error("n8n no ha devuelto un enlace valido.");
  }

  return payload;
}

