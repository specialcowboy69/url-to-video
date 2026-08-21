export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://urltovideo.es";

export const siteName = "URL to Video";

export const defaultDescription =
  "Convierte una URL publica en un video vertical con guion, voz, subtitulos y material visual generado para redes sociales.";

export const seoPageSlugs = [
  "article-to-video-ai",
  "text-to-video-ai",
] as const;

export function localeAlternates(path = "") {
  return {
    en: `${siteUrl}/en${path}`,
    es: `${siteUrl}/es${path}`,
    "x-default": `${siteUrl}/en${path}`,
  };
}

export function pageSocialMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}) {
  const url = `${siteUrl}/${locale}${path}`;

  return {
    openGraph: {
      type: "website" as const,
      url,
      siteName,
      title,
      description,
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}
