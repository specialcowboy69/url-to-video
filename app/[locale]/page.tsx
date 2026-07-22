import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, FileVideo, Gauge, Shield } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ExampleVideos } from "@/app/components/ExampleVideos";
import { siteUrl, useCaseSlugs } from "@/app/seo";

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        es: `${siteUrl}/es`,
        en: `${siteUrl}/en`,
      },
    },
  };
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const home = await getTranslations({ locale, namespace: "Home" });
  const seo = await getTranslations({ locale, namespace: "Seo" });
  const tUseCases = await getTranslations({
    locale,
    namespace: "UseCases.items",
  });

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: seo("siteName"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/${locale}`,
    description: seo("defaultDescription"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: [
      home("steps.url"),
      home("steps.mode"),
      home("steps.mp4"),
      seo("createDescription"),
    ],
  };

  const steps = [home("steps.url"), home("steps.mode"), home("steps.mp4")];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-6">
        <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-ink">
          {seo("siteName")}
        </Link>
        <nav
          aria-label={home("navigation.label")}
          className="flex items-center gap-4 text-sm font-black text-ink/64"
        >
          <Link href="/create" className="transition hover:text-ocean">
            {home("createCta")}
          </Link>
          <Link
            href="/video-to-mp3-converter"
            className="transition hover:text-ocean"
          >
            {home("navigation.videoToMp3")}
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1fr,420px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {home("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none text-ink sm:text-7xl">
            {home("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            {home("description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
            >
              <span>{home("createCta")}</span>
              <ArrowRight size={19} aria-hidden />
            </Link>
            <a
              href="#casos-de-uso"
              className="flex h-14 items-center justify-center rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
            >
              {home("useCasesCta")}
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
                {home("phone.top")}
              </div>
              <div className="space-y-3">
                <div className="h-48 rounded-3xl bg-[linear-gradient(135deg,#0b7285,#d7ff47)]" />
                <div className="h-3 w-5/6 rounded-full bg-ink" />
                <div className="h-3 w-2/3 rounded-full bg-ink/45" />
              </div>
              <div className="rounded-2xl bg-ink px-4 py-3 text-center text-sm font-black text-white">
                {home("phone.bottom")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <Feature
            icon={<FileVideo size={24} />}
            title={home("features.content.title")}
            text={home("features.content.text")}
          />
          <Feature
            icon={<Gauge size={24} />}
            title={home("features.speed.title")}
            text={home("features.speed.text")}
          />
          <Feature
            icon={<Shield size={24} />}
            title={home("features.social.title")}
            text={home("features.social.text")}
          />
        </div>
      </section>

      <ExampleVideos />

      <section id="casos-de-uso" className="mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            {home("useCases.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
            {home("useCases.title")}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {useCaseSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/use-cases/${slug}`}
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-ocean">
                {tUseCases(`${slug}.intent`)}
              </p>
              <h3 className="mt-4 text-2xl font-black text-ink">
                {tUseCases(`${slug}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink/65">
                {tUseCases(`${slug}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white/72 px-5 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black leading-tight text-ink">
            {home("contact.title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-ink/68">
            {home("contact.subtitle")}{" "}
            <a
              href="mailto:testappbelleza@gmail.com"
              className="font-black text-ocean underline decoration-ocean/30 underline-offset-4 transition hover:text-ink"
            >
              testappbelleza@gmail.com
            </a>
          </p>
          <nav
            aria-label="Legal"
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-ink/56"
          >
            <Link href="/privacy" className="transition hover:text-ocean">
              {home("footer.privacy")}
            </Link>
            <Link href="/terms" className="transition hover:text-ocean">
              {home("footer.terms")}
            </Link>
            <a
              href="mailto:testappbelleza@gmail.com"
              className="transition hover:text-ocean"
            >
              {home("footer.contact")}
            </a>
          </nav>
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
