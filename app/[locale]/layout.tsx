import type { Metadata } from "next";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Link, routing, type Locale } from "@/i18n/routing";
import { localeAlternates, siteUrl } from "@/app/seo";
import { CookieConsent } from "@/app/components/CookieConsent";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    applicationName: t("siteName"),
    keywords: [
      "convertir URL en video",
      "URL to video AI",
      "convertir articulo en video",
      "video vertical con IA",
      "content repurposing",
    ],
    authors: [{ name: t("siteName") }],
    creator: t("siteName"),
    publisher: t("siteName"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: localeAlternates(),
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/${locale}`,
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const messages = await getMessages();
  const home = await getTranslations({ locale, namespace: "Home" });
  const seo = await getTranslations({ locale, namespace: "Seo" });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-3 z-40 mx-auto mt-4 flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_18px_60px_rgba(11,114,133,0.14)] backdrop-blur-xl sm:w-[calc(100%-2.5rem)] sm:px-5">
            <Link
              href="/"
              aria-label={seo("siteName")}
              className="flex shrink-0 items-center rounded-2xl px-1 transition hover:opacity-82 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean/25"
            >
              <Image
                src="/generated/urltovideo-logo.svg"
                alt={seo("siteName")}
                width={190}
                height={44}
                priority
                className="h-10 w-auto sm:h-11"
              />
            </Link>
            <nav
              aria-label={home("navigation.label")}
              className="flex flex-1 flex-wrap items-center justify-center gap-2 text-sm font-extrabold text-ink/64 sm:gap-3 lg:-ml-12"
            >
              <Link
                href="/article-to-video-ai"
                className="rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean"
              >
                {home("navigation.articleToVideoAi")}
              </Link>
              <Link
                href="/text-to-video-ai"
                className="rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean"
              >
                {home("navigation.textToVideoAi")}
              </Link>
              <Link
                href="/video-to-mp3-converter"
                className="rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean"
              >
                {home("navigation.videoToMp3")}
              </Link>
              <Link
                href="/audio-to-subtitles"
                className="rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean"
              >
                {home("navigation.audioToSubtitles")}
              </Link>
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean [&::-webkit-details-marker]:hidden">
                  <span>{home("navigation.moreTools")}</span>
                  <ChevronDown
                    size={15}
                    aria-hidden
                    className="transition group-open:rotate-180"
                  />
                </summary>
                <div className="absolute right-0 z-20 mt-3 flex min-w-56 flex-col gap-1 rounded-2xl border border-white/70 bg-white/92 p-2 text-sm shadow-soft backdrop-blur-xl">
                  <Link
                    href="/create"
                    className="rounded-xl px-3 py-2 transition hover:bg-mist hover:text-ocean"
                  >
                    {home("navigation.createStockVideo")}
                  </Link>
                  <Link
                    href="/share-video"
                    className="rounded-xl px-3 py-2 transition hover:bg-mist hover:text-ocean"
                  >
                    {home("navigation.shareVideo")}
                  </Link>
                </div>
              </details>
            </nav>
          </header>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
