"use client";

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

const examples = [
  {
    id: "inflacion",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/inflacion.mp4",
  },
  {
    id: "calorResidual",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/calor%20residual.mp4",
  },
  {
    id: "adultez",
    videoUrl:
      "https://pub-5d88690ab45b4187800a2f33589c6c13.r2.dev/examples/adultez.mp4",
  },
] as const;

type Example = (typeof examples)[number];

export function ExampleVideos() {
  const t = useTranslations("Home.examples");
  const carouselRef = useRef<HTMLDivElement>(null);

  function scrollCarousel(direction: "previous" | "next") {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left:
        direction === "next"
          ? carousel.clientWidth * 0.82
          : -carousel.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-ocean">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.04] text-ink sm:text-6xl">
            {t("title")}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollCarousel("previous")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-white/84 text-ink shadow-sm backdrop-blur transition hover:bg-white hover:text-ocean focus:outline-none focus:ring-4 focus:ring-ocean/20"
            aria-label="Video anterior"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-sm transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-ocean/20"
            aria-label="Video siguiente"
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {examples.map((example) => (
          <ExampleVideoSlide
            key={example.id}
            example={example}
            label={t(`open`, { title: t(`items.${example.id}.title`) })}
          />
        ))}
      </div>
    </section>
  );
}

function ExampleVideoSlide({
  example,
  label,
}: {
  example: Example;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  async function playVideo() {
    try {
      await videoRef.current?.play();
    } catch {
      // Some browsers still block playback in edge cases. The user can tap.
    }
  }

  function pauseVideo() {
    videoRef.current?.pause();
  }

  function toggleVideo() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void playVideo();
      return;
    }

    pauseVideo();
  }

  function toggleAudio() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);

    if (!video.muted && video.paused) {
      void playVideo();
    }
  }

  return (
    <article
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
      className="group relative min-w-[82%] snap-start overflow-hidden rounded-[32px] bg-ink shadow-soft transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-ocean/20 sm:min-w-[48%] lg:min-w-[31.5%]"
    >
      <video
        ref={videoRef}
        src={example.videoUrl}
        className="aspect-[9/16] w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggleVideo}
        onFocus={playVideo}
        onBlur={pauseVideo}
        className="absolute inset-0 focus:outline-none focus:ring-4 focus:ring-ocean/20"
        aria-label={label}
      />
      <button
        type="button"
        onClick={toggleAudio}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-ink opacity-0 shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-citrus/45 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
      >
        {isMuted ? (
          <VolumeX size={20} aria-hidden />
        ) : (
          <Volume2 size={20} aria-hidden />
        )}
      </button>
    </article>
  );
}
