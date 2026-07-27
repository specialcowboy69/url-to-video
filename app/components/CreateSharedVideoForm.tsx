"use client";

import { ArrowRight, Copy, FileVideo, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createSharedVideo } from "@/app/lib/api";
import type { CreateSharedVideoResponse } from "@/app/types";

const maxFileSizeBytes = 1024 * 1024 * 1024;
const maxDurationSeconds = 60 * 60;
const allowedExtensions = [".mp4", ".webm", ".mov", ".mkv", ".avi", ".mpeg", ".mpg"];

function formatMegabytes(bytes: number) {
  return `${Math.max(1, Math.round(bytes / (1024 * 1024)))} MB`;
}

function isAllowedVideo(file: File) {
  const name = file.name.toLowerCase();

  return (
    file.type.startsWith("video/") ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

function getVideoDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("metadata"));
    };
    video.src = objectUrl;
  });
}

function normalizeSlugInput(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function CreateSharedVideoForm() {
  const t = useTranslations("ShareVideo");
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateSharedVideoResponse | null>(null);
  const [copied, setCopied] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setLocalError(null);
    setResult(null);
    setFile(event.target.files?.[0] ?? null);
  }

  function handleSlugChange(event: ChangeEvent<HTMLInputElement>) {
    setSlug(normalizeSlugInput(event.target.value));
  }

  async function handleCopy() {
    if (!result?.shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(result.shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    setResult(null);

    if (!file) {
      setLocalError(t("emptyFileError"));
      return;
    }

    if (file.size > maxFileSizeBytes) {
      setLocalError(t("fileTooLargeError"));
      return;
    }

    if (!isAllowedVideo(file)) {
      setLocalError(t("invalidFileError"));
      return;
    }

    try {
      const duration = await getVideoDuration(file);

      if (Number.isFinite(duration) && duration > maxDurationSeconds) {
        setLocalError(t("durationTooLongError"));
        return;
      }
    } catch {
      setLocalError(t("metadataError"));
      return;
    }

    setSubmitting(true);

    try {
      const payload = await createSharedVideo(file, slug);
      setResult(payload);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : t("startError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-5 py-10">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none text-ink sm:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink/64">
          {t("description")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-ink/10 bg-white/88 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        <button
          type="button"
          disabled={submitting}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-60 w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-ink/14 bg-mist/55 px-6 text-center transition hover:border-ocean disabled:cursor-not-allowed disabled:opacity-65"
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            disabled={submitting}
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-ocean shadow-sm">
            {file ? <FileVideo size={30} /> : <UploadCloud size={30} />}
          </div>
          <span className="text-xl font-black text-ink">
            {file ? file.name : t("dropTitle")}
          </span>
          <span className="mt-3 max-w-lg text-sm font-semibold leading-6 text-ink/58">
            {file
              ? t("selectedFile", { size: formatMegabytes(file.size) })
              : t("dropSubtitle")}
          </span>
        </button>

        <label className="mt-5 block rounded-2xl bg-white px-4 py-4">
          <span className="text-sm font-black text-ink">{t("slugLabel")}</span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-ink/58">
            {t("slugHint")}
          </span>
          <input
            type="text"
            value={slug}
            disabled={submitting}
            onChange={handleSlugChange}
            placeholder={t("slugPlaceholder")}
            className="mt-4 h-14 w-full rounded-2xl border border-ink/12 bg-mist/45 px-4 text-sm font-bold text-ink outline-none transition focus:border-ocean"
          />
        </label>

        <div className="mt-4 grid gap-3 text-sm font-bold text-ink/62 sm:grid-cols-2">
          <div className="rounded-2xl bg-white px-4 py-3">
            {t("sizeLimit")}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3">
            {t("durationLimit")}
          </div>
        </div>

        {localError ? (
          <p className="mt-4 rounded-2xl bg-coral/12 px-4 py-3 text-sm font-semibold text-ink">
            {localError}
          </p>
        ) : null}

        {result?.shareUrl ? (
          <div className="mt-4 rounded-2xl border border-ocean/20 bg-white p-4">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">
              {t("resultEyebrow")}
            </p>
            <a
              href={result.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block break-all text-lg font-black text-ink underline decoration-ocean/30 underline-offset-4"
            >
              {result.shareUrl}
            </a>
            <p className="mt-2 text-sm font-semibold text-ink/58">
              {t("expiresAt", {
                date: result.expiresAt
                  ? new Date(result.expiresAt).toLocaleString()
                  : "",
              })}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-sm font-black text-white transition hover:bg-ocean"
            >
              <Copy size={17} aria-hidden />
              <span>{copied ? t("copied") : t("copy")}</span>
            </button>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
        >
          <span>{submitting ? t("submitting") : t("submit")}</span>
          <ArrowRight size={19} aria-hidden />
        </button>
      </form>
    </section>
  );
}
