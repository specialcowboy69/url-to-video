"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";

type ResultViewProps = {
  videoUrl: string;
  downloadUrl?: string;
  onReset: () => void;
};

export function ResultView({ videoUrl, downloadUrl, onReset }: ResultViewProps) {
  const finalDownloadUrl = downloadUrl ?? videoUrl;

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-citrus text-ink shadow-soft">
        <CheckCircle2 size={44} aria-hidden />
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
        Video listo
      </p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">
        Tu MP4 esta preparado.
      </h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-ink/68">
        El render ha terminado correctamente. Puedes descargar el archivo o
        iniciar una nueva generacion. Es posible que el video no tenga sonido si
        lo reproduces desde el navegador pero al descargarlo seguro que lo tiene.
      </p>
      <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={finalDownloadUrl}
          download
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-citrus px-6 text-sm font-black text-ink transition hover:brightness-95"
        >
          <Download size={19} aria-hidden />
          <span>Descargar MP4</span>
        </a>
        <button
          type="button"
          onClick={onReset}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-ink/14 bg-white px-6 text-sm font-black text-ink transition hover:bg-mist"
        >
          <RotateCcw size={18} aria-hidden />
          <span>Crear otro video</span>
        </button>
      </div>
    </section>
  );
}
