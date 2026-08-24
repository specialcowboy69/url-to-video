import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type FreeVideoToMp3QuestionPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/is-online-video-to-mp3-converter-free";
const moneyPath = "/video-to-mp3-converter";
const ladderPath = "/mp4-to-mp3-converter";

const copy = {
  en: {
    title: "Is the Online Video to MP3 Converter Free?",
    description:
      "Learn how the online video to MP3 converter works, what free browser conversion means and which file limits apply.",
    eyebrow: "Quick answer",
    h1: "Is the online video to MP3 converter free?",
    answer:
      "Yes, you can use the browser-based video to MP3 converter without creating an account. The current limits are designed for practical audio extraction: videos can be up to 1 GB and up to one hour long.",
    stepsTitle: "What free conversion includes",
    steps: [
      "Upload a supported video file from your device.",
      "Extract the audio track in the browser tool.",
      "Download the generated MP3 when processing finishes.",
      "Stay within the current 1 GB and one hour file limits.",
    ],
    detailTitle: "What should I check first?",
    detail:
      "Use files you own or have permission to process, and make sure the video actually contains audio. For very long recordings, split the source file before converting so the processing stays reliable.",
    nextTitle: "Next step",
    nextText:
      "Open the converter if you already have a video file ready. If your source is an MP4, the MP4-to-MP3 guide explains the format-specific path first.",
    toolCta: "Open the video to MP3 converter",
    ladderCta: "See the MP4 to MP3 guide",
  },
  es: {
    title: "El Convertidor Online de Video a MP3 es Gratis?",
    description:
      "Aprende como funciona el convertidor online de video a MP3, que significa conversion gratis desde navegador y que limites aplica.",
    eyebrow: "Respuesta rapida",
    h1: "El convertidor online de video a MP3 es gratis?",
    answer:
      "Si, puedes usar el convertidor de video a MP3 desde el navegador sin crear una cuenta. Los limites actuales estan pensados para una extraccion de audio practica: videos de hasta 1 GB y hasta una hora de duracion.",
    stepsTitle: "Que incluye la conversion gratis",
    steps: [
      "Subir un archivo de video compatible desde tu dispositivo.",
      "Extraer la pista de audio dentro de la herramienta del navegador.",
      "Descargar el MP3 generado cuando termina el procesado.",
      "Mantenerte dentro de los limites actuales de 1 GB y una hora.",
    ],
    detailTitle: "Que deberia revisar primero?",
    detail:
      "Usa archivos propios o que tengas permiso para procesar, y comprueba que el video contiene audio. Para grabaciones muy largas, divide el archivo antes de convertirlo para mantener un procesado fiable.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre el convertidor si ya tienes un archivo de video listo. Si tu fuente es un MP4, la guia MP4 a MP3 explica primero el camino especifico de ese formato.",
    toolCta: "Abrir el convertidor de video a MP3",
    ladderCta: "Ver la guia MP4 a MP3",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: FreeVideoToMp3QuestionPageProps): Promise<Metadata> {
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

export default async function FreeVideoToMp3QuestionPage({
  params,
}: FreeVideoToMp3QuestionPageProps) {
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
                href={ladderPath}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean"
              >
                {text.ladderCta}
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
