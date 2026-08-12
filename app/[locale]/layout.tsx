import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
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
          <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pt-6">
            <Link
              href="/"
              className="text-sm font-black uppercase tracking-[0.2em] text-ink"
            >
              {seo("siteName")}
            </Link>
            <nav
              aria-label={home("navigation.label")}
              className="flex flex-wrap items-center gap-4 text-sm font-black text-ink/64"
            >
              <Link href="/create" className="transition hover:text-ocean">
                {home("createCta")}
              </Link>
              <Link
                href="/video-to-mp3-converter"
                className="transition hover:text-ocean"
              >
                {home("navigation.videoToMp3")}
              </Link>
              <Link
                href="/audio-to-subtitles"
                className="transition hover:text-ocean"
              >
                {home("navigation.audioToSubtitles")}
              </Link>
              <Link href="/share-video" className="transition hover:text-ocean">
                {home("navigation.shareVideo")}
              </Link>
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
