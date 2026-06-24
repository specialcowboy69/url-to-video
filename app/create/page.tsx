import type { Metadata } from "next";
import { CreateVideoExperience } from "@/app/components/CreateVideoExperience";
import { siteName, siteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: `Crear video desde URL | ${siteName}`,
  description:
    "Pega una URL, elige imagenes o videos y genera un MP4 vertical con voz, subtitulos y material visual.",
  alternates: {
    canonical: `${siteUrl}/create`,
  },
};

export default function CreatePage() {
  return (
    <main>
      <CreateVideoExperience />
    </main>
  );
}
