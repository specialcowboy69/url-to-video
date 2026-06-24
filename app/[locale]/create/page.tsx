import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateVideoExperience } from "@/app/components/CreateVideoExperience";
import { siteUrl } from "@/app/seo";

type CreatePageProps = {
  params: Promise<{
    locale: string;
  }>;
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
      languages: {
        es: `${siteUrl}/es/create`,
        en: `${siteUrl}/en/create`,
      },
    },
  };
}

export default async function CreatePage({ params }: CreatePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <CreateVideoExperience />
    </main>
  );
}
