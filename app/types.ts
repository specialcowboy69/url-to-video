export type InputMode = "url" | "text";

export type MediaMode = "videos" | "images";

export type VideoLanguage = "es" | "en";

export type AppState = "idle" | "loading" | "success" | "error";

export type CreateVideoInitialValues = {
  inputMode: InputMode;
  sourceUrl: string;
  articleText: string;
  mediaMode: MediaMode;
  language: VideoLanguage;
};

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type CreateVideoResponse = {
  jobId: string;
  status: JobStatus;
};

export type CreateAudioResponse = {
  jobId: string;
  status: JobStatus;
};

export type CreateSubtitlesResponse = {
  jobId: string;
  status: JobStatus;
};

export type JobResponse = {
  status: JobStatus;
  message?: string;
  stage?: string;
  videoUrl?: string;
  audioUrl?: string;
  srtUrl?: string;
  downloadUrl?: string;
  transcript?: string;
  cueCount?: number;
  wordCount?: number;
  wordsPerSegment?: number;
  error?: string;
};
