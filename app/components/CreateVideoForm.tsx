"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { ModeToggle } from "@/app/components/ModeToggle";
import type { MediaMode } from "@/app/types";

type CreateVideoFormProps = {
  onSubmit: (sourceUrl: string, mediaMode: MediaMode) => Promise<void>;
};

export function CreateVideoForm({ onSubmit }: CreateVideoFormProps) {
  const t = useTranslations("Create");
  const [sourceUrl, setSourceUrl] = useState("");
  const [mediaMode, setMediaMode] = useState<MediaMode>("videos");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    if (!sourceUrl.trim()) {
      setLocalError(t("emptyUrlError"));
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(sourceUrl.trim(), mediaMode);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : t("startError")
      );
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none text-ink sm:text-7xl">
            {t("title")}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-ink/10 bg-white/88 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <label className="relative flex min-h-16 items-center rounded-2xl border border-ink/12 bg-white px-4 focus-within:border-ocean">
              <Link2
                className="mr-3 shrink-0 text-ocean"
                size={22}
                aria-hidden
              />
              <span className="sr-only">{t("urlLabel")}</span>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                disabled={submitting}
                inputMode="url"
                placeholder={t("placeholder")}
                className="h-14 w-full border-0 bg-transparent text-base font-medium text-ink outline-none placeholder:text-ink/35"
              />
            </label>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink/58">
              {t("urlNotice")}
            </p>
          </div>

          <div className="w-full lg:w-[280px]">
            <p className="mb-2 text-center text-sm font-black text-ink/68 lg:text-left">
              {t("modeLabel")}
            </p>
            <ModeToggle
              value={mediaMode}
              onChange={setMediaMode}
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-14 min-w-40 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
          >
            <span>{submitting ? t("submitting") : t("submit")}</span>
            <ArrowRight size={19} aria-hidden />
          </button>
        </div>

        {localError ? (
          <p className="mt-4 rounded-2xl bg-coral/12 px-4 py-3 text-sm font-semibold text-ink">
            {localError}
          </p>
        ) : null}
      </form>
    </section>
  );
}
