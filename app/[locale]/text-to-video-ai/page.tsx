import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CheckCircle2,
  FileText,
  Megaphone,
  Package,
  Radio,
  Sparkles,
  Wand2,
} from "lucide-react";
import { CreateAIVideoExperience } from "@/app/components/CreateAIVideoExperience";
import { maxArticleTextLength } from "@/app/lib/videoInputLimits";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import type { CreateVideoInitialValues, VideoLanguage } from "@/app/types";

type TextToVideoAIPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function getInitialValues(locale: string): CreateVideoInitialValues {
  const language: VideoLanguage = locale === "es" ? "es" : "en";

  return {
    inputMode: "text",
    sourceUrl: "",
    articleText: "",
    mediaMode: "images",
    language,
  };
}

const useCases = [
  { key: "shortScripts", icon: Megaphone },
  { key: "breakingNews", icon: Radio },
  { key: "productSummaries", icon: Package },
] as const;

const steps = [
  { key: "paste", icon: FileText },
  { key: "visuals", icon: Sparkles },
  { key: "download", icon: Wand2 },
] as const;

const faqKeys = ["limit", "visuals", "languages"] as const;

export async function generateMetadata({
  params,
}: TextToVideoAIPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t("textToVideoTitle");
  const description = t("textToVideoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/text-to-video-ai`,
      languages: localeAlternates("/text-to-video-ai"),
    },
    ...pageSocialMetadata({
      locale,
      path: "/text-to-video-ai",
      title,
      description,
    }),
  };
}

export default async function TextToVideoAIPage({
  params,
}: TextToVideoAIPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seo = await getTranslations({ locale, namespace: "TextToVideoSeo" });
  const faqItems = faqKeys.map((key) => ({
    question: seo(`faq.items.${key}.question`),
    answer: seo(`faq.items.${key}.answer`, { max: maxArticleTextLength }),
  }));

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo("steps.title"),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: seo(`steps.items.${step.key}.title`),
      text: seo(`steps.items.${step.key}.text`, { max: maxArticleTextLength }),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToSchema, faqSchema]),
        }}
      />

      <CreateAIVideoExperience
        initialValues={getInitialValues(locale)}
        copyNamespace="TextToVideoAI"
      />

      <section className="border-t border-white/70 bg-white/72 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("explanation.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("explanation.title")}
            </h2>
            <div className="mt-6 rounded-[28px] border border-white/70 bg-ink p-1 shadow-soft">
              <p className="rounded-[24px] bg-white px-6 py-5 text-left text-base font-semibold leading-7 text-ink/70">
                {seo("explanation.answer")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {seo("useCases.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            {seo("useCases.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.key}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0b7285,#d7ff47,#ff6b57)] opacity-80" />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
                  <Icon size={23} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-ink transition group-hover:text-ocean">
                  {seo(`useCases.items.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`useCases.items.${item.key}.text`)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("steps.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("steps.title")}
            </h2>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.key}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <span className="absolute right-4 top-4 text-5xl font-black leading-none text-ocean/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
                    <Icon size={23} aria-hidden />
                  </div>
                  <span className="relative mt-5 block text-sm font-black uppercase tracking-[0.16em] text-ocean">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative mt-2 text-xl font-black text-ink transition group-hover:text-ocean">
                    {seo(`steps.items.${step.key}.title`)}
                  </h3>
                  <p className="relative mt-2 text-sm leading-6 text-ink/64">
                    {seo(`steps.items.${step.key}.text`, {
                      max: maxArticleTextLength,
                    })}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {seo("faq.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            {seo("faq.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-1 shrink-0 text-ocean"
                  size={18}
                  aria-hidden
                />
                <div>
                  <h3 className="text-lg font-black text-ink">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/64">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
