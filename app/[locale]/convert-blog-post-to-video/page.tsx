import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  FileText,
  Link2,
  Radio,
  Sparkles,
  Video,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type ConvertBlogPostToVideoPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/convert-blog-post-to-video";
const questionPath = "/questions/how-to-make-a-video-from-an-article";
const moneyPath = "/article-to-video-ai";

const copy = {
  en: {
    title: "Convert Blog Posts to Videos",
    description:
      "Turn existing blog posts into short vertical videos with script, voiceover, subtitles and AI visuals for Shorts, Reels and TikTok.",
    eyebrow: "Blog to video tool",
    h1: "Convert a blog post to video without opening an editor.",
    intro:
      "Use this tool when you already have a blog post, guide or SEO article and want a short video version for social distribution. URL to Video reads the article, creates a concise script, adds voiceover, subtitles and visual scenes, then exports a vertical MP4.",
    primaryCta: "Create an article video",
    secondaryCta: "Read the quick answer",
    direct: {
      eyebrow: "Best fit",
      title: "When should you turn a blog post into a video?",
      text:
        "Blog posts with one clear idea, a strong headline and useful sections are the best candidates. The goal is not to copy the full article into video, but to turn the main argument into a short clip people can watch on mobile.",
    },
    stepsTitle: "Blog post to video process",
    steps: [
      {
        title: "Choose a focused blog post",
        text:
          "Pick an article that explains one topic, answers one question or summarizes one product angle.",
      },
      {
        title: "Paste the public URL",
        text:
          "Use the article URL when it can be crawled, or paste the article text if the site blocks automated reading.",
      },
      {
        title: "Generate voice and subtitles",
        text:
          "The tool creates a short script, natural voiceover and synchronized subtitles for a vertical video.",
      },
      {
        title: "Publish the MP4",
        text:
          "Download the finished video and reuse the article on TikTok, Instagram Reels or YouTube Shorts.",
      },
    ],
    benefitsTitle: "Why this works for content teams",
    benefits: [
      "Reuse SEO content in video-first channels.",
      "Create social clips without manual editing.",
      "Keep the message tied to an article you already own.",
    ],
    bridgeTitle: "Need the short answer first?",
    bridgeText:
      "If you are still checking the basic process, start with the question page. It explains the simple version and then points back to this tool.",
    bridgeCta: "How to make a video from an article",
    finalTitle: "Ready to convert a blog post?",
    finalText:
      "Open the article-to-video generator, paste your URL and create a vertical MP4 with voiceover, subtitles and AI-generated images.",
  },
  es: {
    title: "Convertir Posts de Blog en Videos",
    description:
      "Convierte posts de blog en videos verticales cortos con guion, voz, subtitulos y visuales IA para Shorts, Reels y TikTok.",
    eyebrow: "Herramienta blog a video",
    h1: "Convierte un post de blog en video sin abrir un editor.",
    intro:
      "Usa esta herramienta cuando ya tienes un post, guia o articulo SEO y quieres una version en video corto para redes sociales. URL to Video lee el articulo, crea un guion breve, anade voz, subtitulos y escenas visuales, y exporta un MP4 vertical.",
    primaryCta: "Crear video desde articulo",
    secondaryCta: "Leer la respuesta rapida",
    direct: {
      eyebrow: "Mejor caso de uso",
      title: "Cuando conviene convertir un post de blog en video?",
      text:
        "Los posts con una idea clara, un titular fuerte y secciones utiles son los mejores candidatos. El objetivo no es copiar todo el articulo en video, sino transformar el argumento principal en un clip corto para movil.",
    },
    stepsTitle: "Proceso de blog post a video",
    steps: [
      {
        title: "Elige un post enfocado",
        text:
          "Escoge un articulo que explique un tema, responda una pregunta o resuma un angulo de producto.",
      },
      {
        title: "Pega la URL publica",
        text:
          "Usa la URL del articulo si se puede rastrear, o pega el texto cuando la web bloquee la lectura automatica.",
      },
      {
        title: "Genera voz y subtitulos",
        text:
          "La herramienta crea un guion corto, voz natural y subtitulos sincronizados para video vertical.",
      },
      {
        title: "Publica el MP4",
        text:
          "Descarga el video terminado y reutiliza el articulo en TikTok, Instagram Reels o YouTube Shorts.",
      },
    ],
    benefitsTitle: "Por que funciona para equipos de contenido",
    benefits: [
      "Reutilizas contenido SEO en canales de video.",
      "Creas clips sociales sin edicion manual.",
      "Mantienes el mensaje conectado a un articulo propio.",
    ],
    bridgeTitle: "Necesitas primero la respuesta corta?",
    bridgeText:
      "Si todavia estas validando el proceso basico, empieza por la pagina de pregunta. Explica la version simple y vuelve a enlazar esta herramienta.",
    bridgeCta: "Como crear un video desde un articulo",
    finalTitle: "Listo para convertir un post?",
    finalText:
      "Abre el generador article-to-video, pega tu URL y crea un MP4 vertical con voz, subtitulos e imagenes generadas por IA.",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: ConvertBlogPostToVideoPageProps): Promise<Metadata> {
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

export default async function ConvertBlogPostToVideoPage({
  params,
}: ConvertBlogPostToVideoPageProps) {
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
                href={questionPath}
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
              <CheckCircle2 size={22} aria-hidden />
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
            Workflow
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight text-ink">
            {text.stepsTitle}
          </h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {text.steps.map((step, index) => {
            const icons = [FileText, Link2, Captions, Video] as const;
            const Icon = icons[index] ?? Sparkles;

            return (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="absolute right-4 top-4 text-5xl font-black leading-none text-ocean/10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
                  <Icon size={23} aria-hidden />
                </div>
                <h3 className="relative mt-5 text-xl font-black text-ink transition group-hover:text-ocean">
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
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <article className="rounded-[28px] bg-ink p-7 text-white shadow-soft">
            <Radio className="text-citrus" size={24} aria-hidden />
            <h2 className="mt-5 text-3xl font-extrabold leading-tight">
              {text.benefitsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {text.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm font-semibold leading-6 text-white/72">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-citrus" size={18} aria-hidden />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[28px] border border-white/70 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-extrabold leading-tight text-ink">
              {text.bridgeTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/64">
              {text.bridgeText}
            </p>
            <Link
              href={questionPath}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean transition hover:text-ink"
            >
              {text.bridgeCta}
              <ArrowRight size={17} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
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
            <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
