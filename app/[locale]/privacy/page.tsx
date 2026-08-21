import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/app/[locale]/legal-page";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.privacy" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/privacy`,
      languages: localeAlternates("/privacy"),
    },
    ...pageSocialMetadata({ locale, path: "/privacy", title, description }),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      locale={locale}
      namespace="privacy"
      sectionKeys={["data", "purpose", "sensitive", "providers", "contact"]}
    />
  );
}
