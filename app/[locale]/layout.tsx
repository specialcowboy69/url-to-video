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
  const footerCopy =
    locale === "es"
      ? {
          resources: "Recursos",
          convertBlogPost: "Convertir blog post en video",
          articleQuestion: "Como crear un video desde un articulo",
          mp4ToMp3: "Convertidor MP4 a MP3",
          videoToMp3Question: "Como convertir video a MP3",
          facelessReels: "Generador de faceless reels",
          freeTextToVideo: "Text to video AI gratis",
          product: "Producto",
          articleToVideo: "Article to Video AI",
          textToVideo: "Text to Video AI",
          videoToMp3: "Video to MP3",
        }
      : {
          resources: "Resources",
          convertBlogPost: "Convert blog post to video",
          articleQuestion: "How to make a video from an article",
          mp4ToMp3: "MP4 to MP3 converter",
          videoToMp3Question: "How to convert video to MP3",
          facelessReels: "Faceless reels generator",
          freeTextToVideo: "Free text to video AI",
          product: "Product",
          articleToVideo: "Article to Video AI",
          textToVideo: "Text to Video AI",
          videoToMp3: "Video to MP3",
        };

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-3 z-40 mx-auto mt-4 flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between gap-2 rounded-[28px] border border-white/70 bg-white/78 px-3 py-2 shadow-[0_18px_60px_rgba(11,114,133,0.14)] backdrop-blur-xl sm:w-[calc(100%-2.5rem)] sm:gap-4 sm:px-5 sm:py-3">
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
                className="h-8 w-auto sm:h-11"
              />
            </Link>
            <nav
              aria-label={home("navigation.label")}
              className="flex flex-1 flex-wrap items-center justify-end gap-1 text-xs font-extrabold text-ink/64 sm:gap-3 sm:text-sm lg:-ml-12 lg:justify-center"
            >
              <Link
                href="/article-to-video-ai"
                className="rounded-full px-2 py-2 transition hover:bg-mist hover:text-ocean sm:px-3"
              >
                {home("navigation.articleToVideoAi")}
              </Link>
              <Link
                href="/text-to-video-ai"
                className="rounded-full px-2 py-2 transition hover:bg-mist hover:text-ocean sm:px-3"
              >
                {home("navigation.textToVideoAi")}
              </Link>
              <Link
                href="/video-to-mp3-converter"
                className="hidden rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean md:inline-flex"
              >
                {home("navigation.videoToMp3")}
              </Link>
              <Link
                href="/audio-to-subtitles"
                className="hidden rounded-full px-3 py-2 transition hover:bg-mist hover:text-ocean md:inline-flex"
              >
                {home("navigation.audioToSubtitles")}
              </Link>
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full px-2 py-2 transition hover:bg-mist hover:text-ocean sm:px-3 [&::-webkit-details-marker]:hidden">
                  <span>{home("navigation.moreTools")}</span>
                  <ChevronDown
                    size={15}
                    aria-hidden
                    className="transition group-open:rotate-180"
                  />
                </summary>
                <div className="absolute right-0 z-20 mt-3 flex min-w-56 flex-col gap-1 rounded-2xl border border-white/70 bg-white/92 p-2 text-sm shadow-soft backdrop-blur-xl">
                  <Link
                    href="/video-to-mp3-converter"
                    className="rounded-xl px-3 py-2 transition hover:bg-mist hover:text-ocean md:hidden"
                  >
                    {home("navigation.videoToMp3")}
                  </Link>
                  <Link
                    href="/audio-to-subtitles"
                    className="rounded-xl px-3 py-2 transition hover:bg-mist hover:text-ocean md:hidden"
                  >
                    {home("navigation.audioToSubtitles")}
                  </Link>
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
          <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-4">
            <div className="grid gap-8 rounded-[28px] border border-white/70 bg-white/78 p-6 text-sm shadow-sm backdrop-blur md:grid-cols-[1fr_1fr_auto] md:p-8">
              <div>
                <Link
                  href="/"
                  aria-label={seo("siteName")}
                  className="inline-flex rounded-2xl transition hover:opacity-82 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean/25"
                >
                  <Image
                    src="/generated/urltovideo-logo.svg"
                    alt={seo("siteName")}
                    width={150}
                    height={35}
                    className="h-8 w-auto"
                  />
                </Link>
                <p className="mt-3 max-w-sm font-semibold leading-6 text-ink/58">
                  {seo("defaultDescription")}
                </p>
              </div>
              <nav aria-label={footerCopy.resources}>
                <h2 className="text-xs font-black uppercase tracking-[0.16em] text-ocean">
                  {footerCopy.resources}
                </h2>
                <ul className="mt-4 space-y-3 font-bold text-ink/62">
                  <li>
                    <Link
                      href="/convert-blog-post-to-video"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.convertBlogPost}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/questions/how-to-make-a-video-from-an-article"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.articleQuestion}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/mp4-to-mp3-converter"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.mp4ToMp3}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/questions/how-to-convert-video-to-mp3"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.videoToMp3Question}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faceless-reels-generator"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.facelessReels}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/free-text-to-video-ai"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.freeTextToVideo}
                    </Link>
                  </li>
                </ul>
              </nav>
              <nav aria-label={footerCopy.product}>
                <h2 className="text-xs font-black uppercase tracking-[0.16em] text-ocean">
                  {footerCopy.product}
                </h2>
                <ul className="mt-4 space-y-3 font-bold text-ink/62">
                  <li>
                    <Link
                      href="/article-to-video-ai"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.articleToVideo}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/text-to-video-ai"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.textToVideo}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/video-to-mp3-converter"
                      className="transition hover:text-ocean"
                    >
                      {footerCopy.videoToMp3}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </footer>
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
