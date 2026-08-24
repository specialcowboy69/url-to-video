export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://urltovideo.es";

export const siteName = "URL to Video";

export const defaultDescription =
  "Convierte una URL publica en un video vertical con guion, voz, subtitulos y material visual generado para redes sociales.";

export const seoPageSlugs = [
  "article-to-video-ai",
  "text-to-video-ai",
  "convert-blog-post-to-video",
  "mp4-to-mp3-converter",
  "faceless-reels-generator",
  "free-text-to-video-ai",
  "questions/how-to-make-a-video-from-an-article",
  "questions/how-to-convert-video-to-mp3",
  "questions/can-i-convert-video-to-mp3-online",
  "questions/is-online-video-to-mp3-converter-free",
  "questions/what-video-formats-can-i-convert-to-mp3",
  "questions/how-to-download-mp3-from-video",
  "questions/is-it-safe-to-convert-video-to-mp3-online",
  "questions/can-i-convert-large-video-files-to-mp3",
  "questions/what-are-faceless-reels",
  "questions/how-to-make-faceless-reels",
  "questions/can-ai-create-faceless-reels",
  "questions/how-to-turn-an-article-into-a-faceless-reel",
  "questions/is-text-to-video-ai-free",
  "questions/can-i-make-ai-videos-from-text-without-login",
  "questions/can-ai-turn-text-into-a-video-with-voice",
  "questions/what-is-the-best-free-text-to-video-ai",
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
