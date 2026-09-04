import type { Metadata } from "next";
import { siteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "Google Ads API Internal Tool",
  description:
    "Private internal tool used to support keyword research, Google Ads campaign analysis, and advertising reporting.",
  alternates: {
    canonical: `${siteUrl}/google-ads-api-tool`,
  },
};

export default function GoogleAdsApiToolPage() {
  return (
    <main>
      <section className="mx-auto min-h-screen w-full max-w-4xl px-5 py-12 sm:py-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            URL to Video
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none text-ink sm:text-7xl">
            Google Ads API Internal Tool
          </h1>
        </div>

        <div className="mt-12 space-y-4">
          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <p className="text-base leading-7 text-ink/68">
              This is a private internal tool used to support keyword research,
              Google Ads campaign analysis, and advertising reporting.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The tool uses the Google Ads API to retrieve keyword ideas,
              historical keyword metrics, search volume, competition data,
              estimated bid ranges, and campaign performance data from Google
              Ads accounts that the authenticated user is authorized to access.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/68">
              The tool is not a public SaaS product and is not available to
              external users.
            </p>
          </section>

          <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-ink">Policies</h2>
            <dl className="mt-4 space-y-4 text-base leading-7 text-ink/68">
              <div>
                <dt className="font-black text-ink">Privacy Policy</dt>
                <dd>
                  <a
                    href="http://urltovideo.es/en/privacy"
                    className="font-bold text-ocean underline underline-offset-4"
                  >
                    http://urltovideo.es/en/privacy
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-black text-ink">Terms of Service</dt>
                <dd>
                  <a
                    href="https://urltovideo.es/en/terms"
                    className="font-bold text-ocean underline underline-offset-4"
                  >
                    https://urltovideo.es/en/terms
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}
