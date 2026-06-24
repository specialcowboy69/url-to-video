export type MediaMode = "videos" | "images";

export type AppState = "idle" | "loading" | "success" | "error";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type CreateVideoResponse = {
  jobId: string;
  status: JobStatus;
};

export type JobResponse = {
  status: JobStatus;
  message?: string;
  stage?: string;
  videoUrl?: string;
  downloadUrl?: string;
  error?: string;
};
