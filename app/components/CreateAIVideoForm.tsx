"use client";

import { ArrowRight, CheckCircle2, Link2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { InputModeToggle } from "@/app/components/InputModeToggle";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { RecommendedSources } from "@/app/components/RecommendedSources";
import {
  maxArticleTextLength,
  minArticleTextLength,
} from "@/app/lib/videoInputLimits";
import type {
  CreateVideoInitialValues,
  InputMode,
  VideoLanguage,
} from "@/app/types";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          action: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type CreateAIVideoFormProps = {
  initialValues: CreateVideoInitialValues;
  onSubmit: (
    input: string,
    inputMode: InputMode,
    language: VideoLanguage,
    turnstileToken: string
  ) => Promise<void>;
};

export function CreateAIVideoForm({
  initialValues,
  onSubmit,
}: CreateAIVideoFormProps) {
  const t = useTranslations("CreateAI");
  const [sourceUrl, setSourceUrl] = useState(initialValues.sourceUrl);
  const [articleText, setArticleText] = useState(initialValues.articleText);
  const [inputMode, setInputMode] = useState<InputMode>(initialValues.inputMode);
  const [language, setLanguage] = useState<VideoLanguage>(initialValues.language);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const featureCards = [
    t("featureCards.aiImages"),
    t("featureCards.subtitles"),
    t("featureCards.voice"),
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryInputMode = searchParams.get("inputMode");
    const querySourceUrl = searchParams.get("sourceUrl");
    const queryArticleText = searchParams.get("articleText");
    const queryLanguage = searchParams.get("language");

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

  useEffect(() => {
    if (
      !turnstileSiteKey ||
      !turnstileReady ||
      !turnstileRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current =
      window.turnstile?.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
        action: "article_to_video_ai",
      }) ?? null;

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileReady, turnstileSiteKey]);

  function resetTurnstile() {
    setTurnstileToken("");

    if (widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current);
    }
  }

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

    if (!turnstileSiteKey) {
      setLocalError(t("captcha.configError"));
      return;
    }

    if (!turnstileToken) {
      setLocalError(t("captcha.required"));
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(input, inputMode, language, turnstileToken);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : t("startError"));
      resetTurnstile();
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-10">
      <div className="mb-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-black text-ocean shadow-sm">
          <Sparkles size={17} aria-hidden />
          <span>{t("eyebrow")}</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-none text-ink sm:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">
          {t("description")}
        </p>
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
                  <Link2 className="mr-3 shrink-0 text-ocean" size={22} aria-hidden />
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
              className="flex h-14 min-w-44 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65 lg:mt-1"
            >
              <span>{submitting ? t("submitting") : t("submit")}</span>
              <ArrowRight size={19} aria-hidden />
            </button>
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

          <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
            <p className="mb-3 text-sm font-black text-ink/68">
              {t("captcha.label")}
            </p>
            {turnstileSiteKey ? (
              <>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="afterInteractive"
                  onLoad={() => setTurnstileReady(true)}
                />
                <div ref={turnstileRef} />
              </>
            ) : (
              <p className="text-sm font-semibold text-coral">
                {t("captcha.configError")}
              </p>
            )}
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