import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type VideoToMp3QuestionPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/how-to-convert-video-to-mp3";
const ladderPath = "/mp4-to-mp3-converter";
const moneyPath = "/video-to-mp3-converter";

const copy = {
  en: {
    title: "How to Convert Video to MP3",
    description:
      "Learn the fastest way to convert a video file into MP3 audio online, including the simple upload, extraction and download process.",
    eyebrow: "Quick answer",
    h1: "How do I convert video to MP3?",
    answer:
      "Upload the video file into a video to MP3 converter, wait while the tool extracts the audio track, then download the generated MP3. This works best with videos that already contain clear speech, music or another audio track.",
    stepsTitle: "Simple process",
    steps: [
      "Choose a video file you own or have permission to process.",
      "Upload the MP4, MOV, WEBM, MKV, AVI, MPEG or MPG file.",
      "Let the converter extract the audio and generate the MP3.",
      "Download the MP3 and use it for listening, notes or editing.",
    ],
    detailTitle: "Which videos work best?",
    detail:
      "Short recordings, interviews, lessons, meeting clips and social videos usually work well. If the source video has no audio, the converter cannot create a useful MP3 because there is no audio track to extract.",
    nextTitle: "Next step",
    nextText:
      "If your source file is an MP4, use the MP4-to-MP3 page first. It explains the format-specific guide and then sends you to the converter.",
    cta: "See the MP4 to MP3 guide",
    moneyCta: "Open the video to MP3 converter",
  },
  es: {
    title: "Como Convertir Video a MP3",
    description:
      "Aprende la forma mas rapida de convertir un archivo de video en audio MP3 online, con subida, extraccion y descarga.",
    eyebrow: "Respuesta rapida",
    h1: "Como convierto un video a MP3?",
    answer:
      "Sube el archivo de video a un convertidor de video a MP3, espera mientras la herramienta extrae la pista de audio y descarga el MP3 generado. Funciona mejor con videos que ya tienen voz, musica u otra pista de audio clara.",
    stepsTitle: "Proceso simple",
    steps: [
      "Elige un archivo de video propio o que tengas permiso para procesar.",
      "Sube el archivo MP4, MOV, WEBM, MKV, AVI, MPEG o MPG.",
      "Deja que el convertidor extraiga el audio y genere el MP3.",
      "Descarga el MP3 y usalo para escuchar, tomar notas o editar.",
    ],
    detailTitle: "Que videos funcionan mejor?",
    detail:
      "Las grabaciones cortas, entrevistas, clases, clips de reuniones y videos sociales suelen funcionar bien. Si el video original no tiene audio, el convertidor no puede crear un MP3 util porque no hay pista de audio que extraer.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si tu archivo de origen es un MP4, empieza por la pagina MP4 a MP3. Explica la guia especifica del formato y despues te lleva al convertidor.",
    cta: "Ver la guia MP4 a MP3",
    moneyCta: "Abrir el convertidor de video a MP3",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: VideoToMp3QuestionPageProps): Promise<Metadata> {
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

export default async function VideoToMp3QuestionPage({
  params,
}: VideoToMp3QuestionPageProps) {
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
                {text.cta}
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
                {text.moneyCta}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
