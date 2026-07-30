"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { AudioLoadingState } from "@/app/components/AudioLoadingState";
import { AudioResultView } from "@/app/components/AudioResultView";
import { CreateAudioForm } from "@/app/components/CreateAudioForm";
import { ErrorState } from "@/app/components/ErrorState";
import { UploadStartingState } from "@/app/components/UploadStartingState";
import { createAudio } from "@/app/lib/api";
import type { AppState, JobResponse } from "@/app/types";

export function CreateAudioExperience() {
  const result = useTranslations("AudioResult");
  const error = useTranslations("Error");
  const [appState, setAppState] = useState<AppState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateAudio(file: File) {
    setAudioUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
    setJobId(null);
    setAppState("starting");

    try {
      const payload = await createAudio(file);
      setJobId(payload.jobId);
      setAppState("loading");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "");
      setAppState("error");
    }
  }

  const handleCompleted = useCallback((payload: JobResponse) => {
    const finalAudioUrl = payload.audioUrl ?? payload.downloadUrl;

    if (!finalAudioUrl) {
      setErrorMessage(result("missingUrlError"));
      setAppState("error");
      return;
    }

    setAudioUrl(finalAudioUrl);
    setDownloadUrl(payload.downloadUrl);
    setAppState("success");
  }, [result]);

  const handleFailed = useCallback((message: string) => {
    setErrorMessage(message);
    setAppState("error");
  }, []);

  function reset() {
    setAppState("idle");
    setJobId(null);
    setAudioUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
  }

  if (appState === "loading" && jobId) {
    return (
      <AudioLoadingState
        jobId={jobId}
        onCompleted={handleCompleted}
        onFailed={handleFailed}
      />
    );
  }

  if (appState === "starting") {
    return (
      <UploadStartingState
        eyebrow={result("uploadEyebrow")}
        title={result("uploadTitle")}
        subtitle={result("uploadSubtitle")}
      />
    );
  }

  if (appState === "success" && audioUrl) {
    return (
      <AudioResultView
        audioUrl={audioUrl}
        downloadUrl={downloadUrl}
        onReset={reset}
      />
    );
  }

  if (appState === "error") {
    return (
      <ErrorState
        message={errorMessage || error("fallback")}
        onReset={reset}
      />
    );
  }

  return <CreateAudioForm onSubmit={handleCreateAudio} />;
}
