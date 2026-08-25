import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  EyeOff,
  FileText,
  Radio,
  Sparkles,
  Video,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type FacelessReelsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/faceless-reels-generator";
const articlePath = "/article-to-video-ai";
const textPath = "/text-to-video-ai";

const copy = {
  en: {
    title: "Faceless Reels Generator",
    description:
      "Create faceless reels from articles, URLs or written ideas with AI script, voiceover, subtitles and vertical visuals.",
    eyebrow: "Faceless video generator",
    h1: "Create faceless reels without recording yourself.",
    intro:
      "Use URL to Video when you want short vertical content but do not want to appear on camera. Start from a public article, blog post, guide or written idea, then generate a concise script, voiceover, subtitles and visual scenes for Reels, Shorts or TikTok.",
    primaryCta: "Create a faceless reel from an article",
    secondaryCta: "Start from text",
    direct: {
      eyebrow: "Best fit",
      title: "What kind of faceless reels fit this tool?",
      text:
        "This is best for educational, informational and content-repurposing reels where the source idea already exists in text. It is not a manual video editor; it turns written material into a watchable vertical clip.",
    },
    stepsTitle: "Faceless reels workflow",
    steps: [
      {
        title: "Choose the source idea",
        text:
          "Start with an article URL, blog post, newsletter, guide, list or short written explanation.",
      },
      {
        title: "Generate the reel script",
        text:
          "The tool condenses the source into a short hook, core message and simple narrative.",
      },
      {
        title: "Add voice and subtitles",
        text:
          "Create a voiceover and captions so the reel works without filming your face.",
      },
      {
        title: "Export a vertical video",
        text:
          "Download the finished MP4 and publish it as a Reel, Short or TikTok clip.",
      },
    ],
    benefitsTitle: "Why creators use faceless reels",
    benefits: [
      "Publish without appearing on camera.",
      "Repurpose written content into short-form video.",
      "Keep a repeatable content process for social channels.",
    ],
    relatedTitle: "Faceless reels questions",
    related: [
      {
        title: "What are faceless reels?",
        href: "/questions/what-are-faceless-reels",
      },
      {
        title: "How do I make faceless reels?",
        href: "/questions/how-to-make-faceless-reels",
      },
      {
        title: "Can AI create faceless reels?",
        href: "/questions/can-ai-create-faceless-reels",
      },
      {
        title: "How do I turn an article into a faceless reel?",
        href: "/questions/how-to-turn-an-article-into-a-faceless-reel",
      },
    ],
    finalTitle: "Ready to create a faceless reel?",
    finalText:
      "Open the article-to-video generator, paste a URL or written source and create a vertical video with voiceover, subtitles and AI visuals.",
  },
  es: {
    title: "Generador de Faceless Reels",
    description:
      "Crea faceless reels desde articulos, URLs o ideas escritas con guion IA, voz, subtitulos y visuales verticales.",
    eyebrow: "Generador de video sin camara",
    h1: "Crea faceless reels sin grabarte a ti mismo.",
    intro:
      "Usa URL to Video cuando quieres contenido vertical corto pero no quieres aparecer en camara. Empieza desde un articulo publico, post de blog, guia o idea escrita, y genera un guion breve, voz, subtitulos y escenas visuales para Reels, Shorts o TikTok.",
    primaryCta: "Crear faceless reel desde articulo",
    secondaryCta: "Empezar desde texto",
    direct: {
      eyebrow: "Mejor caso de uso",
      title: "Que tipo de faceless reels encajan con esta herramienta?",
      text:
        "Funciona mejor para reels educativos, informativos y de reutilizacion de contenido donde la idea original ya existe en texto. No es un editor manual de video; convierte material escrito en un clip vertical publicable.",
    },
    stepsTitle: "Flujo para faceless reels",
    steps: [
      {
        title: "Elige la idea fuente",
        text:
          "Empieza con una URL de articulo, post de blog, newsletter, guia, lista o explicacion escrita.",
      },
      {
        title: "Genera el guion del reel",
        text:
          "La herramienta condensa la fuente en un hook corto, mensaje principal y narrativa simple.",
      },
      {
        title: "Anade voz y subtitulos",
        text:
          "Crea voz y captions para que el reel funcione sin grabar tu cara.",
      },
      {
        title: "Exporta un video vertical",
        text:
          "Descarga el MP4 terminado y publicalo como Reel, Short o clip de TikTok.",
      },
    ],
    benefitsTitle: "Por que los creadores usan faceless reels",
    benefits: [
      "Publicas sin aparecer en camara.",
      "Reutilizas contenido escrito como video corto.",
      "Mantienes un proceso repetible para redes sociales.",
    ],
    relatedTitle: "Preguntas sobre faceless reels",
    related: [
      {
        title: "Que son los faceless reels?",
        href: "/questions/what-are-faceless-reels",
      },
      {
        title: "Como hago faceless reels?",
        href: "/questions/how-to-make-faceless-reels",
      },
      {
        title: "Puede la IA crear faceless reels?",
        href: "/questions/can-ai-create-faceless-reels",
      },
      {
        title: "Como convierto un articulo en faceless reel?",
        href: "/questions/how-to-turn-an-article-into-a-faceless-reel",
      },
    ],
    finalTitle: "Listo para crear un faceless reel?",
    finalText:
      "Abre el generador article-to-video, pega una URL o fuente escrita y crea un video vertical con voz, subtitulos y visuales IA.",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: FacelessReelsPageProps): Promise<Metadata> {
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

export default async function FacelessReelsPage({
  params,
}: FacelessReelsPageProps) {
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
                href={articlePath}
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
                href={textPath}
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
              <EyeOff size={22} aria-hidden />
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
            const icons = [FileText, Sparkles, Captions, Video] as const;
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
            <Radio className="text-citrus" size={24} aria-hidden />
            <h2 className="mt-5 text-3xl font-extrabold leading-tight">
              {text.benefitsTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {text.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 text-sm font-semibold leading-6 text-white/72"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-citrus"
                    size={18}
                    aria-hidden
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[28px] border border-white/70 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-extrabold leading-tight text-ink">
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
            href={articlePath}
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
