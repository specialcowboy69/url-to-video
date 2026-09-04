import type { Metadata } from "next";
import { siteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for the private internal Google Ads API tool.",
  alternates: {
    canonical: `${siteUrl}/google-ads-api-tool/terms-of-service`,
  },
};

export default function GoogleAdsApiToolTermsOfServicePage() {
  return (
    <main>
      <section className="mx-auto min-h-screen w-full max-w-4xl px-5 py-12 sm:py-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            Google Ads API Internal Tool
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none text-ink sm:text-7xl">
            Terms of Service
          </h1>
        </div>

        <div className="mt-12 space-y-4">
          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-base leading-7 text-ink/68">
              This Google Ads API tool is a private internal tool used for
              keyword research, campaign analysis, and advertising reporting.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The tool is not offered as a public service, SaaS product, or
              third-party platform.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              Only authorized users may use the tool. Users are responsible for
              ensuring that they have permission to access the Google Ads
              accounts connected to the tool.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The tool is provided as-is for internal business and marketing
              analysis purposes.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
