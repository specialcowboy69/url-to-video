import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  FileText,
  Gauge,
  Mic2,
  Sparkles,
  Video,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type FreeTextToVideoPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/free-text-to-video-ai";
const toolPath = "/text-to-video-ai";
const articlePath = "/article-to-video-ai";

const copy = {
  en: {
    title: "Free Text to Video AI",
    description:
      "Create AI videos from text with script, voiceover, subtitles and vertical visuals. Learn when a free text-to-video tool is enough.",
    eyebrow: "Text to video tool",
    h1: "Turn text into a video with AI before opening an editor.",
    intro:
      "Use this tool when you already have a script, note, announcement or short idea and want to turn it into a vertical video. URL to Video can generate voiceover, subtitles and visual scenes from written text so you can test an idea quickly.",
    primaryCta: "Create a text video",
    secondaryCta: "Convert an article instead",
    direct: {
      eyebrow: "Best fit",
      title: "When is a free text-to-video AI tool enough?",
      text:
        "It is enough when you want a short social video from a clear piece of text. For longer scripts, repeated publishing or brand-sensitive work, review the output and current tool limits before scaling.",
    },
    stepsTitle: "Free text-to-video AI workflow",
    steps: [
      {
        title: "Paste the text",
        text:
          "Start with a short script, product note, announcement, list or educational explanation.",
      },
      {
        title: "Generate the video structure",
        text:
          "The tool turns the text into a short sequence with a hook, scenes and simple pacing.",
      },
      {
        title: "Add voice and subtitles",
        text:
          "Voiceover and captions make the video understandable on social feeds with or without sound.",
      },
      {
        title: "Export a vertical MP4",
        text:
          "Download the finished clip and publish it to Shorts, Reels, TikTok or another vertical channel.",
      },
    ],
    benefitsTitle: "Why start from text",
    benefits: [
      "You can test video ideas before editing manually.",
      "Written notes become social clips without recording.",
      "Short scripts keep the final video focused.",
    ],
    relatedTitle: "Text-to-video questions",
    related: [
      {
        title: "Is text to video AI free?",
        href: "/questions/is-text-to-video-ai-free",
      },
      {
        title: "Can I make AI videos from text without login?",
        href: "/questions/can-i-make-ai-videos-from-text-without-login",
      },
      {
        title: "Can AI turn text into a video with voice?",
        href: "/questions/can-ai-turn-text-into-a-video-with-voice",
      },
      {
        title: "What is the best free text to video AI?",
        href: "/questions/what-is-the-best-free-text-to-video-ai",
      },
    ],
    finalTitle: "Ready to turn text into video?",
    finalText:
      "Open the text-to-video generator, paste your source text and create a vertical video with AI voice, subtitles and visual scenes.",
  },
  es: {
    title: "Text to Video AI Gratis",
    description:
      "Crea videos con IA desde texto con guion, voz, subtitulos y visuales verticales. Aprende cuando basta una herramienta text-to-video gratuita.",
    eyebrow: "Herramienta de texto a video",
    h1: "Convierte texto en video con IA antes de abrir un editor.",
    intro:
      "Usa esta herramienta cuando ya tienes un guion, nota, anuncio o idea corta y quieres convertirlo en video vertical. URL to Video puede generar voz, subtitulos y escenas visuales desde texto escrito para probar una idea rapido.",
    primaryCta: "Crear video desde texto",
    secondaryCta: "Convertir un articulo",
    direct: {
      eyebrow: "Mejor caso de uso",
      title: "Cuando basta una herramienta text-to-video AI gratis?",
      text:
        "Basta cuando quieres un video social corto desde un texto claro. Para guiones largos, publicacion repetida o contenido sensible de marca, revisa el resultado y los limites actuales de la herramienta antes de escalar.",
    },
    stepsTitle: "Flujo text-to-video AI gratis",
    steps: [
      {
        title: "Pega el texto",
        text:
          "Empieza con un guion corto, nota de producto, anuncio, lista o explicacion educativa.",
      },
      {
        title: "Genera la estructura",
        text:
          "La herramienta convierte el texto en una secuencia corta con hook, escenas y ritmo simple.",
      },
      {
        title: "Anade voz y subtitulos",
        text:
          "La voz y los captions hacen que el video se entienda en redes con o sin sonido.",
      },
      {
        title: "Exporta un MP4 vertical",
        text:
          "Descarga el clip terminado y publicalo en Shorts, Reels, TikTok u otro canal vertical.",
      },
    ],
    benefitsTitle: "Por que empezar desde texto",
    benefits: [
      "Puedes probar ideas de video antes de editar manualmente.",
      "Las notas escritas se convierten en clips sociales sin grabarte.",
      "Los guiones cortos mantienen el video enfocado.",
    ],
    relatedTitle: "Preguntas sobre text-to-video",
    related: [
      {
        title: "Text to video AI es gratis?",
        href: "/questions/is-text-to-video-ai-free",
      },
      {
        title: "Puedo hacer videos IA desde texto sin login?",
        href: "/questions/can-i-make-ai-videos-from-text-without-login",
      },
      {
        title: "Puede la IA convertir texto en video con voz?",
        href: "/questions/can-ai-turn-text-into-a-video-with-voice",
      },
      {
        title: "Cual es el mejor text to video AI gratis?",
        href: "/questions/what-is-the-best-free-text-to-video-ai",
      },
    ],
    finalTitle: "Listo para convertir texto en video?",
    finalText:
      "Abre el generador text-to-video, pega tu texto fuente y crea un video vertical con voz IA, subtitulos y escenas visuales.",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: FreeTextToVideoPageProps): Promise<Metadata> {
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

export default async function FreeTextToVideoPage({
  params,
}: FreeTextToVideoPageProps) {
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
                href={toolPath}
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
                href={articlePath}
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
              <Gauge size={22} aria-hidden />
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
            <Mic2 className="text-citrus" size={24} aria-hidden />
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
            href={toolPath}
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
