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
import { articleAiDemoVideoUrl } from "@/app/data/demoVideos";
import { HeroDemoVideo } from "@/app/components/HeroDemoVideo";
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
    title: "How to Convert a Blog Post to Video with AI",
    description:
      "See how to turn a blog post into a vertical video. The AI creates the script for social media, narration, subtitles and images from your content.",
    eyebrow: "Blog to video guide",
    h1: "How to turn a blog post into a short video with AI",
    intro:
      "Start with a public article URL or paste its text into the generator. You do not need to write a script: the system creates one optimized for social media, then adds narration, subtitles and AI-generated images. This guide shows the process.",
    primaryCta: "Open the article-to-video generator",
    secondaryCta: "Read the quick answer",
    demoTitle: "See the AI article-to-video process",
    demoCaption:
      "Demonstration of the AI workflow. Your starting point is the article; the system creates the script and video.",
    demoFallback: "Open the demonstration video",
    textAlternative: "Starting from text? Open Text to Video AI",
    processEyebrow: "Process",
    direct: {
      eyebrow: "Best fit",
      title: "When should you turn a blog post into a video?",
      text:
        "Use an existing blog post, news article or guide as the source. You do not need to turn it into a script first: the system adapts the content into a short video for social media.",
    },
    stepsTitle: "Blog post to video process",
    steps: [
      {
        title: "Provide your article",
        text:
          "Open the article-to-video generator and paste a public blog URL. If you already have the article text, use Text mode.",
      },
      {
        title: "Choose a language and generate",
        text:
          "Choose English or Spanish and start generation. You do not need to prepare a script.",
      },
      {
        title: "The AI creates the video",
        text:
          "The system creates a script optimized for social media, narration, AI images and synchronized subtitles from your content.",
      },
      {
        title: "Review and download",
        text:
          "Watch the result and download the vertical MP4 to publish on your social channels.",
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
      "If you are still checking the basic process, start with the question page. It explains the simple version and then points back to this guide.",
    bridgeCta: "How to make a video from an article",
    finalTitle: "Ready to convert a blog post?",
    finalText:
      "Open the article-to-video generator, paste your URL and create a vertical MP4 with voiceover, subtitles and AI-generated images.",
  },
  es: {
    title: "Cómo convertir un artículo de blog en vídeo con IA",
    description:
      "Descubre cómo convertir un artículo de blog en un vídeo vertical. La IA crea el guion para redes, la narración, los subtítulos y las imágenes a partir de tu contenido.",
    eyebrow: "Guía de blog a vídeo",
    h1: "Cómo convertir un artículo de blog en un vídeo corto con IA",
    intro:
      "Parte de la URL de un artículo público o pega su texto en el generador. No necesitas preparar un guion: el sistema lo crea optimizado para redes y añade narración, subtítulos e imágenes generadas por IA. Esta guía muestra el proceso.",
    primaryCta: "Abrir el generador de artículo a vídeo",
    secondaryCta: "Leer la respuesta rapida",
    demoTitle: "Mira el proceso de artículo a vídeo con IA",
    demoCaption:
      "Demostración del flujo con IA. Tú aportas el artículo; el sistema crea el guion y el vídeo.",
    demoFallback: "Abrir el vídeo de demostración",
    textAlternative: "¿Partes de un texto? Abre Texto a vídeo con IA",
    processEyebrow: "Proceso",
    direct: {
      eyebrow: "Mejor caso de uso",
      title: "Cuando conviene convertir un post de blog en video?",
      text:
        "Usa un post de blog, una noticia o una guía como fuente. No necesitas convertirlo primero en un guion: el sistema adapta el contenido a un vídeo corto para redes.",
    },
    stepsTitle: "Proceso de blog post a video",
    steps: [
      {
        title: "Aporta tu artículo",
        text:
          "Abre el generador de artículo a vídeo y pega la URL de un blog público. Si ya tienes el texto del artículo, usa el modo Texto.",
      },
      {
        title: "Elige el idioma y genera",
        text:
          "Elige español o inglés e inicia la generación. No necesitas preparar un guion.",
      },
      {
        title: "La IA crea el vídeo",
        text:
          "El sistema crea a partir de tu contenido un guion optimizado para redes, narración, imágenes IA y subtítulos sincronizados.",
      },
      {
        title: "Revisa y descarga",
        text:
          "Mira el resultado y descarga el MP4 vertical para publicarlo en tus redes.",
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
      "Si todavia estas validando el proceso basico, empieza por la pagina de pregunta. Explica la version simple y vuelve a enlazar esta guía.",
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

      <section className="px-5 pb-16" aria-labelledby="blog-ai-demo-title">
        <div className="mx-auto max-w-6xl">
          <h2
            id="blog-ai-demo-title"
            className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl"
          >
            {text.demoTitle}
          </h2>
          <figure className="mt-6">
            <HeroDemoVideo
              src={articleAiDemoVideoUrl}
              ariaLabelledBy="blog-ai-demo-title"
            />
            <figcaption className="mt-4 max-w-3xl text-sm leading-6 text-ink/64">
              {text.demoCaption}
            </figcaption>
          </figure>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={articleAiDemoVideoUrl}
              className="text-sm font-bold text-ocean underline underline-offset-4 transition hover:text-ink"
            >
              {text.demoFallback}
            </a>
            <Link
              href="/text-to-video-ai"
              className="text-sm font-bold text-ocean underline underline-offset-4 transition hover:text-ink"
            >
              {text.textAlternative}
            </Link>
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
            {text.processEyebrow}
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
