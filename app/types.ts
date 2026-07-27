export type InputMode = "url" | "text";

export type MediaMode = "videos" | "images";

export type VideoLanguage = "es" | "en";

export type SubtitleOutputFormat = "srt" | "vtt" | "csv";

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
  outputFormat?: SubtitleOutputFormat;
};

export type CreateSharedVideoResponse = {
  jobId: string;
  slug: string;
  status: "completed" | "failed";
  stage?: string;
  shareUrl?: string;
  sharePath?: string;
  videoUrl?: string;
  directVideoUrl?: string;
  expiresAt?: string;
  error?: string;
};

export type SharedVideoLookupResponse = {
  slug: string;
  status: "active" | "expired" | "not_found" | "failed";
  shareUrl?: string;
  sharePath?: string;
  videoUrl?: string;
  directVideoUrl?: string;
  originalName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  createdAt?: string;
  expiresAt?: string;
  error?: string;
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
  outputFormat?: SubtitleOutputFormat;
  error?: string;
};
