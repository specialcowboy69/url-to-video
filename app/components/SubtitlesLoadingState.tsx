"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getSubtitlesJob } from "@/app/lib/api";
import type { JobResponse } from "@/app/types";

type SubtitlesLoadingStateProps = {
  jobId: string;
  onCompleted: (payload: JobResponse) => void;
  onFailed: (message: string) => void;
};

const maxPollingRetries = 5;
const pollingIntervalMs = 4000;
const retryIntervalMs = 5000;

export function SubtitlesLoadingState({
  jobId,
  onCompleted,
  onFailed,
}: SubtitlesLoadingStateProps) {
  const t = useTranslations("SubtitlesLoading");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const elapsedTimer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(elapsedTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    let failedPolls = 0;

    async function pollJob() {
      try {
        const payload = await getSubtitlesJob(jobId);

        if (cancelled) {
          return;
        }

        failedPolls = 0;
        setRetryCount(0);

        if (payload.status === "completed") {
          onCompleted(payload);
          return;
        }

        if (payload.status === "failed") {
          onFailed(payload.error ?? t("fallbackError"));
          return;
        }

        timeoutId = window.setTimeout(pollJob, pollingIntervalMs);
      } catch (error) {
        if (cancelled) {
          return;
        }

        failedPolls += 1;
        setRetryCount(failedPolls);

        if (failedPolls >= maxPollingRetries) {
          onFailed(error instanceof Error ? error.message : t("progressError"));
          return;
        }

        timeoutId = window.setTimeout(pollJob, retryIntervalMs);
      }
    }

    pollJob();

    return () => {
      cancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [jobId, onCompleted, onFailed, t]);

  useEffect(() => {
    if (elapsedSeconds >= 1800) {
      onFailed(t("timeoutError"));
    }
  }, [elapsedSeconds, onFailed, t]);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-white shadow-soft">
        <Loader2 className="animate-spin" size={40} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        {t("job", { jobId: jobId.slice(0, 8) })}
      </p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/62">
        {t("subtitle")}
      </p>
      {retryCount > 0 ? (
        <p className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/62 shadow-sm">
          {t("retry", { retryCount, maxRetries: maxPollingRetries })}
        </p>
      ) : null}
    </section>
  );
}
