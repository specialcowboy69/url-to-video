"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeroDemoVideoProps = {
  src: string;
  ariaLabelledBy?: string;
};

export function HeroDemoVideo({ src, ariaLabelledBy }: HeroDemoVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealOnlyTapRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchControlsVisible, setTouchControlsVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        setIsNearViewport(entry.isIntersecting);

        if (entry.isIntersecting) {
          setShouldLoad(true);
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

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldLoad || !isNearViewport) {
      video?.pause();
      return;
    }

    let cancelled = false;

    // The source is assigned before this effect attempts playback.
    void video.play().catch(() => {
      if (!cancelled) {
        setIsPlaying(!video.paused);
      }
    });

    return () => {
      cancelled = true;
      video.pause();
    };
  }, [shouldLoad, isNearViewport, src]);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video || !shouldLoad || !isNearViewport) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(!video.paused);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  return (
    <div
      ref={wrapperRef}
      className="group relative overflow-hidden rounded-[28px] bg-black"
      onPointerDownCapture={(event) => {
        revealOnlyTapRef.current =
          event.pointerType === "touch" && !touchControlsVisible;

        if (event.pointerType === "touch") {
          setTouchControlsVisible(true);
        }
      }}
      onPointerCancel={() => {
        revealOnlyTapRef.current = false;
      }}
      onClickCapture={(event) => {
        if (revealOnlyTapRef.current) {
          // A hidden center button must only reveal on the first touch.
          revealOnlyTapRef.current = false;
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        className="aspect-video w-full object-cover"
        aria-labelledby={ariaLabelledBy}
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
        className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-ink shadow-soft backdrop-blur transition hover:scale-105 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-4 focus:ring-citrus/45 group-hover:opacity-100 group-focus-within:opacity-100 ${touchControlsVisible ? "opacity-100" : "opacity-0"}`}
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
