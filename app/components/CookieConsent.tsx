"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";

const GA_MEASUREMENT_ID = "G-3L59024KPH";
const STORAGE_KEY = "urltovideo_cookie_consent";

type CookieConsentValue = "all" | "essential";

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "all" || stored === "essential") {
      setConsent(stored);
    }

    setIsReady(true);
  }, []);

  const saveConsent = (value: CookieConsentValue) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  const shouldLoadAnalytics = consent === "all";
  const shouldShowBanner = isReady && consent === null;

  return (
    <>
      {shouldLoadAnalytics ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      ) : null}

      {shouldShowBanner ? (
        <section
          aria-label={t("ariaLabel")}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-2xl border border-ink/10 bg-white p-4 shadow-soft sm:p-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase text-ocean">
                {t("eyebrow")}
              </p>
              <h2 className="mt-1 text-xl font-black text-ink">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-60">
              <button
                type="button"
                onClick={() => saveConsent("all")}
                className="rounded-xl bg-citrus px-5 py-3 text-sm font-black text-ink shadow-[0_12px_30px_rgba(215,255,71,0.45)] transition hover:-translate-y-0.5 hover:bg-[#c9f43a]"
              >
                {t("acceptAll")}
              </button>
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="rounded-xl border border-ink/15 bg-white px-5 py-3 text-sm font-black text-ink/70 transition hover:border-ink/25 hover:bg-mist hover:text-ink"
              >
                {t("essentialOnly")}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}