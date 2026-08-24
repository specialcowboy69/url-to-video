import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type BestFreeTextToVideoAiPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/what-is-the-best-free-text-to-video-ai";
const toolPath = "/text-to-video-ai";
const secondaryPath = "/free-text-to-video-ai";

const copy = {
  en: {
    title: "What Is the Best Free Text to Video AI",
    description:
      "Learn what to look for in the best free text-to-video AI tool for short scripts, voiceover, subtitles and vertical videos.",
    eyebrow: "Quick answer",
    h1: "What is the best free text to video AI?",
    answer:
      "The best free text-to-video AI tool is the one that matches your use case: short scripts, clear voiceover, readable subtitles, useful visuals and export limits that fit how often you publish.",
    stepsTitle: "How to compare free tools",
    steps: [
      "Check whether it creates voiceover and subtitles from text.",
      "Look at export format, watermark rules and usage limits.",
      "Test whether visuals match the meaning of your script.",
      "Choose the tool that gets a usable short video fastest.",
    ],
    detailTitle: "What matters most for social videos?",
    detail:
      "For Shorts, Reels and TikTok, speed and clarity matter more than heavy editing. A good free tool should turn one written idea into a clear vertical clip without forcing you to rebuild every scene manually.",
    nextTitle: "Next step",
    nextText:
      "Try the text-to-video tool if your script is ready. Use the free tool page if you want the checklist before choosing a tool.",
    toolCta: "Try text to video AI",
    secondaryCta: "See the checklist",
  },
  es: {
    title: "Cual Es el Mejor Text to Video AI Gratis",
    description:
      "Aprende que buscar en el mejor text-to-video AI gratis para guiones cortos, voz, subtitulos y videos verticales.",
    eyebrow: "Respuesta rapida",
    h1: "Cual es el mejor text to video AI gratis?",
    answer:
      "El mejor text-to-video AI gratis es el que encaja con tu caso de uso: guiones cortos, voz clara, subtitulos legibles, visuales utiles y limites de exportacion que encajen con tu frecuencia de publicacion.",
    stepsTitle: "Como comparar herramientas gratis",
    steps: [
      "Comprueba si crea voz y subtitulos desde texto.",
      "Mira formato de exportacion, watermark y limites de uso.",
      "Prueba si los visuales encajan con el significado del guion.",
      "Elige la herramienta que consiga un video corto usable mas rapido.",
    ],
    detailTitle: "Que importa mas para videos sociales?",
    detail:
      "Para Shorts, Reels y TikTok, la rapidez y claridad importan mas que una edicion pesada. Una buena herramienta gratuita deberia convertir una idea escrita en clip vertical claro sin obligarte a rehacer cada escena manualmente.",
    nextTitle: "Siguiente paso",
    nextText:
      "Prueba la herramienta text-to-video si tu guion esta listo. Usa la pagina de la herramienta gratuita si quieres revisar el checklist antes de elegir herramienta.",
    toolCta: "Probar text to video AI",
    secondaryCta: "Ver checklist",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: BestFreeTextToVideoAiPageProps): Promise<Metadata> {
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

export default async function BestFreeTextToVideoAiPage({
  params,
}: BestFreeTextToVideoAiPageProps) {
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
