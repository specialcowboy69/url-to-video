import type { Metadata } from "next";
import { siteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the private internal Google Ads API tool.",
  alternates: {
    canonical: `${siteUrl}/google-ads-api-tool/privacy-policy`,
  },
};

export default function GoogleAdsApiToolPrivacyPolicyPage() {
  return (
    <main>
      <section className="mx-auto min-h-screen w-full max-w-4xl px-5 py-12 sm:py-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            Google Ads API Internal Tool
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none text-ink sm:text-7xl">
            Privacy Policy
          </h1>
        </div>

        <div className="mt-12 space-y-4">
          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-base leading-7 text-ink/68">
              This tool is used internally to access Google Ads data through the
              Google Ads API.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The tool may access Google Ads account information, campaign
              performance data, keyword ideas, keyword metrics, search volume,
              competition data, and related advertising data from Google Ads
              accounts that the authenticated user is authorized to access.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The data is used only for internal keyword research, campaign
              planning, reporting, and advertising analysis.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              We do not sell Google user data. We do not share Google Ads API
              credentials, OAuth tokens, or developer tokens with third parties.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              Data retrieved from the Google Ads API may be stored temporarily
              or processed internally for reporting and analysis purposes.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              Users can request deletion of stored data by contacting:{" "}
              <a
                href="mailto:tu-support@urltovideo.es"
                className="font-bold text-ocean underline underline-offset-4"
              >
                tu-support@urltovideo.es
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
