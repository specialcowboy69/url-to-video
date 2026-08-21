import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { seoPageSlugs, siteUrl } from "@/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...routing.locales.flatMap((locale) => [
      {
        url: `${siteUrl}/${locale}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: locale === routing.defaultLocale ? 1 : 0.95,
      },
      {
        url: `${siteUrl}/${locale}/create`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${locale}/video-to-mp3-converter`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.82,
      },
      {
        url: `${siteUrl}/${locale}/audio-to-subtitles`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.82,
      },
      {
        url: `${siteUrl}/${locale}/share-video`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.82,
      },
      ...seoPageSlugs.map((slug) => ({
        url: `${siteUrl}/${locale}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: slug === "text-to-video-ai" ? 0.86 : 0.84,
      })),
      {
        url: `${siteUrl}/${locale}/privacy`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.35,
      },
      {
        url: `${siteUrl}/${locale}/terms`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.35,
      },
    ]),
  ];
}
