"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { CreateAIVideoForm } from "@/app/components/CreateAIVideoForm";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingState } from "@/app/components/LoadingState";
import { UploadStartingState } from "@/app/components/UploadStartingState";
import { ResultView } from "@/app/components/ResultView";
import { createAIVideo, getAIVideoJob } from "@/app/lib/api";
import type {
  AppState,
  CreateVideoInitialValues,
  InputMode,
  JobResponse,
  VideoLanguage,
} from "@/app/types";

type CreateAIVideoExperienceProps = {
  initialValues: CreateVideoInitialValues;
  copyNamespace?: "CreateAI" | "TextToVideoAI";
};

export function CreateAIVideoExperience({
  initialValues,
  copyNamespace = "CreateAI",
}: CreateAIVideoExperienceProps) {
  const result = useTranslations("Result");
  const error = useTranslations("Error");
  const createAI = useTranslations(copyNamespace);
  const [appState, setAppState] = useState<AppState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateVideo(
    input: string,
    inputMode: InputMode,
    language: VideoLanguage,
    turnstileToken: string
  ) {
    setVideoUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
    setAppState("loading");

    const payload = await createAIVideo(input, inputMode, language, turnstileToken);
    setJobId(payload.jobId);
  }

  const handleCompleted = useCallback((payload: JobResponse) => {
    if (!payload.videoUrl) {
      setErrorMessage(result("missingUrlError"));
      setAppState("error");
      return;
    }

    setVideoUrl(payload.videoUrl);
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
    setVideoUrl(null);
    setDownloadUrl(undefined);
    setErrorMessage("");
  }

  if (appState === "loading" && jobId) {
    return (
      <LoadingState
        jobId={jobId}
        getJob={getAIVideoJob}
        onCompleted={handleCompleted}
        onFailed={handleFailed}
      />
    );
  }

  if (appState === "loading") {
    return (
      <UploadStartingState
        eyebrow={createAI("startingEyebrow")}
        title={createAI("startingTitle")}
        subtitle={createAI("startingSubtitle")}
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
        message={errorMessage || error("fallback")}
        onReset={reset}
      />
    );
  }

  return (
    <CreateAIVideoForm
      initialValues={initialValues}
      copyNamespace={copyNamespace}
      onSubmit={handleCreateVideo}
    />
  );
}
