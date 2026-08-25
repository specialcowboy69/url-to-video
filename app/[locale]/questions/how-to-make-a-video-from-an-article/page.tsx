import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

type ArticleQuestionPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/how-to-make-a-video-from-an-article";
const ladderPath = "/convert-blog-post-to-video";

const copy = {
  en: {
    title: "How to Make a Video From an Article",
    description:
      "Learn the fastest way to turn an article into a short vertical video with AI-generated script, voiceover, subtitles and visuals.",
    eyebrow: "Quick answer",
    h1: "How do I make a video from an article?",
    answer:
      "The fastest way is to paste the public article URL into an article to video tool. The tool extracts the main idea, writes a short script, adds voiceover and subtitles, then creates a vertical video for Shorts, Reels or TikTok.",
    stepsTitle: "Simple process",
    steps: [
      "Choose an article with one clear idea.",
      "Paste the URL or the article text.",
      "Let the tool generate the script, voice and subtitles.",
      "Download the vertical MP4 and publish it on social platforms.",
    ],
    detailTitle: "What kind of article works best?",
    detail:
      "Short, structured articles usually produce better videos than long pages with many unrelated sections. A clear headline, a strong introduction and a few useful points give the AI enough structure to make a focused clip.",
    nextTitle: "Next step",
    nextText:
      "If you want the full guide, use the blog-post-to-video page. It explains how to choose source articles, handle blocked URLs and move from article content to a publishable video.",
    cta: "See the blog post to video guide",
  },
  es: {
    title: "Como Crear un Video Desde un Articulo",
    description:
      "Aprende la forma mas rapida de convertir un articulo en un video vertical corto con guion, voz, subtitulos y visuales generados por IA.",
    eyebrow: "Respuesta rapida",
    h1: "Como puedo crear un video desde un articulo?",
    answer:
      "La forma mas rapida es pegar la URL publica del articulo en una herramienta article-to-video. La herramienta extrae la idea principal, escribe un guion corto, anade voz y subtitulos, y crea un MP4 vertical para Shorts, Reels o TikTok.",
    stepsTitle: "Proceso simple",
    steps: [
      "Elige un articulo con una idea clara.",
      "Pega la URL o el texto del articulo.",
      "Deja que la herramienta genere guion, voz y subtitulos.",
      "Descarga el MP4 vertical y publicalo en redes sociales.",
    ],
    detailTitle: "Que tipo de articulo funciona mejor?",
    detail:
      "Los articulos cortos y bien estructurados suelen producir mejores videos que paginas largas con muchas secciones mezcladas. Un titular claro, una buena introduccion y algunos puntos utiles dan suficiente estructura a la IA para crear un clip enfocado.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si quieres la guia completa, usa la pagina de blog post a video. Explica como elegir articulos de origen, gestionar URLs bloqueadas y pasar de contenido escrito a un video publicable.",
    cta: "Ver la guia blog post a video",
  },
} as const;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: ArticleQuestionPageProps): Promise<Metadata> {
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

export default async function ArticleQuestionPage({
  params,
}: ArticleQuestionPageProps) {
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
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ocean" size={18} aria-hidden />
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
            <Link
              href={ladderPath}
              className="group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white px-5 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean"
            >
              {text.cta}
              <ArrowRight size={17} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
