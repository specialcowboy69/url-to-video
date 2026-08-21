import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  Cloud,
  FileVideo,
  Image,
  Mic2,
  MinusCircle,
  Music,
  UploadCloud,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { CreateVideoExperience } from "@/app/components/CreateVideoExperience";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import type { CreateVideoInitialValues, VideoLanguage } from "@/app/types";

type CreatePageProps = {
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
    mediaMode: "videos",
    language,
  };
}

const featureItems = [
  { key: "cloud", icon: Cloud },
  { key: "subtitles", icon: Captions },
  { key: "visuals", icon: Image },
] as const;

const faqKeys = ["watermark", "signup", "format"] as const;

const comparisonRows = [
  "basePrice",
  "signup",
  "watermark",
  "cloudRender",
  "inputTypes",
] as const;

const suiteTools = [
  { key: "urlVideo", href: "/create", icon: FileVideo },
  { key: "articleAi", href: "/article-to-video-ai", icon: Zap },
  { key: "textAi", href: "/text-to-video-ai", icon: Zap },
  { key: "mp3", href: "/video-to-mp3-converter", icon: Music },
  { key: "subtitles", href: "/audio-to-subtitles", icon: Mic2 },
  { key: "share", href: "/share-video", icon: UploadCloud },
] as const;

export async function generateMetadata({
  params,
}: CreatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  const title = t("createTitle");
  const description = t("createDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/create`,
      languages: localeAlternates("/create"),
    },
    ...pageSocialMetadata({ locale, path: "/create", title, description }),
  };
}

export default async function CreatePage({
  params,
}: CreatePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await getTranslations({ locale, namespace: "CreateSeo" });

  const faqItems = faqKeys.map((key) => ({
    question: seo(`faq.items.${key}.question`),
    answer: seo(`faq.items.${key}.answer`),
  }));

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <CreateVideoExperience initialValues={getInitialValues(locale)} />

      <section className="border-t border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("suite.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("suite.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/66">
              {seo("suite.description")}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suiteTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <article
                  key={tool.key}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0b7285,#d7ff47,#ff6b57)] opacity-80" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
                    <Icon size={23} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-ink transition group-hover:text-ocean">
                    {seo(`suite.items.${tool.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">
                    {seo(`suite.items.${tool.key}.text`)}
                  </p>
                  <Link
                    href={tool.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ocean transition hover:text-ink"
                  >
                    <span>{seo(`suite.items.${tool.key}.cta`)}</span>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-white/70 bg-white/72 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("snippet.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("snippet.title")}
            </h2>
            <div className="mt-6 rounded-[28px] border border-white/70 bg-ink p-1 shadow-soft">
              <p className="rounded-[24px] bg-white px-6 py-5 text-base font-semibold leading-7 text-ink/70">
                {seo("snippet.answer")}
              </p>
            </div>
          </div>
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
            <span>{seo("comparison.headers.paid")}</span>
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
                {seo(`comparison.rows.${row}.paid`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("features.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {seo("features.title")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featureItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.key}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0b7285,#d7ff47)] opacity-80" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
                    <Icon size={23} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-ink transition group-hover:text-ocean">
                    {seo(`features.items.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">
                    {seo(`features.items.${item.key}.text`)}
                  </p>
                </article>
              );
            })}
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
