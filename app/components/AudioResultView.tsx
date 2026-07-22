"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type AudioResultViewProps = {
  audioUrl: string;
  downloadUrl?: string;
  onReset: () => void;
};

export function AudioResultView({
  audioUrl,
  downloadUrl,
  onReset,
}: AudioResultViewProps) {
  const t = useTranslations("AudioResult");
  const finalDownloadUrl = downloadUrl ?? audioUrl;

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
      <div className="mt-8 w-full max-w-xl rounded-2xl bg-white p-3 shadow-sm">
        <audio controls src={audioUrl} className="w-full" />
      </div>
      <div className="mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={finalDownloadUrl}
          download
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
        >
          <Download size={19} aria-hidden />
          <span>{t("download")}</span>
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
