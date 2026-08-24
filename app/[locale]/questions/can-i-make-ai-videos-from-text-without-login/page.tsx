import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type TextVideoWithoutLoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/can-i-make-ai-videos-from-text-without-login";
const toolPath = "/text-to-video-ai";
const secondaryPath = "/free-text-to-video-ai";

const copy = {
  en: {
    title: "Can I Make AI Videos From Text Without Login",
    description:
      "Learn how no-login text-to-video AI tools work and what limits to expect when creating videos from text.",
    eyebrow: "Quick answer",
    h1: "Can I make AI videos from text without login?",
    answer:
      "Yes, if the tool supports no-login generation. Usually you paste the text, choose the video language or style, generate the clip, then download the result. Some tools may still require login for longer videos, saved projects or higher usage.",
    stepsTitle: "No-login workflow",
    steps: [
      "Paste a short script or written idea into the text box.",
      "Choose the language and basic video settings.",
      "Generate voiceover, subtitles and visual scenes.",
      "Download the vertical video if the export is available without an account.",
    ],
    detailTitle: "What limits are common?",
    detail:
      "No-login tools often limit script length, daily usage, queue priority or saved history. For quick tests this is fine; for repeated publishing, keep your source text organized outside the tool.",
    nextTitle: "Next step",
    nextText:
      "Try the text-to-video tool with a short script. If you want the broader free tool page first, read the intermediate page.",
    toolCta: "Create video from text",
    secondaryCta: "See the free tool",
  },
  es: {
    title: "Puedo Hacer Videos IA Desde Texto Sin Login",
    description:
      "Aprende como funcionan las herramientas text-to-video AI sin login y que limites esperar al crear videos desde texto.",
    eyebrow: "Respuesta rapida",
    h1: "Puedo hacer videos IA desde texto sin login?",
    answer:
      "Si, si la herramienta permite generar sin login. Normalmente pegas el texto, eliges idioma o estilo, generas el clip y descargas el resultado. Algunas herramientas pueden pedir login para videos largos, proyectos guardados o mas uso.",
    stepsTitle: "Flujo sin login",
    steps: [
      "Pega un guion corto o idea escrita en el campo de texto.",
      "Elige idioma y ajustes basicos del video.",
      "Genera voz, subtitulos y escenas visuales.",
      "Descarga el video vertical si la exportacion esta disponible sin cuenta.",
    ],
    detailTitle: "Que limites son comunes?",
    detail:
      "Las herramientas sin login suelen limitar longitud del guion, uso diario, prioridad de cola o historial guardado. Para pruebas rapidas esta bien; para publicar de forma repetida, guarda tu texto fuente fuera de la herramienta.",
    nextTitle: "Siguiente paso",
    nextText:
      "Prueba la herramienta text-to-video con un guion corto. Si quieres ver antes la herramienta gratuita completa, lee la pagina intermedia.",
    toolCta: "Crear video desde texto",
    secondaryCta: "Ver herramienta gratuita",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: TextVideoWithoutLoginPageProps): Promise<Metadata> {
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

export default async function TextVideoWithoutLoginPage({
  params,
}: TextVideoWithoutLoginPageProps) {
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
