import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type DownloadMp3FromVideoPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/how-to-download-mp3-from-video";
const moneyPath = "/video-to-mp3-converter";
const ladderPath = "/mp4-to-mp3-converter";

const copy = {
  en: {
    title: "How to Download MP3 From Video",
    description:
      "Learn how to extract the audio from a video file and download it as an MP3 using an online video to MP3 converter.",
    eyebrow: "Quick answer",
    h1: "How do I download an MP3 from a video?",
    answer:
      "Upload the video file to a video to MP3 converter, wait for the tool to extract the audio track, then download the generated MP3. This works when the source video includes audio and stays within the converter limits.",
    stepsTitle: "Simple download process",
    steps: [
      "Choose a video file saved on your device.",
      "Upload it to the online video to MP3 converter.",
      "Wait while the audio track is extracted.",
      "Download the MP3 file when processing finishes.",
    ],
    detailTitle: "What should I check before downloading?",
    detail:
      "Make sure the video contains audio, the file is yours or you have permission to process it, and the upload fits the current limits. For MP4 files, the MP4-to-MP3 guide is usually the clearest path.",
    nextTitle: "Next step",
    nextText:
      "Open the converter if your video is ready. If your source file is an MP4 and you want the format-specific guide, start with the MP4-to-MP3 page.",
    toolCta: "Open the video to MP3 converter",
    ladderCta: "See the MP4 to MP3 guide",
  },
  es: {
    title: "Como Descargar MP3 Desde un Video",
    description:
      "Aprende como extraer el audio de un archivo de video y descargarlo como MP3 usando un convertidor online de video a MP3.",
    eyebrow: "Respuesta rapida",
    h1: "Como descargo un MP3 desde un video?",
    answer:
      "Sube el archivo de video a un convertidor de video a MP3, espera a que la herramienta extraiga la pista de audio y descarga el MP3 generado. Funciona cuando el video original incluye audio y se mantiene dentro de los limites del convertidor.",
    stepsTitle: "Proceso simple de descarga",
    steps: [
      "Elige un archivo de video guardado en tu dispositivo.",
      "Subelo al convertidor online de video a MP3.",
      "Espera mientras se extrae la pista de audio.",
      "Descarga el archivo MP3 cuando termine el procesado.",
    ],
    detailTitle: "Que deberia revisar antes de descargar?",
    detail:
      "Comprueba que el video contiene audio, que el archivo es tuyo o tienes permiso para procesarlo, y que la subida encaja con los limites actuales. Para archivos MP4, la guia MP4 a MP3 suele ser el camino mas claro.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre el convertidor si tu video esta listo. Si tu archivo de origen es un MP4 y quieres la guia especifica del formato, empieza por la pagina MP4 a MP3.",
    toolCta: "Abrir el convertidor de video a MP3",
    ladderCta: "Ver la guia MP4 a MP3",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: DownloadMp3FromVideoPageProps): Promise<Metadata> {
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

export default async function DownloadMp3FromVideoPage({
  params,
}: DownloadMp3FromVideoPageProps) {
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
