import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Captions,
  CheckCircle2,
  Clock3,
  Download,
  FileAudio,
  FileText,
  GraduationCap,
  Mic2,
  Shield,
  SlidersHorizontal,
  UploadCloud,
  Video,
} from "lucide-react";
import { CreateSubtitlesExperience } from "@/app/components/CreateSubtitlesExperience";
import { localeAlternates, siteUrl } from "@/app/seo";

type AudioToSubtitlesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: AudioToSubtitlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("srtTitle"),
    description: t("srtDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/audio-to-subtitles`,
      languages: localeAlternates("/audio-to-subtitles"),
    },
  };
}

export default async function AudioToSubtitlesPage({
  params,
}: AudioToSubtitlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations({ locale, namespace: "Seo" });
  const seo = await getTranslations({ locale, namespace: "SubtitlesSeo" });

  const steps = [
    { key: "upload", icon: UploadCloud },
    { key: "transcribe", icon: Captions },
    { key: "download", icon: Download },
  ];
  const features = [
    { key: "timestamps", icon: Clock3 },
    { key: "segments", icon: SlidersHorizontal },
    { key: "formats", icon: FileText },
    { key: "privacy", icon: Shield },
    { key: "speech", icon: Mic2 },
    { key: "noSignup", icon: CheckCircle2 },
  ];
  const formatItems = ["mp3", "wav", "m4a", "mp4", "webm"];
  const useCases = [
    { key: "creators", icon: Video },
    { key: "editors", icon: Captions },
    { key: "education", icon: GraduationCap },
  ];
  const comparisonRows = ["time", "timestamps", "cost", "exports"];
  const faqs = [
    "srt",
    "mp3",
    "precision",
    "compatibility",
    "formats",
    "segments",
    "privacy",
  ].map((key) => ({
    question: seo(`faq.items.${key}.question`),
    answer: seo(`faq.items.${key}.answer`),
  }));

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: meta("srtTitle"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${locale}/audio-to-subtitles`,
    description: meta("srtDescription"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo("howItWorks.title"),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: seo(`howItWorks.steps.${step.key}.title`),
      text: seo(`howItWorks.steps.${step.key}.text`),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
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
          __html: JSON.stringify([
            webApplicationSchema,
            howToSchema,
            faqSchema,
          ]),
        }}
      />
      <CreateSubtitlesExperience />
      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {seo("howItWorks.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/66">
              {seo("howItWorks.description")}
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
              <li
                key={step.key}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
                  <Icon size={23} aria-hidden />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.16em] text-ocean">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-black text-ink">
                  {seo(`howItWorks.steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`howItWorks.steps.${step.key}.text`)}
                </p>
              </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {seo("features.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {seo("features.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.key}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
                  <Icon size={23} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-ink">
                  {seo(`features.items.${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`features.items.${feature.key}.text`)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("formats.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {seo("formats.title")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {formatItems.map((format) => (
              <article
                key={format}
                className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-ocean">
                  <FileAudio size={21} aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-black text-ink">
                  {seo(`formats.items.${format}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`formats.items.${format}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {seo("useCases.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {seo("useCases.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <article
                key={useCase.key}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
                  <Icon size={23} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-black text-ink">
                  {seo(`useCases.items.${useCase.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`useCases.items.${useCase.key}.text`)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {seo("comparison.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {seo("comparison.title")}
            </h2>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
            <div className="grid grid-cols-[1.2fr,1fr,1fr] bg-ink px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
              <span>{seo("comparison.headers.feature")}</span>
              <span>{seo("comparison.headers.ours")}</span>
              <span>{seo("comparison.headers.manual")}</span>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row}
                className="grid grid-cols-[1.2fr,1fr,1fr] gap-3 border-t border-ink/10 px-4 py-4 text-sm font-semibold text-ink/66"
              >
                <span className="font-black text-ink">
                  {seo(`comparison.rows.${row}.feature`)}
                </span>
                <span>{seo(`comparison.rows.${row}.ours`)}</span>
                <span>{seo(`comparison.rows.${row}.manual`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {seo("faq.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {seo("faq.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
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
