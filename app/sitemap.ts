import type { MetadataRoute } from "next";
import { siteUrl, useCases } from "@/app/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/create`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...useCases.map((useCase) => ({
      url: `${siteUrl}/use-cases/${useCase.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
