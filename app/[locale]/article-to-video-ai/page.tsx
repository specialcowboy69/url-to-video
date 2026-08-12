import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateAIVideoExperience } from "@/app/components/CreateAIVideoExperience";
import { localeAlternates, siteUrl } from "@/app/seo";
import type { CreateVideoInitialValues } from "@/app/types";

type ArticleToVideoAIPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const defaultInitialValues: CreateVideoInitialValues = {
  inputMode: "url",
  sourceUrl: "",
  articleText: "",
  mediaMode: "images",
  language: "es",
};

export async function generateMetadata({
  params,
}: ArticleToVideoAIPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("aiVideoTitle"),
    description: t("aiVideoDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/article-to-video-ai`,
      languages: localeAlternates("/article-to-video-ai"),
    },
  };
}

export default async function ArticleToVideoAIPage({
  params,
}: ArticleToVideoAIPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CreateAIVideoExperience initialValues={defaultInitialValues} />
    </main>
  );
}
