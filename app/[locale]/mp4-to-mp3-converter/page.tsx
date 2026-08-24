import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  FileAudio,
  FileVideo,
  Gauge,
  HelpCircle,
  Shield,
  UploadCloud,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type Mp4ToMp3PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/mp4-to-mp3-converter";
const moneyPath = "/video-to-mp3-converter";
const howToPath = "/questions/how-to-convert-video-to-mp3";
const onlinePath = "/questions/can-i-convert-video-to-mp3-online";

const copy = {
  en: {
    title: "MP4 to MP3 Converter",
    description:
      "Convert an MP4 video into a downloadable MP3 audio file online. Upload your video, extract the audio track and save the MP3 from your browser.",
    eyebrow: "MP4 audio extraction",
    h1: "Convert MP4 to MP3 online from your browser.",
    intro:
      "Use this page when you already have an MP4 file and only need the audio. URL to Video extracts the audio track, creates an MP3 and gives you a download link without opening a video editor.",
    primaryCta: "Convert video to MP3",
    secondaryCta: "Read the quick answer",
    direct: {
      eyebrow: "Best fit",
      title: "Best fit for MP4 files with a clear audio track",
      text:
        "MP4 is the most common video format for phones, screen recordings, social clips and downloaded assets. If the file includes spoken audio, music or a meeting recording, you can turn that track into an MP3 for listening, archiving or reuse.",
    },
    workflowEyebrow: "Workflow",
    stepsTitle: "How the MP4 to MP3 conversion works",
    steps: [
      {
        title: "Upload the MP4",
        text:
          "Choose an MP4 file from your device. The current converter accepts videos up to 1 GB and one hour long.",
      },
      {
        title: "Extract the audio",
        text:
          "The tool processes the video and separates the available audio track from the visual part of the file.",
      },
      {
        title: "Download the MP3",
        text:
          "When processing finishes, download the MP3 and use it in your audio project.",
      },
    ],
    checksTitle: "Before you convert",
    checks: [
      "Use your own videos or files you have permission to process.",
      "Make sure the MP4 actually contains audio.",
      "For long recordings, expect processing to take more time.",
    ],
    relatedTitle: "Related questions",
    related: [
      {
        title: "How do I convert video to MP3?",
        text: "A short answer for users comparing the basic converter.",
        href: howToPath,
      },
      {
        title: "Can I convert video to MP3 online?",
        text: "A quick explanation of browser-based conversion and limits.",
        href: onlinePath,
      },
    ],
    finalTitle: "Ready to extract MP3 audio from an MP4?",
    finalText:
      "Open the video-to-MP3 converter, upload your MP4 and download the extracted MP3 audio file.",
  },
  es: {
    title: "Convertidor MP4 a MP3",
    description:
      "Convierte un video MP4 en un archivo de audio MP3 descargable online. Sube tu video, extrae la pista de audio y guarda el MP3 desde el navegador.",
    eyebrow: "Extraccion de audio MP4",
    h1: "Convierte MP4 a MP3 online desde el navegador.",
    intro:
      "Usa esta pagina cuando ya tienes un archivo MP4 y solo necesitas el audio. URL to Video extrae la pista de audio, crea un MP3 y te da un enlace de descarga sin abrir un editor de video.",
    primaryCta: "Convertir video a MP3",
    secondaryCta: "Leer la respuesta rapida",
    direct: {
      eyebrow: "Mejor caso de uso",
      title: "Ideal para MP4 con una pista de audio clara",
      text:
        "MP4 es el formato de video mas habitual en moviles, grabaciones de pantalla, clips sociales y archivos descargados. Si el archivo incluye voz, musica o una reunion grabada, puedes convertir esa pista en un MP3 para escucharla, guardarla o reutilizarla.",
    },
    workflowEyebrow: "Flujo",
    stepsTitle: "Como funciona la conversion de MP4 a MP3",
    steps: [
      {
        title: "Sube el MP4",
        text:
          "Elige un archivo MP4 desde tu dispositivo. El convertidor actual acepta videos de hasta 1 GB y una hora de duracion.",
      },
      {
        title: "Extrae el audio",
        text:
          "La herramienta procesa el video y separa la pista de audio disponible de la parte visual del archivo.",
      },
      {
        title: "Descarga el MP3",
        text:
          "Cuando termina el procesado, descarga el MP3 y usalo en tu proyecto de audio.",
      },
    ],
    checksTitle: "Antes de convertir",
    checks: [
      "Usa videos propios o archivos que tengas permiso para procesar.",
      "Comprueba que el MP4 contiene audio.",
      "En grabaciones largas, el procesado puede tardar mas.",
    ],
    relatedTitle: "Preguntas relacionadas",
    related: [
      {
        title: "Como convierto un video a MP3?",
        text: "Respuesta corta para usuarios que comparan el convertidor basico.",
        href: howToPath,
      },
      {
        title: "Puedo convertir video a MP3 online?",
        text: "Explicacion rapida de la conversion desde navegador y sus limites.",
        href: onlinePath,
      },
    ],
    finalTitle: "Listo para extraer audio MP3 de un MP4?",
    finalText:
      "Abre el convertidor de video a MP3, sube tu MP4 y descarga el archivo de audio extraido.",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: Mp4ToMp3PageProps): Promise<Metadata> {
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

export default async function Mp4ToMp3Page({ params }: Mp4ToMp3PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = getCopy(locale);

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
        name: text.title,
        item: `${siteUrl}/${locale}${pagePath}`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: text.stepsTitle,
    step: text.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, howToSchema]),
        }}
      />

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <nav className="text-sm font-bold text-ink/56" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-ocean">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{text.title}</span>
          </nav>

          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {text.eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.04] text-ink sm:text-6xl">
              {text.h1}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/68">
              {text.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={moneyPath}
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 py-3 text-sm font-black text-ink shadow-[0_14px_36px_rgba(215,255,71,0.35)] transition hover:brightness-95"
              >
                {text.primaryCta}
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={howToPath}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-ink/10 bg-white px-6 py-3 text-sm font-black text-ink shadow-sm transition hover:bg-mist hover:text-ocean"
              >
                {text.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
              {text.direct.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
              {text.direct.title}
            </h2>
          </div>
          <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
              <FileVideo size={22} aria-hidden />
            </div>
            <p className="text-base font-semibold leading-7 text-ink/70">
              {text.direct.text}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {text.workflowEyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            {text.stepsTitle}
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {text.steps.map((step, index) => {
            const icons = [UploadCloud, FileAudio, Gauge] as const;
            const Icon = icons[index] ?? CheckCircle2;

            return (
              <li
                key={step.title}
                className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-5xl font-black leading-none text-ocean/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
                  <Icon size={23} aria-hidden />
                </div>
                <h3 className="relative mt-5 text-xl font-black text-ink">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-ink/64">
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-y border-white/70 bg-white/68 px-5 py-16 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[28px] bg-ink p-7 text-white shadow-soft">
            <Shield className="text-citrus" size={24} aria-hidden />
            <h2 className="mt-5 text-3xl font-extrabold leading-tight">
              {text.checksTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {text.checks.map((check) => (
                <li
                  key={check}
                  className="flex gap-3 text-sm font-semibold leading-6 text-white/72"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-citrus"
                    size={18}
                    aria-hidden
                  />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[28px] border border-white/70 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
              <HelpCircle size={24} aria-hidden />
            </div>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink">
              {text.relatedTitle}
            </h2>
            <div className="mt-5 grid gap-3">
              {text.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-ink/10 p-4 transition hover:border-ocean/30 hover:bg-mist"
                >
                  <span className="flex items-center justify-between gap-4 text-base font-black text-ink">
                    {item.title}
                    <ArrowRight
                      size={17}
                      aria-hidden
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-ink/62">
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-[32px] bg-citrus p-8 text-ink shadow-soft md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              {text.finalTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-ink/70">
              {text.finalText}
            </p>
          </div>
          <Link
            href={moneyPath}
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-black text-white transition hover:bg-ocean"
          >
            {text.primaryCta}
            <ArrowRight
              size={18}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
