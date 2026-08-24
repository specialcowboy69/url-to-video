import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type OnlineVideoToMp3QuestionPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/can-i-convert-video-to-mp3-online";
const ladderPath = "/mp4-to-mp3-converter";
const moneyPath = "/video-to-mp3-converter";

const copy = {
  en: {
    title: "Can I Convert Video to MP3 Online?",
    description:
      "Find out when an online video to MP3 converter is enough, what file types it supports and when to use the full converter.",
    eyebrow: "Quick answer",
    h1: "Can I convert video to MP3 online?",
    answer:
      "Yes. If the video file is on your device and includes an audio track, you can upload it to an online video to MP3 converter and download the extracted MP3 from the browser. You do not need desktop editing software for a basic audio extraction.",
    stepsTitle: "What you need",
    steps: [
      "A video file saved on your device.",
      "A supported format such as MP4, MOV, WEBM, MKV, AVI, MPEG or MPG.",
      "Permission to process the content and extract its audio.",
      "A stable browser tab while the conversion finishes.",
    ],
    detailTitle: "When should you avoid online conversion?",
    detail:
      "Avoid uploading files you do not have permission to process, private videos that should not leave your device or recordings that exceed the tool limits. For simple owned files, browser conversion is usually the fastest path.",
    nextTitle: "Next step",
    nextText:
      "If your file is an MP4, the format-specific MP4-to-MP3 page gives the clearest guide. If you already know what to do, open the converter directly.",
    cta: "See the MP4 to MP3 guide",
    moneyCta: "Open the online converter",
  },
  es: {
    title: "Puedo Convertir Video a MP3 Online?",
    description:
      "Descubre cuando basta con un convertidor online de video a MP3, que formatos acepta y cuando usar el convertidor completo.",
    eyebrow: "Respuesta rapida",
    h1: "Puedo convertir video a MP3 online?",
    answer:
      "Si. Si el archivo de video esta en tu dispositivo e incluye una pista de audio, puedes subirlo a un convertidor online de video a MP3 y descargar el MP3 extraido desde el navegador. No necesitas software de edicion para una extraccion de audio basica.",
    stepsTitle: "Que necesitas",
    steps: [
      "Un archivo de video guardado en tu dispositivo.",
      "Un formato compatible como MP4, MOV, WEBM, MKV, AVI, MPEG o MPG.",
      "Permiso para procesar el contenido y extraer su audio.",
      "Una pestana de navegador estable mientras termina la conversion.",
    ],
    detailTitle: "Cuando conviene evitar la conversion online?",
    detail:
      "Evita subir archivos que no tengas permiso para procesar, videos privados que no deban salir de tu dispositivo o grabaciones que superen los limites de la herramienta. Para archivos propios y simples, la conversion desde navegador suele ser la ruta mas rapida.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si tu archivo es un MP4, la pagina especifica de MP4 a MP3 ofrece la guia mas clara. Si ya sabes que hacer, abre directamente el convertidor.",
    cta: "Ver la guia MP4 a MP3",
    moneyCta: "Abrir el convertidor online",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: OnlineVideoToMp3QuestionPageProps): Promise<Metadata> {
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

export default async function OnlineVideoToMp3QuestionPage({
  params,
}: OnlineVideoToMp3QuestionPageProps) {
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
