import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type HowToMakeFacelessReelsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/how-to-make-faceless-reels";
const toolPath = "/article-to-video-ai";
const secondaryPath = "/faceless-reels-generator";

const copy = {
  en: {
    title: "How to Make Faceless Reels",
    description:
      "Learn the simple process for making faceless reels from articles, written ideas or short scripts using AI voiceover and subtitles.",
    eyebrow: "Quick answer",
    h1: "How do I make faceless reels?",
    answer:
      "To make faceless reels, choose one idea, turn it into a short script, add voiceover, subtitles and vertical visuals, then export the clip for Reels, Shorts or TikTok. You can do this from scratch or start with an article URL.",
    stepsTitle: "Simple faceless reels process",
    steps: [
      "Pick a topic that can be explained in one short video.",
      "Create a concise script with a hook, key point and ending.",
      "Use voiceover, subtitles and visual scenes instead of camera footage.",
      "Export the video as a vertical MP4 for social platforms.",
    ],
    detailTitle: "What is the fastest source material?",
    detail:
      "Articles, blog posts and guides are strong source material because they already contain structure and context. An article-to-video tool can extract the main idea, shorten the message and create the faceless reel assets in one place.",
    nextTitle: "Next step",
    nextText:
      "Open the article-to-video tool if your source is ready. Use the generator page if you want to compare article, URL and text starting points first.",
    toolCta: "Make a faceless reel",
    secondaryCta: "See the generator",
  },
  es: {
    title: "Como Hacer Faceless Reels",
    description:
      "Aprende el proceso simple para hacer faceless reels desde articulos, ideas escritas o guiones cortos con voz IA y subtitulos.",
    eyebrow: "Respuesta rapida",
    h1: "Como hago faceless reels?",
    answer:
      "Para hacer faceless reels, elige una idea, conviertela en un guion corto, anade voz, subtitulos y visuales verticales, y exporta el clip para Reels, Shorts o TikTok. Puedes hacerlo desde cero o empezar con una URL de articulo.",
    stepsTitle: "Proceso simple para faceless reels",
    steps: [
      "Elige un tema que se pueda explicar en un video corto.",
      "Crea un guion conciso con hook, punto clave y cierre.",
      "Usa voz, subtitulos y escenas visuales en lugar de camara.",
      "Exporta el video como MP4 vertical para redes sociales.",
    ],
    detailTitle: "Cual es el material fuente mas rapido?",
    detail:
      "Los articulos, posts de blog y guias funcionan muy bien porque ya tienen estructura y contexto. Una herramienta article-to-video puede extraer la idea principal, acortar el mensaje y crear los assets del faceless reel en un solo lugar.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre la herramienta article-to-video si tu fuente esta lista. Usa la pagina del generador si quieres comparar antes los puntos de partida desde articulo, URL y texto.",
    toolCta: "Hacer un faceless reel",
    secondaryCta: "Ver el generador",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: HowToMakeFacelessReelsPageProps): Promise<Metadata> {
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

export default async function HowToMakeFacelessReelsPage({
  params,
}: HowToMakeFacelessReelsPageProps) {
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
