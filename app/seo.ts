export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://urltovideo.es";

export const siteName = "URL to Video";

export const defaultDescription =
  "Convierte una URL publica en un video vertical con guion, voz, subtitulos y material visual generado para redes sociales.";

export const useCaseSlugs = [
  "news-to-video",
  "blog-to-video",
  "product-to-video",
] as const;

export type UseCaseSlug = (typeof useCaseSlugs)[number];

export function isUseCaseSlug(slug: string): slug is UseCaseSlug {
  return (useCaseSlugs as readonly string[]).includes(slug);
}
