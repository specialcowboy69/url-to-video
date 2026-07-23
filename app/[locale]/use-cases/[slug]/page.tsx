import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { isUseCaseSlug, localeAlternates, siteUrl, useCaseSlugs } from "@/app/seo";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return useCaseSlugs.flatMap((slug) => [
    { locale: "es", slug },
    { locale: "en", slug },
  ]);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isUseCaseSlug(slug)) {
    return {};
  }

  const tUseCases = await getTranslations({
    locale,
    namespace: "UseCases.items",
  });

  return {
    title: tUseCases(`${slug}.title`),
    description: tUseCases(`${slug}.description`),
    alternates: {
      canonical: `${siteUrl}/${locale}/use-cases/${slug}`,
      languages: localeAlternates(`/use-cases/${slug}`),
    },
    openGraph: {
      title: tUseCases(`${slug}.title`),
      description: tUseCases(`${slug}.description`),
      url: `${siteUrl}/${locale}/use-cases/${slug}`,
      type: "website",
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isUseCaseSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  const tUseCases = await getTranslations({
    locale,
    namespace: "UseCases.items",
  });
  const common = await getTranslations({ locale, namespace: "UseCases" });
  const seo = await getTranslations({ locale, namespace: "Seo" });

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tUseCases(`${slug}.title`),
    url: `${siteUrl}/${locale}/use-cases/${slug}`,
    description: tUseCases(`${slug}.description`),
    isPartOf: {
      "@type": "WebSite",
      name: seo("siteName"),
      url: `${siteUrl}/${locale}`,
    },
  };

  const benefits = [
    common("benefits.one"),
    common("benefits.two"),
    common("benefits.three"),
  ];

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
            {common("back")}
          </Link>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-ink sm:text-7xl">
            {tUseCases(`${slug}.title`)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            {tUseCases(`${slug}.description`)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
            >
              <span>{common("create")}</span>
              <ArrowRight size={19} aria-hidden />
            </Link>
            <Link
              href="/"
              className="flex h-14 items-center justify-center rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
            >
              {common("home")}
            </Link>
          </div>
        </div>

        <aside className="rounded-[32px] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">
            {common("audience")}
          </p>
          <p className="mt-3 text-2xl font-black leading-tight text-ink">
            {tUseCases(`${slug}.audience`)}
          </p>
          <div className="mt-8 space-y-4">
            {benefits.map((benefit) => (
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
