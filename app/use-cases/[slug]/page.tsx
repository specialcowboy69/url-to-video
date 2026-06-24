import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { siteName, siteUrl, useCases } from "@/app/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = useCases.find((item) => item.slug === slug);

  if (!useCase) {
    return {};
  }

  return {
    title: `${useCase.title} | ${siteName}`,
    description: useCase.description,
    alternates: {
      canonical: `${siteUrl}/use-cases/${useCase.slug}`,
    },
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      url: `${siteUrl}/use-cases/${useCase.slug}`,
      type: "website",
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const useCase = useCases.find((item) => item.slug === slug);

  if (!useCase) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: useCase.title,
    url: `${siteUrl}/use-cases/${useCase.slug}`,
    description: useCase.description,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr,360px]">
        <div>
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.2em] text-ocean"
          >
            URL to Video
          </Link>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-ink sm:text-7xl">
            {useCase.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            {useCase.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
            >
              <span>Crear video</span>
              <ArrowRight size={19} aria-hidden />
            </Link>
            <Link
              href="/"
              className="flex h-14 items-center justify-center rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        <aside className="rounded-[32px] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">
            Para quien
          </p>
          <p className="mt-3 text-2xl font-black leading-tight text-ink">
            {useCase.audience}
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Reduce el tiempo entre publicar y distribuir.",
              "Mantiene un flujo visual adaptado a formato vertical.",
              "Centraliza guion, voz, subtitulos y render en un solo proceso.",
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-ocean"
                  size={18}
                  aria-hidden
                />
                <p className="text-sm leading-6 text-ink/68">{benefit}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
