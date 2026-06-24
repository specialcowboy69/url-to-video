"use client";

import { useCallback, useState } from "react";
import { CreateVideoForm } from "@/app/components/CreateVideoForm";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingState } from "@/app/components/LoadingState";
import { ResultView } from "@/app/components/ResultView";
import { createVideo } from "@/app/lib/api";
import type { AppState, JobResponse, MediaMode } from "@/app/types";

export function CreateVideoExperience() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateVideo(sourceUrl: string, mediaMode: MediaMode) {
    const payload = await createVideo(sourceUrl, mediaMode);
    setJobId(payload.jobId);
    setVideoUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
    setAppState("loading");
  }

  const handleCompleted = useCallback((payload: JobResponse) => {
    if (!payload.videoUrl) {
      setErrorMessage("El trabajo termino, pero no recibimos la URL del MP4.");
      setAppState("error");
      return;
    }

    setVideoUrl(payload.videoUrl);
    setDownloadUrl(payload.downloadUrl);
    setAppState("success");
  }, []);

  const handleFailed = useCallback((message: string) => {
    setErrorMessage(message);
    setAppState("error");
  }, []);

  function reset() {
    setAppState("idle");
    setJobId(null);
    setVideoUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
  }

  if (appState === "loading" && jobId) {
    return (
      <LoadingState
        jobId={jobId}
        onCompleted={handleCompleted}
        onFailed={handleFailed}
      />
    );
  }

  if (appState === "success" && videoUrl) {
    return (
      <ResultView
        videoUrl={videoUrl}
        downloadUrl={downloadUrl}
        onReset={reset}
      />
    );
  }

  if (appState === "error") {
    return (
      <ErrorState
        message={
          errorMessage ||
          "No hemos podido procesar esta URL. Revisa que el enlace sea publico e intentalo de nuevo."
        }
        onReset={reset}
      />
    );
  }

  return <CreateVideoForm onSubmit={handleCreateVideo} />;
}
