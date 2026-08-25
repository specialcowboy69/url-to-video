import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, FileVideo, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type VideoFormatsQuestionPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/what-video-formats-can-i-convert-to-mp3";
const moneyPath = "/video-to-mp3-converter";
const ladderPath = "/mp4-to-mp3-converter";

const copy = {
  en: {
    title: "What Video Formats Can I Convert to MP3?",
    description:
      "See which common video formats can be converted to MP3 online, including MP4, MOV, WEBM, MKV, AVI, MPEG and MPG.",
    eyebrow: "Quick answer",
    h1: "What video formats can I convert to MP3?",
    answer:
      "You can convert common video formats such as MP4, MOV, WEBM, MKV, AVI, MPEG and MPG into MP3 when the file includes an audio track. The converter extracts the audio and returns a downloadable MP3.",
    formatsTitle: "Supported formats",
    formats: ["MP4", "MOV", "WEBM", "MKV", "AVI", "MPEG", "MPG"],
    stepsTitle: "Format checklist",
    steps: [
      "Use a video file that contains audio.",
      "Keep the upload within the current 1 GB and one hour limits.",
      "Prefer MP4 for the most common browser-friendly converter.",
      "Download the extracted MP3 when processing finishes.",
    ],
    detailTitle: "Which format should I choose?",
    detail:
      "MP4 is usually the simplest source format because it is widely used by phones, cameras, screen recorders and social platforms. MOV, WEBM, MKV, AVI, MPEG and MPG can also work when the audio track is readable.",
    nextTitle: "Next step",
    nextText:
      "If your file is an MP4, use the MP4-to-MP3 guide. If you already know your file is supported, open the converter and start extracting the audio.",
    toolCta: "Open the video to MP3 converter",
    ladderCta: "See the MP4 to MP3 guide",
  },
  es: {
    title: "Que Formatos de Video Puedo Convertir a MP3?",
    description:
      "Consulta que formatos de video habituales puedes convertir a MP3 online, incluidos MP4, MOV, WEBM, MKV, AVI, MPEG y MPG.",
    eyebrow: "Respuesta rapida",
    h1: "Que formatos de video puedo convertir a MP3?",
    answer:
      "Puedes convertir formatos de video habituales como MP4, MOV, WEBM, MKV, AVI, MPEG y MPG a MP3 cuando el archivo incluye una pista de audio. El convertidor extrae el audio y devuelve un MP3 descargable.",
    formatsTitle: "Formatos compatibles",
    formats: ["MP4", "MOV", "WEBM", "MKV", "AVI", "MPEG", "MPG"],
    stepsTitle: "Checklist de formato",
    steps: [
      "Usa un archivo de video que contenga audio.",
      "Mantén la subida dentro de los limites actuales de 1 GB y una hora.",
      "Prioriza MP4 para el convertidor mas habitual desde navegador.",
      "Descarga el MP3 extraido cuando termine el procesado.",
    ],
    detailTitle: "Que formato deberia elegir?",
    detail:
      "MP4 suele ser el formato de origen mas sencillo porque lo usan moviles, camaras, grabadores de pantalla y plataformas sociales. MOV, WEBM, MKV, AVI, MPEG y MPG tambien pueden funcionar cuando la pista de audio se puede leer.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si tu archivo es un MP4, usa la guia MP4 a MP3. Si ya sabes que tu archivo es compatible, abre el convertidor y empieza a extraer el audio.",
    toolCta: "Abrir el convertidor de video a MP3",
    ladderCta: "Ver la guia MP4 a MP3",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: VideoFormatsQuestionPageProps): Promise<Metadata> {
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

export default async function VideoFormatsQuestionPage({
  params,
}: VideoFormatsQuestionPageProps) {
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
              {text.formatsTitle}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {text.formats.map((format) => (
                <div
                  key={format}
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white p-4 text-sm font-black text-ink shadow-sm"
                >
                  <FileVideo className="shrink-0 text-ocean" size={18} aria-hidden />
                  <span>{format}</span>
                </div>
              ))}
            </div>
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
