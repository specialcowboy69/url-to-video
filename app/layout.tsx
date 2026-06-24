import type { Metadata } from "next";
import { defaultDescription, siteName, siteUrl } from "@/app/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Convertir URL en video con IA | URL to Video",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "convertir URL en video",
    "URL to video AI",
    "convertir articulo en video",
    "video vertical con IA",
    "repurposing de contenido",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Convertir URL en video con IA",
    description: defaultDescription,
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertir URL en video con IA",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
