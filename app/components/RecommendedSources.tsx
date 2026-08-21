"use client";

import { ChevronDown, ExternalLink, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { recommendedSources } from "@/app/data/recommendedSources";

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function RecommendedSources() {
  const t = useTranslations("Create.recommendedSources");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(recommendedSources[0].id);

  const activeCategory = useMemo(
    () => recommendedSources.find((category) => category.id === activeCategoryId) ?? recommendedSources[0],
    [activeCategoryId]
  );

  return (
    <section className="mt-6 rounded-[24px] border border-white/60 bg-white/78 p-4 shadow-sm backdrop-blur sm:p-5">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ocean/10 text-ocean">
            <Search size={19} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-black text-ink">{t("title")}</span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-ink/58">
              {t("description")}
            </span>
          </span>
        </span>
        <ChevronDown
          size={22}
          className={`shrink-0 text-ink/58 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div className="mt-5 border-t border-ink/10 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recommendedSources.map((category) => {
              const isActive = category.id === activeCategory.id;
              const label = locale === "en" ? category.labelEn : category.label;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                    isActive
                      ? "border-ocean bg-ocean text-white"
                      : "border-white/70 bg-white/82 text-ink/68 hover:border-ocean/40 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm font-semibold leading-6 text-ink/58">
            {t("hint")}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategory.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-ocean/45 hover:shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-ink">
                    {source.name}
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold text-ink/50">
                    {getHost(source.url)}
                  </span>
                </span>
                <ExternalLink
                  size={18}
                  className="shrink-0 text-ocean transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
