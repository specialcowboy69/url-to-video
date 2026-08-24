import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type SafeVideoToMp3PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/is-it-safe-to-convert-video-to-mp3-online";
const moneyPath = "/video-to-mp3-converter";
const relatedPath = "/questions/can-i-convert-video-to-mp3-online";

const copy = {
  en: {
    title: "Is It Safe to Convert Video to MP3 Online?",
    description:
      "Learn when online video to MP3 conversion is safe, what files you should avoid uploading and how to use the converter responsibly.",
    eyebrow: "Quick answer",
    h1: "Is it safe to convert video to MP3 online?",
    answer:
      "It can be safe when you use files you own or have permission to process, avoid sensitive recordings and use a converter that runs through a secure browser connection. Do not upload private or restricted content that should not leave your device.",
    stepsTitle: "Safety checklist",
    steps: [
      "Use only videos you own or have permission to process.",
      "Avoid private, confidential or restricted recordings.",
      "Check that the page uses a secure HTTPS connection.",
      "Download the MP3 and keep the source file only where you need it.",
    ],
    detailTitle: "What should I avoid?",
    detail:
      "Avoid uploading videos that contain private conversations, client data, copyrighted material you are not allowed to process, or files from sources you do not trust. For simple owned recordings, browser conversion is usually enough.",
    nextTitle: "Next step",
    nextText:
      "If your file is safe to process and contains audio, open the converter. If you are still comparing browser conversion, read the online video-to-MP3 answer first.",
    toolCta: "Open the video to MP3 converter",
    relatedCta: "Can I convert video to MP3 online?",
  },
  es: {
    title: "Es Seguro Convertir Video a MP3 Online?",
    description:
      "Aprende cuando es seguro convertir video a MP3 online, que archivos conviene evitar y como usar el convertidor de forma responsable.",
    eyebrow: "Respuesta rapida",
    h1: "Es seguro convertir video a MP3 online?",
    answer:
      "Puede ser seguro cuando usas archivos propios o que tienes permiso para procesar, evitas grabaciones sensibles y utilizas un convertidor con conexion segura desde el navegador. No subas contenido privado o restringido que no deba salir de tu dispositivo.",
    stepsTitle: "Checklist de seguridad",
    steps: [
      "Usa solo videos propios o que tengas permiso para procesar.",
      "Evita grabaciones privadas, confidenciales o restringidas.",
      "Comprueba que la pagina usa una conexion HTTPS segura.",
      "Descarga el MP3 y conserva el archivo fuente solo donde lo necesites.",
    ],
    detailTitle: "Que deberia evitar?",
    detail:
      "Evita subir videos con conversaciones privadas, datos de clientes, material protegido que no tengas permiso para procesar o archivos de fuentes no confiables. Para grabaciones propias y simples, la conversion desde navegador suele ser suficiente.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si tu archivo es seguro para procesar y contiene audio, abre el convertidor. Si todavia estas comparando la conversion desde navegador, lee primero la respuesta sobre video a MP3 online.",
    toolCta: "Abrir el convertidor de video a MP3",
    relatedCta: "Puedo convertir video a MP3 online?",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: SafeVideoToMp3PageProps): Promise<Metadata> {
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

export default async function SafeVideoToMp3Page({
  params,
}: SafeVideoToMp3PageProps) {
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
                href={relatedPath}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean"
              >
                {text.relatedCta}
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
