import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type LargeVideoToMp3PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/can-i-convert-large-video-files-to-mp3";
const moneyPath = "/video-to-mp3-converter";
const formatsPath = "/questions/what-video-formats-can-i-convert-to-mp3";

const copy = {
  en: {
    title: "Can I Convert Large Video Files to MP3?",
    description:
      "Learn the current size and duration limits for converting large video files to MP3 online, plus when to split a recording first.",
    eyebrow: "Quick answer",
    h1: "Can I convert large video files to MP3?",
    answer:
      "Yes, as long as the file stays within the current limits. The converter supports videos up to 1 GB and up to one hour long. Larger recordings should be trimmed or split before conversion so the audio extraction stays reliable.",
    stepsTitle: "Large file checklist",
    steps: [
      "Check that the video is no larger than 1 GB.",
      "Keep the recording under one hour when possible.",
      "Use a supported video format with a readable audio track.",
      "Split very long recordings before uploading them.",
    ],
    detailTitle: "Why do limits matter?",
    detail:
      "Long or heavy videos take more time to upload, process and return as MP3. Clear limits keep the browser converter stable and help avoid failed jobs on files that are better handled in smaller parts.",
    nextTitle: "Next step",
    nextText:
      "If your file fits the limits, open the converter. If you are unsure about compatibility, check the supported video formats first.",
    toolCta: "Open the video to MP3 converter",
    formatsCta: "Check supported formats",
  },
  es: {
    title: "Puedo Convertir Videos Grandes a MP3?",
    description:
      "Conoce los limites actuales de tamano y duracion para convertir videos grandes a MP3 online, y cuando conviene dividir una grabacion.",
    eyebrow: "Respuesta rapida",
    h1: "Puedo convertir videos grandes a MP3?",
    answer:
      "Si, siempre que el archivo este dentro de los limites actuales. El convertidor acepta videos de hasta 1 GB y hasta una hora de duracion. Las grabaciones mas grandes deberian cortarse o dividirse antes de la conversion para que la extraccion de audio sea fiable.",
    stepsTitle: "Checklist para archivos grandes",
    steps: [
      "Comprueba que el video no supera 1 GB.",
      "Mantén la grabacion por debajo de una hora cuando sea posible.",
      "Usa un formato de video compatible con una pista de audio legible.",
      "Divide las grabaciones muy largas antes de subirlas.",
    ],
    detailTitle: "Por que importan los limites?",
    detail:
      "Los videos largos o pesados tardan mas en subirse, procesarse y devolverse como MP3. Los limites claros mantienen estable el convertidor desde navegador y ayudan a evitar trabajos fallidos en archivos que conviene manejar por partes.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si tu archivo encaja con los limites, abre el convertidor. Si no tienes clara la compatibilidad, revisa primero los formatos de video aceptados.",
    toolCta: "Abrir el convertidor de video a MP3",
    formatsCta: "Ver formatos compatibles",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: LargeVideoToMp3PageProps): Promise<Metadata> {
  const { locale } = await params;
  const text = getCopy(locale);

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `${siteUrl}/${locale}${pagePath}`,
      languages: localeAlternates(pagePath),
    },
    ...pageSocialMetadata({
      locale,
      path: pagePath,
      title: text.title,
      description: text.description,
    }),
  };
}

export default async function LargeVideoToMp3Page({
  params,
}: LargeVideoToMp3PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = getCopy(locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: text.h1,
        acceptedAnswer: {
          "@type": "Answer",
          text: text.answer,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Questions",
        item: `${siteUrl}/${locale}/questions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: text.title,
        item: `${siteUrl}/${locale}${pagePath}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, breadcrumbSchema]),
        }}
      />

      <article className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm font-bold text-ink/56" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-ocean">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Questions</span>
          </nav>

          <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
            <HelpCircle size={24} aria-hidden />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {text.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {text.h1}
          </h1>

          <section className="mt-8 rounded-[28px] bg-ink p-6 text-white shadow-soft">
            <p className="text-lg font-semibold leading-8 text-white/78">
              {text.answer}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-3xl font-extrabold text-ink">
              {text.stepsTitle}
            </h2>
            <ol className="mt-5 space-y-3">
              {text.steps.map((step) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-2xl border border-white/70 bg-white p-4 text-sm font-semibold leading-6 text-ink/68 shadow-sm"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-ocean"
                    size={18}
                    aria-hidden
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="text-3xl font-extrabold text-ink">
              {text.detailTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/68">
              {text.detail}
            </p>
          </section>

          <section className="mt-10 rounded-[28px] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-extrabold text-ink">
              {text.nextTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/68">
              {text.nextText}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={formatsPath}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean"
              >
                {text.formatsCta}
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={moneyPath}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-citrus px-5 py-3 text-sm font-black text-ink shadow-[0_14px_36px_rgba(215,255,71,0.35)] transition hover:brightness-95"
              >
                {text.toolCta}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
