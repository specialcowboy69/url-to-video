import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateVideoExperience } from "@/app/components/CreateVideoExperience";
import { localeAlternates, siteUrl } from "@/app/seo";
import type { CreateVideoInitialValues } from "@/app/types";

type CreatePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const defaultInitialValues: CreateVideoInitialValues = {
  inputMode: "url",
  sourceUrl: "",
  articleText: "",
  mediaMode: "videos",
  language: "es",
};

export async function generateMetadata({
  params,
}: CreatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("createTitle"),
    description: t("createDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/create`,
      languages: localeAlternates("/create"),
    },
  };
}

export default async function CreatePage({
  params,
}: CreatePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CreateVideoExperience initialValues={defaultInitialValues} />
    </main>
  );
}
