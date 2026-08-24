import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";
import {
  QuestionAnswerPage,
  type QuestionAnswerCopy,
} from "../_components/QuestionAnswerPage";

type TextToVideoWithVoicePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pagePath = "/questions/can-ai-turn-text-into-a-video-with-voice";
const toolPath = "/text-to-video-ai";
const secondaryPath = "/free-text-to-video-ai";

const copy = {
  en: {
    title: "Can AI Turn Text Into a Video With Voice",
    description:
      "Learn how AI turns text into a video with voiceover, subtitles and vertical visuals for social publishing.",
    eyebrow: "Quick answer",
    h1: "Can AI turn text into a video with voice?",
    answer:
      "Yes. AI can turn text into a video with voice by creating a short script structure, generating a voiceover, adding subtitles and pairing the message with vertical visual scenes.",
    stepsTitle: "Text to video with voice process",
    steps: [
      "Start with text that already has one clear message.",
      "Generate a short spoken script or condense the original text.",
      "Create a voiceover and matching subtitles.",
      "Export a vertical video with visuals that support the message.",
    ],
    detailTitle: "What text works best?",
    detail:
      "Short scripts, product updates, educational notes and list-style explanations work best. Very long text should be narrowed to one idea so the voiceover stays concise.",
    nextTitle: "Next step",
    nextText:
      "Open the text-to-video tool to create a video with voice. Read the free tool page if you want to check fit and limits first.",
    toolCta: "Create video with voice",
    secondaryCta: "See the free tool",
  },
  es: {
    title: "Puede la IA Convertir Texto en Video con Voz",
    description:
      "Aprende como la IA convierte texto en video con voz, subtitulos y visuales verticales para redes sociales.",
    eyebrow: "Respuesta rapida",
    h1: "Puede la IA convertir texto en video con voz?",
    answer:
      "Si. La IA puede convertir texto en video con voz creando una estructura de guion corto, generando voz, anadiendo subtitulos y combinando el mensaje con escenas visuales verticales.",
    stepsTitle: "Proceso de texto a video con voz",
    steps: [
      "Empieza con un texto que tenga un mensaje claro.",
      "Genera un guion hablado corto o condensa el texto original.",
      "Crea voz y subtitulos sincronizados.",
      "Exporta un video vertical con visuales que apoyen el mensaje.",
    ],
    detailTitle: "Que texto funciona mejor?",
    detail:
      "Funcionan mejor los guiones cortos, updates de producto, notas educativas y explicaciones en formato lista. El texto muy largo conviene reducirlo a una idea para que la voz sea concisa.",
    nextTitle: "Siguiente paso",
    nextText:
      "Abre la herramienta text-to-video para crear un video con voz. Lee la pagina de la herramienta gratuita si quieres revisar antes encaje y limites.",
    toolCta: "Crear video con voz",
    secondaryCta: "Ver herramienta gratuita",
  },
} satisfies Record<"en" | "es", QuestionAnswerCopy & { description: string }>;

function getCopy(locale: string) {
  return locale === "es" ? copy.es : copy.en;
}

export async function generateMetadata({
  params,
}: TextToVideoWithVoicePageProps): Promise<Metadata> {
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

export default async function TextToVideoWithVoicePage({
  params,
}: TextToVideoWithVoicePageProps) {
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
