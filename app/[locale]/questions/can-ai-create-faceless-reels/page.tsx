import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type CanAiCreateFacelessReelsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/can-ai-create-faceless-reels";
const toolPath = "/text-to-video-ai";
const secondaryPath = "/faceless-reels-generator";

const copy = {
  en: {
    title: "Can AI Create Faceless Reels",
    description:
      "Find out what AI can create in a faceless reels generator, including scripts, voiceover, subtitles and vertical scenes.",
    eyebrow: "Quick answer",
    h1: "Can AI create faceless reels?",
    answer:
      "Yes. AI can create faceless reels when you provide a clear topic, text prompt or article source. It can draft the script, generate voiceover, add subtitles and assemble vertical visuals, while you review the message before publishing.",
    stepsTitle: "What AI can handle",
    steps: [
      "Turn an article, URL or text prompt into a short script.",
      "Create a voiceover so the reel does not need a presenter.",
      "Add subtitles for silent viewing on social feeds.",
      "Generate or assemble vertical scenes that match the idea.",
    ],
    detailTitle: "Where should humans still review?",
    detail:
      "Review the hook, claims, brand tone and any facts before publishing. AI is strongest when the source material is clear and the final reel is informational rather than a complex edited story.",
    nextTitle: "Next step",
    nextText:
      "Open the text-to-video tool if you want to start from a prompt. Use the faceless reels generator if you want to start from articles or URLs.",
    toolCta: "Create video from text",
    secondaryCta: "See faceless reels generator",
  },
  es: {
    title: "Puede la IA Crear Faceless Reels",
    description:
      "Descubre que puede crear la IA en un generador de faceless reels: guion, voz, subtitulos y escenas verticales.",
    eyebrow: "Respuesta rapida",
    h1: "Puede la IA crear faceless reels?",
    answer:
      "Si. La IA puede crear faceless reels cuando le das un tema claro, un prompt de texto o un articulo fuente. Puede preparar el guion, generar voz, anadir subtitulos y montar visuales verticales, mientras tu revisas el mensaje antes de publicar.",
    stepsTitle: "Que puede hacer la IA",
    steps: [
      "Convertir un articulo, URL o prompt en un guion corto.",
      "Crear voz para que el reel no necesite presentador.",
      "Anadir subtitulos para consumo sin sonido en redes.",
      "Generar o montar escenas verticales que encajen con la idea.",
    ],
    detailTitle: "Donde conviene revisar manualmente?",
    detail:
      "Revisa el hook, las afirmaciones, el tono de marca y cualquier dato antes de publicar. La IA funciona mejor cuando la fuente es clara y el reel final es informativo, no una historia editada compleja.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre la herramienta text-to-video si quieres empezar desde un prompt. Usa el generador de faceless reels si quieres empezar desde articulos o URLs.",
    toolCta: "Crear video desde texto",
    secondaryCta: "Ver generador de faceless reels",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: CanAiCreateFacelessReelsPageProps): Promise<Metadata> {
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

export default async function CanAiCreateFacelessReelsPage({
  params,
}: CanAiCreateFacelessReelsPageProps) {
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
