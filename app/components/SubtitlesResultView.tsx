"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SubtitleOutputFormat } from "@/app/types";

type SubtitlesResultViewProps = {
  srtUrl: string;
  downloadUrl?: string;
  transcript?: string;
  cueCount?: number;
  wordCount?: number;
  outputFormat: SubtitleOutputFormat;
  onReset: () => void;
};

export function SubtitlesResultView({
  srtUrl,
  downloadUrl,
  transcript,
  cueCount,
  wordCount,
  outputFormat,
  onReset,
}: SubtitlesResultViewProps) {
  const t = useTranslations("SubtitlesResult");
  const finalDownloadUrl = downloadUrl ?? srtUrl;
  const formatLabel = outputFormat.toUpperCase();

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-citrus text-ink shadow-soft">
        <CheckCircle2 size={44} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/68">
        {t("subtitle")}
      </p>

      <div className="mt-8 grid w-full max-w-xl gap-3 text-sm font-bold text-ink/62 sm:grid-cols-3">
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          {t("cueCount", { count: cueCount ?? 0 })}
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          {t("wordCount", { count: wordCount ?? 0 })}
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          {t("format", { format: formatLabel })}
        </div>
      </div>

      {transcript ? (
        <div className="mt-5 w-full max-w-xl rounded-2xl bg-white p-5 text-left shadow-sm">
          <p className="text-sm font-black text-ink">{t("transcriptTitle")}</p>
          <p className="mt-3 line-clamp-6 text-sm leading-6 text-ink/64">
            {transcript}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={finalDownloadUrl}
          download
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
        >
          <Download size={19} aria-hidden />
          <span>{t("downloadFormat", { format: formatLabel })}</span>
        </a>
        <button
          type="button"
          onClick={onReset}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
        >
          <RotateCcw size={18} aria-hidden />
          <span>{t("reset")}</span>
        </button>
      </div>
    </section>
  );
}
