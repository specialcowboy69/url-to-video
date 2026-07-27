import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteUrl } from "@/app/seo";
import type { SharedVideoLookupResponse } from "@/app/types";

type SharedVideoPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function lookupSharedVideo(slug: string) {
  const webhookUrl =
    process.env.N8N_SHARE_VIDEO_LOOKUP_WEBHOOK_URL ||
    "https://n8n.urltovideo.es/webhook/share-video-lookup";

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SharedVideoLookupResponse;
}

export async function generateMetadata({
  params,
}: SharedVideoPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: "Video compartido",
    description: "Video temporal compartido con URL to Video.",
    alternates: {
      canonical: `${siteUrl}/v/${slug}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SharedVideoPage({ params }: SharedVideoPageProps) {
  const { slug } = await params;
  const payload = await lookupSharedVideo(slug);

  if (!payload || payload.status === "not_found") {
    notFound();
  }

  if (payload.status !== "active" || !payload.videoUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-mist px-5 py-10">
        <section className="w-full max-w-2xl rounded-[32px] border border-ink/10 bg-white p-8 text-center shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            URL to Video
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">
            Este enlace ha expirado.
          </h1>
          <p className="mt-5 text-base leading-7 text-ink/64">
            Los videos compartidos estan disponibles durante 24 horas. Pasado
            ese tiempo, el archivo se elimina automaticamente.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-5xl flex-col justify-center">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.2em] text-white"
          >
            URL to Video
          </Link>
          <p className="text-sm font-bold text-white/58">
            Disponible hasta{" "}
            {payload.expiresAt ? new Date(payload.expiresAt).toLocaleString() : ""}
          </p>
        </div>
        <div className="overflow-hidden rounded-[28px] bg-black shadow-soft">
          <video
            controls
            playsInline
            preload="metadata"
            src={payload.videoUrl}
            className="aspect-video w-full bg-black"
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-white/62">
          <span className="break-all">{payload.originalName || slug}</span>
          <span>El enlace caduca automaticamente en 24 horas.</span>
        </div>
      </section>
    </main>
  );
}
