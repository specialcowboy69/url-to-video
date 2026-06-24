"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getVideoJob } from "@/app/lib/api";
import type { JobResponse } from "@/app/types";

type LoadingStateProps = {
  jobId: string;
  onCompleted: (payload: JobResponse) => void;
  onFailed: (message: string) => void;
};

const fallbackMessages = [
  "Preparando el video",
];

const maxPollingRetries = 5;
const pollingIntervalMs = 4000;
const retryIntervalMs = 5000;

export function LoadingState({
  jobId,
  onCompleted,
  onFailed,
}: LoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const visibleMessage = useMemo(
    () => backendMessage ?? fallbackMessages[messageIndex],
    [backendMessage, messageIndex]
  );

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % fallbackMessages.length);
    }, 8500);

    const elapsedTimer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(messageTimer);
      window.clearInterval(elapsedTimer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    let failedPolls = 0;

    async function pollJob() {
      try {
        const payload = await getVideoJob(jobId);

        if (cancelled) {
          return;
        }

        setBackendMessage(payload.message ?? null);
        failedPolls = 0;
        setRetryCount(0);

        if (payload.status === "completed") {
          onCompleted(payload);
          return;
        }

        if (payload.status === "failed") {
          onFailed(
            payload.error ??
              "No hemos podido procesar esta URL. Revisa que el enlace sea publico e intentalo de nuevo."
          );
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
          onFailed(
            error instanceof Error
              ? error.message
              : "No se ha podido consultar el progreso."
          );
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
  }, [jobId, onCompleted, onFailed]);

  useEffect(() => {
    if (elapsedSeconds >= 600) {
      onFailed(
        "El video esta tardando mas de lo esperado. Puedes intentarlo de nuevo en unos minutos."
      );
    }
  }, [elapsedSeconds, onFailed]);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-white shadow-soft">
        <Loader2 className="animate-spin" size={40} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        Trabajo {jobId.slice(0, 8)}
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">
        {visibleMessage}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/62">
        Estamos montando tu video. Esta pantalla se actualizara sola cada pocos
        segundos. No cierres esta ventana.
      </p>
      {retryCount > 0 ? (
        <p className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/62 shadow-sm">
          Reintentando consulta de estado {retryCount}/{maxPollingRetries}
        </p>
      ) : null}
    </section>
  );
}
