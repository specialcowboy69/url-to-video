import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  BookOpenText,
  Captions,
  CheckCircle2,
  FileText,
  GraduationCap,
  Languages,
  MinusCircle,
  Newspaper,
  PenLine,
  Radio,
  ScrollText,
  ShoppingBag,
  Video,
} from "lucide-react";
import { CreateAIVideoExperience } from "@/app/components/CreateAIVideoExperience";
import { ExampleVideos } from "@/app/components/ExampleVideos";
import { buildExampleVideoSchema } from "@/app/lib/exampleVideoSchema";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import type { CreateVideoInitialValues, VideoLanguage } from "@/app/types";

type ArticleToVideoAIPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function getInitialValues(locale: string): CreateVideoInitialValues {
  const language: VideoLanguage = locale === "es" ? "es" : "en";

  return {
    inputMode: "url",
    sourceUrl: "",
    articleText: "",
    mediaMode: "images",
    language,
  };
}

const useCases = [
  { key: "blogPosts", icon: PenLine },
  { key: "newsArticles", icon: Newspaper },
  { key: "productPages", icon: ShoppingBag },
  { key: "education", icon: GraduationCap },
  { key: "seoContent", icon: BookOpenText },
  { key: "newsletters", icon: ScrollText },
] as const;

const steps = [
  { key: "paste", icon: FileText },
  { key: "visuals", icon: Video },
  { key: "language", icon: Languages },
  { key: "download", icon: Captions },
] as const;

const comparisonRows = [
  "time",
  "script",
  "voice",
  "subtitles",
  "visuals",
  "bestFor",
] as const;

const tipKeys = [
  "publicUrls",
  "clearIdea",
  "blockedUrls",
  "language",
  "pacing",
] as const;

const faqKeys = ["anyUrl", "paywall", "blogs", "news", "languages", "shorts"] as const;

export async function generateMetadata({
  params,
}: ArticleToVideoAIPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t("aiVideoTitle");
  const description = t("aiVideoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/article-to-video-ai`,
      languages: localeAlternates("/article-to-video-ai"),
    },
    ...pageSocialMetadata({
      locale,
      path: "/article-to-video-ai",
      title,
      description,
    }),
  };
}

export default async function ArticleToVideoAIPage({
  params,
}: ArticleToVideoAIPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await getTranslations({ locale, namespace: "ArticleToVideoSeo" });
  const examples = await getTranslations({ locale, namespace: "Home.examples" });

  const faqItems = faqKeys.map((key) => ({
    question: seo(`faq.items.${key}.question`),
    answer: seo(`faq.items.${key}.answer`),
  }));

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo("steps.title"),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: seo(`steps.items.${step.key}.title`),
      text: seo(`steps.items.${step.key}.text`),
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
  const exampleVideoSchema = buildExampleVideoSchema({
    locale,
    pagePath: "/article-to-video-ai",
    text: examples,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToSchema, faqSchema, ...exampleVideoSchema]),
        }}
      />

      <CreateAIVideoExperience initialValues={getInitialValues(locale)} />
      <ExampleVideos />

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
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    {seo(`steps.items.${step.key}.text`)}
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
            {seo("comparison.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            {seo("comparison.title")}
          </h2>
        </div>
        <div className="mt-8 overflow-x-auto rounded-[28px] border border-white/70 bg-white shadow-soft">
          <div className="grid min-w-[680px] grid-cols-[1.2fr,1fr,1fr] bg-ink px-4 py-4 text-xs font-black uppercase text-white sm:text-sm">
            <span>{seo("comparison.headers.feature")}</span>
            <span className="inline-flex w-fit items-center rounded-full bg-citrus px-3 py-1 text-ink">
              {seo("comparison.headers.ours")}
            </span>
            <span>{seo("comparison.headers.manual")}</span>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row}
              className="grid min-w-[680px] grid-cols-[1.2fr,1fr,1fr] gap-3 border-t border-ink/10 px-4 py-4 text-sm font-semibold text-ink/66 transition hover:bg-ocean/5"
            >
              <span className="font-black text-ink">
                {seo(`comparison.rows.${row}.feature`)}
              </span>
              <span className="flex items-center gap-2 rounded-2xl bg-citrus/28 px-3 py-2 font-black text-ink">
                <CheckCircle2 className="shrink-0 text-ocean" size={17} />
                {seo(`comparison.rows.${row}.ours`)}
              </span>
              <span className="flex items-center gap-2 px-3 py-2">
                <MinusCircle className="shrink-0 text-coral" size={17} />
                {seo(`comparison.rows.${row}.manual`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("tips.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("tips.title")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {tipKeys.map((key) => (
              <article
                key={key}
                className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <Radio
                    className="mt-1 shrink-0 text-ocean"
                    size={19}
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-lg font-black text-ink">
                      {seo(`tips.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink/64">
                      {seo(`tips.items.${key}.text`)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
              <h3 className="text-lg font-black text-ink">{item.question}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/64">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
