"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeroDemoVideoProps = {
  src: string;
};

export function HeroDemoVideo({ src }: HeroDemoVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;

        if (entry.isIntersecting) {
          setShouldLoad(true);
          video?.play().catch(() => setIsPlaying(false));
          return;
        }

        video?.pause();
      },
      {
        rootMargin: "220px 0px",
        threshold: 0.18,
      }
    );

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  return (
    <div
      ref={wrapperRef}
      className="group relative overflow-hidden rounded-[28px] bg-black"
    >
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        className="aspect-video w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        onClick={togglePlayback}
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-ink opacity-0 shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-citrus/45 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" aria-hidden />
        ) : (
          <Play className="ml-0.5" size={24} fill="currentColor" aria-hidden />
        )}
      </button>
    </div>
  );
}
