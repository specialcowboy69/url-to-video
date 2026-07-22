import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreateVideoExperience } from "@/app/components/CreateVideoExperience";
import { maxArticleTextLength } from "@/app/lib/videoInputLimits";
import { siteUrl } from "@/app/seo";
import type {
  CreateVideoInitialValues,
  InputMode,
  MediaMode,
  VideoLanguage,
} from "@/app/types";

type CreatePageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const defaultInitialValues: CreateVideoInitialValues = {
  inputMode: "url",
  sourceUrl: "",
  articleText: "",
  mediaMode: "videos",
  language: "es",
};

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseInputMode(value: string | undefined): InputMode {
  return value === "text" ? "text" : "url";
}

function parseMediaMode(value: string | undefined): MediaMode {
  return value === "images" ? "images" : "videos";
}

function parseLanguage(value: string | undefined): VideoLanguage {
  return value === "en" ? "en" : "es";
}

function truncate(value: string | undefined, maxLength: number) {
  return value ? value.slice(0, maxLength) : "";
}

function getInitialValues(
  searchParams: Record<string, string | string[] | undefined>
): CreateVideoInitialValues {
  const inputMode = parseInputMode(firstSearchParam(searchParams.inputMode));
  const sourceUrl = truncate(firstSearchParam(searchParams.sourceUrl), 2048);
  const articleText = truncate(
    firstSearchParam(searchParams.articleText),
    maxArticleTextLength
  );

  return {
    inputMode: inputMode === "text" && articleText ? "text" : "url",
    sourceUrl,
    articleText,
    mediaMode: parseMediaMode(firstSearchParam(searchParams.mediaMode)),
    language: parseLanguage(firstSearchParam(searchParams.language)),
  };
}

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

export default async function CreatePage({
  params,
  searchParams,
}: CreatePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  setRequestLocale(locale);

  return (
    <main>
      <CreateVideoExperience
        initialValues={{
          ...defaultInitialValues,
          ...getInitialValues(resolvedSearchParams),
        }}
      />
    </main>
  );
}
