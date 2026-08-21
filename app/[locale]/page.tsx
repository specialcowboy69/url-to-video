import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  FileVideo,
  FileText,
  Gauge,
  Link2,
  Music2,
  Play,
  Shield,
  Share2,
  Sparkles,
  Subtitles,
  Type,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { AudienceUseCases } from "@/app/components/AudienceUseCases";
import { ExampleVideos } from "@/app/components/ExampleVideos";
import { HeroDemoVideo } from "@/app/components/HeroDemoVideo";
import { localeAlternates, pageSocialMetadata, siteUrl } from "@/app/seo";

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
  const title = t("defaultTitle");
  const description = t("defaultDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: localeAlternates(),
    },
    ...pageSocialMetadata({ locale, title, description }),
  };
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const home = await getTranslations({ locale, namespace: "Home" });
  const seo = await getTranslations({ locale, namespace: "Seo" });
  const suite = await getTranslations({
    locale,
    namespace: "CreateSeo.suite",
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
  const platformTools = [
    {
      key: "articleAi",
      href: "/article-to-video-ai",
      icon: <WandSparkles size={22} />,
      variant: "dark",
      visual: "article",
      className: "lg:col-span-2 lg:row-span-2",
    },
    {
      key: "textAi",
      href: "/text-to-video-ai",
      icon: <Type size={22} />,
      variant: "light",
      visual: "script",
      className: "lg:col-span-2",
    },
    {
      key: "mp3",
      href: "/video-to-mp3-converter",
      icon: <Music2 size={22} />,
      variant: "ocean",
      visual: "audio",
      className: "lg:col-span-1",
    },
    {
      key: "subtitles",
      href: "/audio-to-subtitles",
      icon: <Subtitles size={22} />,
      variant: "light",
      visual: "subtitles",
      className: "lg:col-span-1",
    },
    {
      key: "urlVideo",
      href: "/create",
      icon: <Link2 size={22} />,
      variant: "citrus",
      visual: "create",
      className: "lg:col-span-2",
    },
    {
      key: "share",
      href: "/share-video",
      icon: <Share2 size={22} />,
      variant: "light",
      visual: "share",
      className: "lg:col-span-2",
    },
  ] as const;
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section className="relative isolate overflow-hidden px-5 pb-14 pt-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_16%_20%,rgba(215,255,71,0.34),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(11,114,133,0.18),transparent_30%)]" />
        <div className="mx-auto flex min-h-[calc(82dvh-92px)] w-full max-w-5xl flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white/86 px-4 py-2 text-sm font-black text-ocean shadow-sm backdrop-blur">
            <Sparkles size={16} aria-hidden />
            <span>{home("eyebrow")}</span>
          </div>
          <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.02] text-ink sm:text-7xl">
            {home("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
            {home("description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/create"
              className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 py-3 text-center text-sm font-black text-ink shadow-[0_14px_36px_rgba(215,255,71,0.35)] transition hover:brightness-95"
            >
              <span>{home("stockCta")}</span>
              <ArrowRight
                size={19}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/article-to-video-ai"
              className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3 text-center text-sm font-black text-white shadow-[0_14px_36px_rgba(20,20,20,0.18)] transition hover:bg-ocean"
            >
              <span>{home("aiCta")}</span>
              <Sparkles
                size={18}
                aria-hidden
                className="transition-transform group-hover:scale-110"
              />
            </Link>
            <a
              href="#casos-de-uso"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-ink/10 bg-white/84 px-6 py-3 text-center text-sm font-black text-ink shadow-sm backdrop-blur transition hover:bg-white"
            >
              {home("useCasesCta")}
            </a>
          </div>

          <ol className="mt-10 grid gap-0 overflow-hidden rounded-[28px] border border-ink/10 bg-white/78 shadow-sm backdrop-blur sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="relative flex min-h-24 items-center gap-3 border-b border-ink/10 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-bold leading-5 text-ink">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[36px] bg-ink p-3 shadow-soft">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(215,255,71,0.24),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(11,114,133,0.32),transparent_32%)]" />
            <div className="relative">
              <HeroDemoVideo
                src="https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/article_to_video_ai_video.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      <ExampleVideos />

      <section className="border-y border-ink/10 bg-white/64 px-5 py-20 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-ink p-7 text-white shadow-soft">
            <div className="absolute inset-0 opacity-36">
              <Image
                src="https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/blog_to_video_image.jpeg"
                alt=""
                fill
                sizes="(max-width: 1024px) calc(100vw - 40px), 690px"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.94),rgba(20,20,20,0.64)_54%,rgba(20,20,20,0.12))]" />
            <div className="relative flex h-full max-w-md flex-col justify-between">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-citrus text-ink">
                  <FileVideo size={24} aria-hidden />
                </div>
                <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                  {home("features.content.title")}
                </h2>
                <p className="mt-5 text-base leading-7 text-white/74">
                  {home("features.content.text")}
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            <Feature
              icon={<Gauge size={24} />}
              title={home("features.speed.title")}
              text={home("features.speed.text")}
              variant="timeline"
            />
            <Feature
              icon={<Shield size={24} />}
              title={home("features.social.title")}
              text={home("features.social.text")}
              variant="caption"
            />
          </div>
        </div>
      </section>

      <section id="herramientas" className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-ocean">
                {suite("eyebrow")}
              </p>
              <h2 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.04] text-ink sm:text-6xl">
                {suite("title")}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-ink/64 lg:justify-self-end">
              {suite("description")}
            </p>
          </div>

          <div className="mt-12 grid auto-rows-[minmax(230px,auto)] gap-4 lg:grid-cols-4 lg:auto-rows-[255px]">
            {platformTools.map((tool) => (
              <ToolBentoCard
                key={tool.key}
                href={tool.href}
                icon={tool.icon}
                title={suite(`items.${tool.key}.title`)}
                text={suite(`items.${tool.key}.text`)}
                cta={suite(`items.${tool.key}.cta`)}
                variant={tool.variant}
                visual={tool.visual}
                className={tool.className}
              />
            ))}
          </div>
        </div>
      </section>

      <AudienceUseCases />

      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[32px] bg-ink p-8 text-white shadow-soft md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <h2 className="max-w-2xl text-4xl font-extrabold leading-tight">
              {home("contact.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/68">
              {home("contact.subtitle")}{" "}
              <a
                href="mailto:support@urltovideo.es"
                className="font-black text-citrus underline decoration-citrus/40 underline-offset-4 transition hover:text-white"
              >
                support@urltovideo.es
              </a>
            </p>
          </div>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/58 md:justify-end"
          >
            <Link href="/privacy" className="transition hover:text-citrus">
              {home("footer.privacy")}
            </Link>
            <Link href="/terms" className="transition hover:text-citrus">
              {home("footer.terms")}
            </Link>
            <a
              href="mailto:support@urltovideo.es"
              className="transition hover:text-citrus"
            >
              {home("footer.contact")}
            </a>
          </nav>
        </div>
      </section>

    </main>
  );
}

function ToolBentoCard({
  href,
  icon,
  title,
  text,
  cta,
  variant,
  visual,
  className = "",
}: {
  href:
    | "/article-to-video-ai"
    | "/text-to-video-ai"
    | "/video-to-mp3-converter"
    | "/audio-to-subtitles"
    | "/create"
    | "/share-video";
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  variant: "dark" | "light" | "ocean" | "citrus";
  visual: "article" | "script" | "audio" | "subtitles" | "create" | "share";
  className?: string;
}) {
  const variants = {
    dark: {
      shell:
        "bg-ink text-white shadow-[0_28px_80px_rgba(20,20,20,0.22)]",
      icon: "bg-citrus text-ink",
      text: "text-white/68",
      cta: "text-citrus",
    },
    light: {
      shell: "border border-ink/10 bg-white text-ink shadow-soft",
      icon: "bg-mist text-ocean",
      text: "text-ink/64",
      cta: "text-ocean",
    },
    ocean: {
      shell: "bg-ocean text-white shadow-[0_28px_80px_rgba(11,114,133,0.24)]",
      icon: "bg-white/16 text-citrus",
      text: "text-white/72",
      cta: "text-citrus",
    },
    citrus: {
      shell: "bg-citrus text-ink shadow-[0_28px_80px_rgba(215,255,71,0.28)]",
      icon: "bg-ink text-citrus",
      text: "text-ink/66",
      cta: "text-ink",
    },
  }[variant];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[32px] p-6 transition duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean/30 ${variants.shell} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-10 -top-20 h-44 rounded-full bg-white/18 blur-3xl" />
      </div>
      <div className="relative z-10 flex h-full flex-col">
        <div>
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${variants.icon}`}
            aria-hidden
          >
            {icon}
          </div>
          <h3 className="max-w-xl text-2xl font-black leading-tight sm:text-3xl">
            {title}
          </h3>
          <p className={`mt-3 max-w-xl text-sm leading-6 ${variants.text}`}>
            {text}
          </p>
        </div>

        <div className="mt-auto pt-7">
          <ToolBentoVisual visual={visual} variant={variant} />
          <span
            className={`mt-5 inline-flex items-center gap-2 text-sm font-black ${variants.cta}`}
          >
            {cta}
            <ArrowRight
              size={17}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ToolBentoVisual({
  visual,
  variant,
}: {
  visual: "article" | "script" | "audio" | "subtitles" | "create" | "share";
  variant: "dark" | "light" | "ocean" | "citrus";
}) {
  if (visual === "article") {
    return (
      <div className="relative h-56 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,255,71,0.18),transparent_30%),radial-gradient(circle_at_82%_62%,rgba(11,114,133,0.36),transparent_34%)]" />
        <div className="relative grid h-full grid-cols-[0.9fr_1fr] gap-4">
          <div className="rounded-[22px] bg-white/90 p-4 text-ink shadow-lg">
            <FileText size={22} aria-hidden />
            <div className="mt-5 space-y-2">
              <span className="block h-2 rounded-full bg-ink/70" />
              <span className="block h-2 w-5/6 rounded-full bg-ink/20" />
              <span className="block h-2 w-3/4 rounded-full bg-ink/20" />
              <span className="block h-2 w-4/5 rounded-full bg-citrus" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[22px] bg-ink shadow-lg">
            <div className="absolute inset-3 rounded-[18px] bg-[linear-gradient(150deg,#d7ff47,#0b7285_56%,#141414)] opacity-86" />
            <div className="absolute inset-x-7 bottom-6 h-9 rounded-xl bg-black/58 px-3 py-2">
              <span className="block h-2 rounded-full bg-white" />
              <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-citrus" />
            </div>
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-ink">
              <Play size={18} fill="currentColor" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "script") {
    return (
      <div className="relative h-28 overflow-hidden rounded-[24px] bg-mist p-3">
        <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
          <div className="rounded-[18px] bg-white p-3 shadow-sm">
            <span className="block h-2 w-24 rounded-full bg-ocean" />
            <div className="mt-4 space-y-2">
              <span className="block h-2 rounded-full bg-ink/18" />
              <span className="block h-2 w-5/6 rounded-full bg-ink/18" />
              <span className="block h-2 w-2/3 rounded-full bg-citrus" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["bg-ocean", "bg-ink", "bg-citrus"].map((color) => (
              <span key={color} className={`rounded-[16px] ${color}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (visual === "audio") {
    return (
      <div className="flex h-28 items-center justify-center rounded-[24px] bg-white/12 px-5">
        <div className="flex h-16 items-center gap-2">
          {[24, 42, 58, 34, 50, 66, 30, 46, 60, 38].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-2 rounded-full bg-citrus"
              style={{ height }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (visual === "subtitles") {
    return (
      <div className="relative h-28 overflow-hidden rounded-[24px] bg-ink p-3">
        <div className="absolute inset-3 rounded-[18px] bg-[linear-gradient(135deg,rgba(11,114,133,0.82),rgba(20,20,20,0.88))]" />
        <div className="relative flex h-full items-end justify-center pb-3">
          <div className="w-4/5 rounded-xl bg-white px-3 py-2 shadow-lg">
            <span className="block h-2 rounded-full bg-ink" />
            <span className="mt-2 block h-2 w-2/3 rounded-full bg-citrus" />
          </div>
        </div>
      </div>
    );
  }

  if (visual === "create") {
    return (
      <div className="relative h-28 overflow-hidden rounded-[24px] bg-ink p-3 text-white">
        <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-black">
          <span className="h-3 w-3 rounded-full bg-citrus" />
          URL
          <ArrowRight size={13} aria-hidden />
          MP4
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <span className="col-span-2 h-9 rounded-2xl bg-white/18" />
          <span className="h-9 rounded-2xl bg-ocean" />
          <span className="h-9 rounded-2xl bg-citrus" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-28 overflow-hidden rounded-[24px] p-4 ${
        variant === "light" ? "bg-mist" : "bg-white/12"
      }`}
    >
      <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-citrus text-ink">
        <UploadCloud size={20} aria-hidden />
      </div>
      <div className="space-y-3 pr-16">
        <span className="block h-3 rounded-full bg-ocean" />
        <span className="block h-3 w-4/5 rounded-full bg-ink/22" />
        <span className="block h-3 w-2/3 rounded-full bg-citrus" />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
  variant = "timeline",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  variant?: "timeline" | "caption";
}) {
  return (
    <div className="group relative min-h-[198px] overflow-hidden rounded-[28px] border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-ocean transition group-hover:bg-ocean group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-black text-ink transition group-hover:text-ocean">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-ink/64">{text}</p>
      {variant === "timeline" ? (
        <div className="mt-6 grid grid-cols-3 gap-2">
          <span className="h-2 rounded-full bg-ocean" />
          <span className="h-2 rounded-full bg-citrus" />
          <span className="h-2 rounded-full bg-ink/20" />
        </div>
      ) : null}
    </div>
  );
}
