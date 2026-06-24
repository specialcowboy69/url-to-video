export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://urltovideo.es";

export const siteName = "URL to Video";

export const defaultDescription =
  "Convierte una URL publica en un video vertical con guion, voz, subtitulos y material visual generado para redes sociales.";

export const useCases = [
  {
    slug: "news-to-video",
    title: "Convertir noticias en videos",
    description:
      "Transforma noticias y articulos informativos en videos verticales con subtitulos para distribuir contenido editorial en redes.",
    audience: "Medios digitales, newsletters y equipos editoriales",
    intent: "Convertir noticias en video con IA",
  },
  {
    slug: "blog-to-video",
    title: "Convertir posts de blog en videos",
    description:
      "Reutiliza articulos de blog como shorts explicativos para aumentar la distribucion de contenido SEO en canales sociales.",
    audience: "Agencias SEO, creadores de nichos y equipos de contenido",
    intent: "Pasar blog a video automaticamente",
  },
  {
    slug: "product-to-video",
    title:
      "Convierte tus redes sociales en una puerta de entrada para nuevos clientes",
    description:
      "Crea videos verticales a partir de blogs o noticias relacionadas con tu negocio y despega en redes",
    audience: "Ecommerce, marcas DTC y equipos de paid social",
    intent: "Perfecto para dinamizar tu presencia en redes",
  },
] as const;
