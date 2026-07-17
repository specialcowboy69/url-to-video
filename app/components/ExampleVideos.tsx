"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play, X } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

const examples = [
  {
    id: "inflacion",
    poster: "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/inflacion%20baja.jpg",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/inflacion.mp4",
  },
  {
    id: "calorResidual",
    poster: "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/electricidad%20a%20traves%20del%20calor.jpg",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/calor%20residual.mp4",
  },
  {
    id: "adultez",
    poster: "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/adultez%20gen%20z.jpg",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/adultez.mp4",
  },
] as const;

type Example = (typeof examples)[number];

export function ExampleVideos() {
  const t = useTranslations("Home.examples");
  const [activeExample, setActiveExample] = useState<Example | null>(null);

  useEffect(() => {
    if (!activeExample) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveExample(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeExample]);

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setActiveExample(null);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-4xl font-black leading-tight text-ink">
          {t("title")}
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {examples.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => setActiveExample(example)}
            className="group overflow-hidden rounded-lg border border-ink/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-ocean/20"
            aria-label={t("open", { title: t(`items.${example.id}.title`) })}
          >
            <div className="relative aspect-[9/16] bg-ink/8">
              <Image
                src={example.poster}
                alt={t(`items.${example.id}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/24 transition group-hover:bg-ink/12">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-ink shadow-sm backdrop-blur">
                  <Play size={24} fill="currentColor" aria-hidden />
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean">
                {t("languageLabel")}: {t(`items.${example.id}.language`)}
              </p>
              <h3 className="mt-3 text-lg font-black leading-snug text-ink">
                {t(`items.${example.id}.title`)}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {activeExample ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4"
          onMouseDown={closeOnBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={t(`items.${activeExample.id}.title`)}
        >
          <button
            type="button"
            onClick={() => setActiveExample(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/25"
            aria-label={t("close")}
          >
            <X size={24} aria-hidden />
          </button>
          <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-lg bg-black shadow-soft">
            <video
              key={activeExample.videoUrl}
              src={activeExample.videoUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
