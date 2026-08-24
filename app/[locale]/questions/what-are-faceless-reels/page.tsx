import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type WhatAreFacelessReelsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/what-are-faceless-reels";
const toolPath = "/article-to-video-ai";
const secondaryPath = "/faceless-reels-generator";

const copy = {
  en: {
    title: "What Are Faceless Reels",
    description:
      "A quick explanation of faceless reels, how they work and when to use an AI article-to-video tool to create them.",
    eyebrow: "Quick answer",
    h1: "What are faceless reels?",
    answer:
      "Faceless reels are short vertical videos where the creator does not appear on camera. They usually combine voiceover, subtitles and visuals such as clips, screenshots, graphics or AI-generated scenes to explain one idea quickly.",
    stepsTitle: "Common faceless reel format",
    steps: [
      "Start with one clear idea, question or takeaway.",
      "Write a short hook and a simple spoken script.",
      "Add visuals that support the message instead of showing your face.",
      "Publish the video in a vertical format for Reels, Shorts or TikTok.",
    ],
    detailTitle: "When does this format work best?",
    detail:
      "It works best for educational, list-based, tutorial, commentary and content-repurposing videos. If the source idea already exists in an article or written note, an article-to-video tool can turn it into a faceless reel faster than editing from scratch.",
    nextTitle: "Next step",
    nextText:
      "If you already have an article or written source, open the tool directly. If you want the broader generator page first, read the faceless reels generator page.",
    toolCta: "Create a faceless reel",
    secondaryCta: "See the faceless reels generator",
  },
  es: {
    title: "Que Son los Faceless Reels",
    description:
      "Explicacion rapida de que son los faceless reels, como funcionan y cuando usar una herramienta article-to-video con IA para crearlos.",
    eyebrow: "Respuesta rapida",
    h1: "Que son los faceless reels?",
    answer:
      "Los faceless reels son videos verticales cortos donde el creador no aparece en camara. Suelen combinar voz, subtitulos y visuales como clips, capturas, graficos o escenas generadas con IA para explicar una idea rapidamente.",
    stepsTitle: "Formato comun de faceless reel",
    steps: [
      "Empieza con una idea, pregunta o conclusion clara.",
      "Escribe un hook corto y un guion hablado simple.",
      "Anade visuales que apoyen el mensaje sin mostrar tu cara.",
      "Publica el video en formato vertical para Reels, Shorts o TikTok.",
    ],
    detailTitle: "Cuando funciona mejor este formato?",
    detail:
      "Funciona mejor para videos educativos, listas, tutoriales, comentario y reutilizacion de contenido. Si la idea ya existe en un articulo o nota escrita, una herramienta article-to-video puede convertirla en faceless reel mas rapido que editar desde cero.",
    nextTitle: "Siguiente paso",
    nextText:
      "Si ya tienes un articulo o fuente escrita, abre la herramienta directamente. Si quieres ver antes la pagina completa, lee el generador de faceless reels.",
    toolCta: "Crear un faceless reel",
    secondaryCta: "Ver generador de faceless reels",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: WhatAreFacelessReelsPageProps): Promise<Metadata> {
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

export default async function WhatAreFacelessReelsPage({
  params,
}: WhatAreFacelessReelsPageProps) {
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
