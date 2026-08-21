"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const audienceUseCases = [
  {
    key: "creators",
    href: "/article-to-video-ai",
    image: "/generated/use-cases-creators.png",
    bullets: ["source", "visuals", "captions", "export"],
  },
  {
    key: "professionals",
    href: "/create",
    image: "/generated/use-cases-professionals.png",
    bullets: ["pages", "formats", "audio", "share"],
  },
] as const;

type AudienceKey = (typeof audienceUseCases)[number]["key"];

export function AudienceUseCases() {
  const t = useTranslations("Home.useCases");
  const [activeAudience, setActiveAudience] = useState<AudienceKey>("creators");
  const activeItem = audienceUseCases.find(
    (item) => item.key === activeAudience,
  )!;

  return (
    <section id="casos-de-uso" className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-ocean">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-5xl font-extrabold leading-[1.04] text-ink sm:text-6xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-ink/64">
            {t("description")}
          </p>
        </div>

        <div className="mt-8 inline-flex rounded-[22px] border border-ink/10 bg-white/82 p-1 text-sm font-black text-ink/54 shadow-sm backdrop-blur">
          {audienceUseCases.map((item) => {
            const isActive = item.key === activeAudience;

            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveAudience(item.key)}
                className={`rounded-[18px] px-5 py-3 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean/30 ${
                  isActive
                    ? "bg-ink text-white shadow-sm"
                    : "text-ink/58 hover:bg-mist hover:text-ink"
                }`}
              >
                {t(`tabs.${item.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <article className="grid gap-10 lg:grid-cols-[0.92fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-ocean">
              {t(`${activeItem.key}.tag`)}
            </p>
            <h3 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-ink sm:text-5xl">
              {t(`${activeItem.key}.title`)}
            </h3>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/64">
              {t(`${activeItem.key}.description`)}
            </p>

            <ul className="mt-8 grid gap-3">
              {activeItem.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-2xl bg-white/76 px-4 py-3 text-base font-semibold leading-6 text-ink shadow-sm"
                >
                  <CheckCircle2
                    size={21}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-ocean"
                  />
                  <span>{t(`${activeItem.key}.bullets.${bullet}`)}</span>
                </li>
              ))}
            </ul>

            <Link
              href={activeItem.href}
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-7 py-3 text-center text-sm font-black text-ink shadow-[0_14px_36px_rgba(215,255,71,0.32)] transition hover:brightness-95"
            >
              <span>{t(`${activeItem.key}.cta`)}</span>
              <ArrowRight
                size={18}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-[34px] border border-ink/10 bg-white p-3 shadow-soft">
              <div className="relative aspect-[1.58/1] overflow-hidden rounded-[26px] bg-mist">
                <Image
                  src={activeItem.image}
                  alt={t(`${activeItem.key}.alt`)}
                  fill
                  sizes="(max-width: 1024px) calc(100vw - 40px), 570px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
