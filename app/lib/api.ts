import type {
  CreateVideoResponse,
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

export async function createVideo(
  sourceUrl: string,
  mediaMode: MediaMode,
  language: VideoLanguage
) {
  const response = await fetch("/api/videos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sourceUrl, mediaMode, language }),
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
