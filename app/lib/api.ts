import type {
  CreateAudioResponse,
  CreateVideoResponse,
  InputMode,
  JobResponse,
  MediaMode,
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
      error: typeof data.error === "string" ? data.error : undefined,
    };
  }

  if (typeof jobId === "number" && Number.isFinite(jobId)) {
    return {
      jobId: String(jobId),
      status,
      error: typeof data.error === "string" ? data.error : undefined,
    };
  }

  return null;
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
  const directWebhookUrl =
    process.env.NEXT_PUBLIC_N8N_MP3_GENERATE_WEBHOOK_URL?.trim();
  const uploadUrl = directWebhookUrl || "/api/mp3";
  const formData = new FormData();
  formData.append(directWebhookUrl ? "data" : "file", file);

  if (directWebhookUrl) {
    formData.append("originalName", file.name || "video.mp4");
  }

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
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
