import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  const seo = await getTranslations({ locale, namespace: "SubtitlesSeo" });

  const faqs = [
    {
      question: seo("faq.items.formats.question"),
      answer: seo("faq.items.formats.answer"),
    },
    {
      question: seo("faq.items.segments.question"),
      answer: seo("faq.items.segments.answer"),
    },
    {
      question: seo("faq.items.privacy.question"),
      answer: seo("faq.items.privacy.answer"),
    },
  ];

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CreateSubtitlesExperience />
      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr,0.9fr]">
          <div>
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
          <ol className="grid gap-3">
            {["upload", "transcribe", "download"].map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <span className="text-sm font-black uppercase tracking-[0.16em] text-ocean">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-black text-ink">
                  {seo(`howItWorks.steps.${step}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {seo(`howItWorks.steps.${step}.text`)}
                </p>
              </li>
            ))}
          </ol>
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
        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
