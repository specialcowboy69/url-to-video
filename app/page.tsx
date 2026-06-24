import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileVideo, Gauge, Shield } from "lucide-react";
import { defaultDescription, siteName, siteUrl, useCases } from "@/app/seo";

export const metadata: Metadata = {
  title: "Convertir URL en video con IA | URL to Video",
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteName,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description: defaultDescription,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  featureList: [
    "Convertir URLs publicas en videos verticales",
    "Generar guion, voz y subtitulos",
    "Usar imagenes o videos como material visual",
    "Exportar MP4 para redes sociales",
  ],
};

const steps = [
  "Pega una URL publica",
  "Elige imagenes o videos",
  "Genera un MP4 vertical",
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1fr,420px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            URL to Video
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none text-ink sm:text-7xl">
            Convertir URL en video con IA
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            Crea videos verticales desde noticias, articulos, blogs o paginas de
            producto. El flujo genera guion, voz, subtitulos y material visual
            para publicar mas rapido en redes sociales.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
            >
              <span>Crear video</span>
              <ArrowRight size={19} aria-hidden />
            </Link>
            <a
              href="#casos-de-uso"
              className="flex h-14 items-center justify-center rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
            >
              Ver casos de uso
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white/82 px-4 text-sm font-bold text-ink shadow-sm"
              >
                <CheckCircle2 className="shrink-0 text-ocean" size={18} />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[380px]">
          <div className="aspect-[9/16] overflow-hidden rounded-[32px] bg-ink p-4 shadow-soft">
            <div className="flex h-full flex-col justify-between rounded-[24px] bg-[#f7f8f3] p-5">
              <div className="rounded-2xl bg-citrus px-4 py-3 text-sm font-black text-ink">
                URL analizada
              </div>
              <div className="space-y-3">
                <div className="h-48 rounded-3xl bg-[linear-gradient(135deg,#0b7285,#d7ff47)]" />
                <div className="h-3 w-5/6 rounded-full bg-ink" />
                <div className="h-3 w-2/3 rounded-full bg-ink/45" />
              </div>
              <div className="rounded-2xl bg-ink px-4 py-3 text-center text-sm font-black text-white">
                MP4 vertical listo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <Feature
            icon={<FileVideo size={24} />}
            title="Contenido reutilizable"
            text="Convierte una pieza escrita en un formato audiovisual pensado para Shorts, Reels y TikTok."
          />
          <Feature
            icon={<Gauge size={24} />}
            title="Flujo rapido"
            text="Obten tu video en menos de 5 minutos. Pueden ocasionarse retrasos en momentos de mucha demanda"
          />
          <Feature
            icon={<Shield size={24} />}
            title="Mejora tu presencia en redes"
            text="Perfecto para dueños de negocios con poco tiempo y pocos recursos que necesitan mejorar su presencia online."
          />
        </div>
      </section>

      <section id="casos-de-uso" className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            Casos de uso
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            De URL a video segun tu tipo de contenido
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCases.map((item) => (
            <Link
              key={item.slug}
              href={`/use-cases/${item.slug}`}
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-ocean">
                {item.intent}
              </p>
              <h3 className="mt-4 text-2xl font-black text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black leading-tight text-ink">
            Necesitas ayuda o tienes alguna sugerencia?
          </h2>
          <p className="mt-4 text-lg leading-8 text-ink/68">
            Contactanos al siguiente correo:{" "}
            <a
              href="mailto:testappbelleza@gmail.com"
              className="font-black text-ocean underline decoration-ocean/30 underline-offset-4 transition hover:text-ink"
            >
              testappbelleza@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean">
        {icon}
      </div>
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-ink/64">{text}</p>
    </div>
  );
}
