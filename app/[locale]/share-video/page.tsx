import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CheckCircle2,
  Clock3,
  Code2,
  Copy,
  FileVideo,
  GraduationCap,
  Link2,
  Shield,
  UploadCloud,
  Users,
  Zap,
} from "lucide-react";
import { CreateSharedVideoForm } from "@/app/components/CreateSharedVideoForm";
import { localeAlternates, siteUrl } from "@/app/seo";

type ShareVideoPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ShareVideoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("shareVideoTitle"),
    description: t("shareVideoDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}/share-video`,
      languages: localeAlternates("/share-video"),
    },
  };
}

export default async function ShareVideoPage({ params }: ShareVideoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = await getTranslations({ locale, namespace: "Seo" });
  const landing = await getTranslations({
    locale,
    namespace: "ShareVideoLanding",
  });

  const steps = [
    { key: "upload", icon: UploadCloud },
    { key: "generate", icon: Link2 },
    { key: "share", icon: Copy },
  ];
  const features = [
    { key: "noAccount", icon: CheckCircle2 },
    { key: "fastPlayback", icon: Zap },
    { key: "privacy", icon: Shield },
    { key: "formats", icon: FileVideo },
  ];
  const useCases = [
    { key: "developers", icon: Code2 },
    { key: "creators", icon: Users },
    { key: "education", icon: GraduationCap },
  ];
  const comparisonRows = ["speed", "permissions", "distractions", "account"];
  const faqs = ["free", "duration", "formats", "security"].map((key) => ({
    question: landing(`faq.items.${key}.question`),
    answer: landing(`faq.items.${key}.answer`),
  }));

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo("shareVideoTitle"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${locale}/share-video`,
    description: seo("shareVideoDescription"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: landing("howTo.title"),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: landing(`howTo.steps.${step.key}.title`),
      text: landing(`howTo.steps.${step.key}.text`),
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
      <CreateSharedVideoForm />

      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {landing("howTo.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {landing("howTo.title")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.key}
                  className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
                    <Icon size={23} aria-hidden />
                  </div>
                  <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-ocean">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-ink">
                    {landing(`howTo.steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">
                    {landing(`howTo.steps.${step.key}.text`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {landing("features.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {landing("features.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                  {landing(`features.items.${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/64">
                  {landing(`features.items.${feature.key}.text`)}
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
              {landing("useCases.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {landing("useCases.title")}
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
                    {landing(`useCases.items.${useCase.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">
                    {landing(`useCases.items.${useCase.key}.text`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {landing("comparison.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {landing("comparison.title")}
          </h2>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr,1fr,1fr,1fr] bg-ink px-4 py-4 text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
            <span>{landing("comparison.headers.feature")}</span>
            <span>{landing("comparison.headers.ours")}</span>
            <span>{landing("comparison.headers.drive")}</span>
            <span>{landing("comparison.headers.youtube")}</span>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row}
              className="grid grid-cols-[1.2fr,1fr,1fr,1fr] gap-3 border-t border-ink/10 px-4 py-4 text-sm font-semibold text-ink/66"
            >
              <span className="font-black text-ink">
                {landing(`comparison.rows.${row}.feature`)}
              </span>
              <span>{landing(`comparison.rows.${row}.ours`)}</span>
              <span>{landing(`comparison.rows.${row}.drive`)}</span>
              <span>{landing(`comparison.rows.${row}.youtube`)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {landing("faq.eyebrow")}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
              {landing("faq.title")}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-mist text-ocean">
                  <Clock3 size={21} aria-hidden />
                </div>
                <h3 className="text-lg font-black text-ink">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/64">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
