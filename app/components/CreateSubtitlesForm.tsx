"use client";

import { ArrowRight, FileText, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import type { SubtitleOutputFormat } from "@/app/types";

type CreateSubtitlesFormProps = {
  onSubmit: (
    file: File,
    wordsPerSegment: number,
    outputFormat: SubtitleOutputFormat
  ) => Promise<void>;
};

const maxFileSizeBytes = 500 * 1024 * 1024;
const maxDurationSeconds = 60 * 60;
const minWordsPerSegment = 1;
const maxWordsPerSegment = 20;
const outputFormats: SubtitleOutputFormat[] = ["srt", "vtt", "csv"];
const allowedExtensions = [
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".opus",
  ".flac",
  ".mp4",
  ".webm",
  ".mov",
  ".mkv",
  ".avi",
  ".mpeg",
  ".mpg",
];

function formatMegabytes(bytes: number) {
  return `${Math.max(1, Math.round(bytes / (1024 * 1024)))} MB`;
}

function getMediaDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const media = document.createElement(
      file.type.startsWith("video/") ? "video" : "audio"
    );
    const objectUrl = URL.createObjectURL(file);

    media.preload = "metadata";
    media.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(media.duration);
    };
    media.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("metadata"));
    };
    media.src = objectUrl;
  });
}

function isAllowedMedia(file: File) {
  const name = file.name.toLowerCase();

  return (
    file.type.startsWith("audio/") ||
    file.type.startsWith("video/") ||
    allowedExtensions.some((extension) => name.endsWith(extension))
  );
}

function clampWordsPerSegment(value: number) {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.min(maxWordsPerSegment, Math.max(minWordsPerSegment, value));
}

export function CreateSubtitlesForm({ onSubmit }: CreateSubtitlesFormProps) {
  const t = useTranslations("Subtitles");
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [wordsPerSegment, setWordsPerSegment] = useState(5);
  const [outputFormat, setOutputFormat] =
    useState<SubtitleOutputFormat>("srt");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setLocalError(null);
    setFile(event.target.files?.[0] ?? null);
  }

  function handleWordsChange(event: ChangeEvent<HTMLInputElement>) {
    setWordsPerSegment(clampWordsPerSegment(Number(event.target.value)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!file) {
      setLocalError(t("emptyFileError"));
      return;
    }

    if (file.size > maxFileSizeBytes) {
      setLocalError(t("fileTooLargeError"));
      return;
    }

    if (!isAllowedMedia(file)) {
      setLocalError(t("invalidFileError"));
      return;
    }

    try {
      const duration = await getMediaDuration(file);

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
      await onSubmit(file, wordsPerSegment, outputFormat);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : t("startError"));
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
          className="flex min-h-64 w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-ink/14 bg-mist/55 px-6 text-center transition hover:border-ocean disabled:cursor-not-allowed disabled:opacity-65"
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*"
            disabled={submitting}
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-ocean shadow-sm">
            {file ? <FileText size={30} /> : <UploadCloud size={30} />}
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
          <span className="text-sm font-black text-ink">
            {t("wordsPerSegmentLabel")}
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-ink/58">
            {t("wordsPerSegmentHint")}
          </span>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min={minWordsPerSegment}
              max={maxWordsPerSegment}
              value={wordsPerSegment}
              disabled={submitting}
              onChange={handleWordsChange}
              className="w-full accent-ocean"
            />
            <input
              type="number"
              min={minWordsPerSegment}
              max={maxWordsPerSegment}
              value={wordsPerSegment}
              disabled={submitting}
              onChange={handleWordsChange}
              className="h-12 w-20 rounded-xl border border-ink/12 px-3 text-center text-sm font-black text-ink"
            />
          </div>
        </label>

        <div className="mt-5 rounded-2xl bg-white px-4 py-4">
          <p className="text-sm font-black text-ink">{t("formatLabel")}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink/58">
            {t("formatHint")}
          </p>
          <div
            className="mt-4 grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label={t("formatLabel")}
          >
            {outputFormats.map((format) => {
              const selected = outputFormat === format;

              return (
                <button
                  key={format}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={submitting}
                  onClick={() => setOutputFormat(format)}
                  className={`h-12 rounded-xl px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-65 ${
                    selected
                      ? "bg-ink text-white"
                      : "bg-mist text-ink/64 hover:bg-white"
                  }`}
                >
                  {t(`formats.${format}`)}
                </button>
              );
            })}
          </div>
        </div>

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
