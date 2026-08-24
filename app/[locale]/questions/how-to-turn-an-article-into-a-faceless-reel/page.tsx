import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type ArticleToFacelessReelPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/how-to-turn-an-article-into-a-faceless-reel";
const toolPath = "/article-to-video-ai";
const secondaryPath = "/faceless-reels-generator";

const copy = {
  en: {
    title: "How to Turn an Article Into a Faceless Reel",
    description:
      "Learn how to convert a public article URL into a faceless reel with AI script, voiceover, subtitles and vertical visuals.",
    eyebrow: "Quick answer",
    h1: "How do I turn an article into a faceless reel?",
    answer:
      "Paste the public article URL into an article-to-video tool. The tool extracts the main idea, writes a short script, adds voiceover and subtitles, then creates a vertical video that can work as a faceless Reel, Short or TikTok.",
    stepsTitle: "Article to faceless reel process",
    steps: [
      "Choose an article with one clear central idea.",
      "Paste the public URL into the article-to-video generator.",
      "Let the tool create the short script, voiceover and captions.",
      "Export the vertical MP4 and publish it as a faceless reel.",
    ],
    detailTitle: "What kind of article works best?",
    detail:
      "Use articles with a clear takeaway, list, guide or explanation. Very broad articles may need a narrower angle so the final reel has one strong hook instead of too many disconnected points.",
    nextTitle: "Next step",
    nextText:
      "Open the article-to-video tool if you have the URL ready. Read the generator page if you want to see where faceless reels fit in the broader content pipeline.",
    toolCta: "Convert article to faceless reel",
    secondaryCta: "See the generator",
  },
  es: {
    title: "Como Convertir un Articulo en Faceless Reel",
    description:
      "Aprende como convertir una URL publica de articulo en un faceless reel con guion IA, voz, subtitulos y visuales verticales.",
    eyebrow: "Respuesta rapida",
    h1: "Como convierto un articulo en faceless reel?",
    answer:
      "Pega la URL publica del articulo en una herramienta article-to-video. La herramienta extrae la idea principal, escribe un guion corto, anade voz y subtitulos, y crea un video vertical que puede funcionar como faceless Reel, Short o TikTok.",
    stepsTitle: "Proceso de articulo a faceless reel",
    steps: [
      "Elige un articulo con una idea central clara.",
      "Pega la URL publica en el generador article-to-video.",
      "Deja que la herramienta cree guion corto, voz y captions.",
      "Exporta el MP4 vertical y publicalo como faceless reel.",
    ],
    detailTitle: "Que tipo de articulo funciona mejor?",
    detail:
      "Usa articulos con una conclusion clara, lista, guia o explicacion. Los articulos muy amplios pueden necesitar un angulo mas concreto para que el reel final tenga un hook fuerte y no demasiados puntos desconectados.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre la herramienta article-to-video si ya tienes la URL lista. Lee la pagina del generador si quieres ver donde encajan los faceless reels dentro del pipeline de contenido.",
    toolCta: "Convertir articulo en faceless reel",
    secondaryCta: "Ver el generador",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: ArticleToFacelessReelPageProps): Promise<Metadata> {
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

export default async function ArticleToFacelessReelPage({
  params,
}: ArticleToFacelessReelPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <QuestionAnswerPage
      locale={locale}
      pagePath={pagePath}
      text={getCopy(locale)}
      toolPath={toolPath}
      secondaryPath={secondaryPath}
    />
  );
}
