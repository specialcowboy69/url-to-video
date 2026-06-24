"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onReset: () => void;
};

export function ErrorState({ message, onReset }: ErrorStateProps) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-coral text-white shadow-soft">
        <AlertTriangle size={34} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        No se pudo crear
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">
        Algo ha fallado.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/68">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
      >
        <RotateCcw size={18} aria-hidden />
        <span>Intentarlo de nuevo</span>
      </button>
    </section>
  );
}
