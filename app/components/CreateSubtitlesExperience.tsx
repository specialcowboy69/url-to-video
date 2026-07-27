"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { CreateSubtitlesForm } from "@/app/components/CreateSubtitlesForm";
import { ErrorState } from "@/app/components/ErrorState";
import { SubtitlesLoadingState } from "@/app/components/SubtitlesLoadingState";
import { SubtitlesResultView } from "@/app/components/SubtitlesResultView";
import { createSubtitles } from "@/app/lib/api";
import type { AppState, JobResponse, SubtitleOutputFormat } from "@/app/types";

export function CreateSubtitlesExperience() {
  const result = useTranslations("SubtitlesResult");
  const error = useTranslations("Error");
  const [appState, setAppState] = useState<AppState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [srtUrl, setSrtUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  const [transcript, setTranscript] = useState<string | undefined>();
  const [cueCount, setCueCount] = useState<number | undefined>();
  const [wordCount, setWordCount] = useState<number | undefined>();
  const [outputFormat, setOutputFormat] =
    useState<SubtitleOutputFormat>("srt");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateSubtitles(
    file: File,
    wordsPerSegment: number,
    selectedOutputFormat: SubtitleOutputFormat
  ) {
    const payload = await createSubtitles(
      file,
      wordsPerSegment,
      selectedOutputFormat
    );
    setJobId(payload.jobId);
    setSrtUrl(null);
    setDownloadUrl(undefined);
    setTranscript(undefined);
    setCueCount(undefined);
    setWordCount(undefined);
    setOutputFormat(payload.outputFormat ?? selectedOutputFormat);
    setErrorMessage("");
    setAppState("loading");
  }

  const handleCompleted = useCallback(
    (payload: JobResponse) => {
      const finalSrtUrl = payload.srtUrl ?? payload.downloadUrl;

      if (!finalSrtUrl) {
        setErrorMessage(result("missingUrlError"));
        setAppState("error");
        return;
      }

      setSrtUrl(finalSrtUrl);
      setDownloadUrl(payload.downloadUrl);
      setTranscript(payload.transcript);
      setCueCount(payload.cueCount);
      setWordCount(payload.wordCount);
      setOutputFormat(payload.outputFormat ?? outputFormat);
      setAppState("success");
    },
    [outputFormat, result]
  );

  const handleFailed = useCallback((message: string) => {
    setErrorMessage(message);
    setAppState("error");
  }, []);

  function reset() {
    setAppState("idle");
    setJobId(null);
    setSrtUrl(null);
    setDownloadUrl(undefined);
    setTranscript(undefined);
    setCueCount(undefined);
    setWordCount(undefined);
    setOutputFormat("srt");
    setErrorMessage("");
  }

  if (appState === "loading" && jobId) {
    return (
      <SubtitlesLoadingState
        jobId={jobId}
        onCompleted={handleCompleted}
        onFailed={handleFailed}
      />
    );
  }

  if (appState === "success" && srtUrl) {
    return (
      <SubtitlesResultView
        srtUrl={srtUrl}
        downloadUrl={downloadUrl}
        transcript={transcript}
        cueCount={cueCount}
        wordCount={wordCount}
        outputFormat={outputFormat}
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

  return <CreateSubtitlesForm onSubmit={handleCreateSubtitles} />;
}
