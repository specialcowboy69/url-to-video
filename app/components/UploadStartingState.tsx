"use client";

import { Loader2 } from "lucide-react";

type UploadStartingStateProps = {
  embedded?: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function UploadStartingState({
  embedded = false,
  eyebrow,
  title,
  subtitle,
}: UploadStartingStateProps) {
  const Heading = embedded ? "h2" : "h1";

  return (
    <section
      className={embedded
        ? "mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-6 text-center"
        : "mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center"}
    >
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-white shadow-soft">
        <Loader2 className="animate-spin" size={40} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        {eyebrow}
      </p>
      <Heading className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
        {title}
      </Heading>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/62">
        {subtitle}
      </p>
    </section>
  );
}
