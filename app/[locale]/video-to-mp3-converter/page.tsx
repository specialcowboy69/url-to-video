import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateAudioExperience } from "@/app/components/CreateAudioExperience";
import { siteUrl } from "@/app/seo";

type VideoToMp3PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: VideoToMp3PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("mp3Title"),
    description: t("mp3Description"),
    alternates: {
      canonical: `${siteUrl}/${locale}/video-to-mp3-converter`,
      languages: {
        es: `${siteUrl}/es/video-to-mp3-converter`,
        en: `${siteUrl}/en/video-to-mp3-converter`,
      },
    },
  };
}

export default async function VideoToMp3Page({
  params,
}: VideoToMp3PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CreateAudioExperience />
    </main>
  );
}
