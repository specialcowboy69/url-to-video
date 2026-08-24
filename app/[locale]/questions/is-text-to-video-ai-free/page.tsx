import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type IsTextToVideoAiFreePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/is-text-to-video-ai-free";
const toolPath = "/text-to-video-ai";
const secondaryPath = "/free-text-to-video-ai";

const copy = {
  en: {
    title: "Is Text to Video AI Free",
    description:
      "Learn when a free text-to-video AI tool is enough and what limits to check before creating videos from text.",
    eyebrow: "Quick answer",
    h1: "Is text to video AI free?",
    answer:
      "Some text-to-video AI tools let you start for free, usually with limits on length, exports, watermarking, speed or usage. A free tool is best for testing short scripts before committing to a larger production process.",
    stepsTitle: "What to check first",
    steps: [
      "Check how much text you can paste into the generator.",
      "Confirm whether voiceover, subtitles and visuals are included.",
      "Review export limits, watermark rules and processing speed.",
      "Test one short video before scaling a full content batch.",
    ],
    detailTitle: "When is free enough?",
    detail:
      "Free access is usually enough for testing hooks, validating a social idea or turning a short note into a vertical clip. If you need repeated publishing, longer scripts or consistent brand output, check the current limits before relying on it.",
    nextTitle: "Next step",
    nextText:
      "Open the text-to-video tool if you have a short script ready. Read the free tool page if you want to understand the limits and best use cases first.",
    toolCta: "Create a text video",
    secondaryCta: "See the free tool",
  },
  es: {
    title: "Text to Video AI Es Gratis",
    description:
      "Aprende cuando basta una herramienta text-to-video AI gratis y que limites revisar antes de crear videos desde texto.",
    eyebrow: "Respuesta rapida",
    h1: "Text to video AI es gratis?",
    answer:
      "Algunas herramientas text-to-video AI permiten empezar gratis, normalmente con limites de longitud, exportaciones, marca de agua, velocidad o uso. Una herramienta gratuita encaja mejor para probar guiones cortos antes de producir mas volumen.",
    stepsTitle: "Que revisar primero",
    steps: [
      "Comprueba cuanto texto puedes pegar en el generador.",
      "Confirma si incluye voz, subtitulos y visuales.",
      "Revisa limites de exportacion, watermark y velocidad.",
      "Prueba un video corto antes de escalar un batch completo.",
    ],
    detailTitle: "Cuando basta gratis?",
    detail:
      "El acceso gratuito suele bastar para probar hooks, validar una idea social o convertir una nota corta en clip vertical. Si necesitas publicar de forma repetida, usar guiones largos o mantener marca consistente, revisa los limites actuales antes de depender de ello.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre la herramienta text-to-video si tienes un guion corto listo. Lee la pagina de la herramienta gratuita si quieres entender antes limites y mejores casos de uso.",
    toolCta: "Crear video desde texto",
    secondaryCta: "Ver herramienta gratuita",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: IsTextToVideoAiFreePageProps): Promise<Metadata> {
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

export default async function IsTextToVideoAiFreePage({
  params,
}: IsTextToVideoAiFreePageProps) {
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
