"use client";

import { ArrowRight, CheckCircle2, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { InputModeToggle } from "@/app/components/InputModeToggle";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { ModeToggle } from "@/app/components/ModeToggle";
import { RecommendedSources } from "@/app/components/RecommendedSources";
import {
  maxArticleTextLength,
  minArticleTextLength,
} from "@/app/lib/videoInputLimits";
import type {
  CreateVideoInitialValues,
  InputMode,
  MediaMode,
  VideoLanguage,
} from "@/app/types";

type CreateVideoFormProps = {
  initialValues: CreateVideoInitialValues;
  onSubmit: (
    input: string,
    inputMode: InputMode,
    mediaMode: MediaMode,
    language: VideoLanguage
  ) => Promise<void>;
};

export function CreateVideoForm({
  initialValues,
  onSubmit,
}: CreateVideoFormProps) {
  const t = useTranslations("Create");
  const [sourceUrl, setSourceUrl] = useState(initialValues.sourceUrl);
  const [articleText, setArticleText] = useState(initialValues.articleText);
  const [inputMode, setInputMode] = useState<InputMode>(initialValues.inputMode);
  const [mediaMode, setMediaMode] = useState<MediaMode>(initialValues.mediaMode);
  const [language, setLanguage] = useState<VideoLanguage>(initialValues.language);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const featureCards = [
    t("featureCards.stock"),
    t("featureCards.subtitles"),
    t("featureCards.voice"),
  ];
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryInputMode = searchParams.get("inputMode");
    const querySourceUrl = searchParams.get("sourceUrl");
    const queryArticleText = searchParams.get("articleText");
    const queryMediaMode = searchParams.get("mediaMode");
    const queryLanguage = searchParams.get("language");

    if (queryMediaMode === "images" || queryMediaMode === "videos") {
      setMediaMode(queryMediaMode);
    }

    if (queryLanguage === "es" || queryLanguage === "en") {
      setLanguage(queryLanguage);
    }

    if (queryInputMode === "text" && queryArticleText) {
      setInputMode("text");
      setArticleText(queryArticleText.slice(0, maxArticleTextLength));
      return;
    }

    if (querySourceUrl) {
      setInputMode("url");
      setSourceUrl(querySourceUrl.slice(0, 2048));
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const input = inputMode === "text" ? articleText.trim() : sourceUrl.trim();

    if (inputMode === "url" && !input) {
      setLocalError(t("emptyUrlError"));
      return;
    }

    if (inputMode === "text" && input.length < minArticleTextLength) {
      setLocalError(t("emptyTextError"));
      return;
    }

    if (inputMode === "text" && input.length > maxArticleTextLength) {
      setLocalError(t("textTooLongError", { max: maxArticleTextLength }));
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(input, inputMode, mediaMode, language);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : t("startError")
      );
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="max-w-3xl text-5xl font-black leading-none text-ink sm:text-7xl">
            {t("title")}
          </h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {featureCards.map((feature) => (
              <div
                key={feature}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white/82 px-4 text-sm font-bold text-ink shadow-sm"
              >
                <CheckCircle2 className="shrink-0 text-ocean" size={18} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-ink/10 bg-white/88 p-4 shadow-soft backdrop-blur sm:p-6"
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-center text-sm font-black text-ink/68 lg:text-left">
              {t("inputModeLabel")}
            </p>
            <InputModeToggle
              value={inputMode}
              onChange={setInputMode}
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              {inputMode === "text" ? (
                <label className="relative block rounded-2xl border border-ink/12 bg-white px-4 py-3 focus-within:border-ocean">
                  <span className="sr-only">{t("textLabel")}</span>
                  <textarea
                    value={articleText}
                    onChange={(event) => setArticleText(event.target.value)}
                    disabled={submitting}
                    placeholder={t("textPlaceholder")}
                    rows={7}
                    maxLength={maxArticleTextLength}
                    className="min-h-44 w-full resize-y border-0 bg-transparent text-base font-medium leading-7 text-ink outline-none placeholder:text-ink/35"
                  />
                </label>
              ) : (
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
              )}
              <div className="mt-3 flex flex-col gap-2 text-sm font-semibold leading-6 text-ink/58 sm:flex-row sm:items-start sm:justify-between">
                <p>{inputMode === "text" ? t("textNotice") : t("urlNotice")}</p>
                {inputMode === "text" ? (
                  <p className="shrink-0 text-ink/45">
                    {t("textCharacterCount", {
                      count: articleText.trim().length,
                      max: maxArticleTextLength,
                    })}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 min-w-40 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65 lg:mt-1"
            >
              <span>{submitting ? t("submitting") : t("submit")}</span>
              <ArrowRight size={19} aria-hidden />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-center text-sm font-black text-ink/68 lg:text-left">
                {t("modeLabel")}
              </p>
              <ModeToggle
                value={mediaMode}
                onChange={setMediaMode}
                disabled={submitting}
              />
            </div>

            <div>
              <p className="mb-2 text-center text-sm font-black text-ink/68 lg:text-left">
                {t("languageLabel")}
              </p>
              <LanguageToggle
                value={language}
                onChange={setLanguage}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {localError ? (
          <p className="mt-4 rounded-2xl bg-coral/12 px-4 py-3 text-sm font-semibold text-ink">
            {localError}
          </p>
        ) : null}
      </form>

      <RecommendedSources />
    </section>
  );
}
