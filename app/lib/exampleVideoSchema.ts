import {
  exampleVideoEncodingFormat,
  exampleVideoHeight,
  exampleVideos,
  exampleVideoWidth,
} from "@/app/data/exampleVideos";
import { siteUrl } from "@/app/seo";

type BuildExampleVideoSchemaOptions = {
  locale: string;
  pagePath?: string;
  text: (key: string) => string;
};

export function buildExampleVideoSchema({
  locale,
  pagePath = "",
  text,
}: BuildExampleVideoSchemaOptions) {
  return exampleVideos.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: text(`items.${video.id}.title`),
    description: text(`items.${video.id}.description`),
    contentUrl: video.videoUrl,
    url: `${siteUrl}/${locale}${pagePath}`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    encodingFormat: exampleVideoEncodingFormat,
    width: exampleVideoWidth,
    height: exampleVideoHeight,
    inLanguage: locale,
  }));
}

