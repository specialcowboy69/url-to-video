"use client";

import { Loader2 } from "lucide-react";

type UploadStartingStateProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function UploadStartingState({
  eyebrow,
  title,
  subtitle,
}: UploadStartingStateProps) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-white shadow-soft">
        <Loader2 className="animate-spin" size={40} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/62">
        {subtitle}
      </p>
    </section>
  );
}
