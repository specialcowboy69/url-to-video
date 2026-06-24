import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

type LegalPageProps = {
  locale: string;
  namespace: "privacy" | "terms";
  sectionKeys: string[];
};

export async function LegalPage({
  locale,
  namespace,
  sectionKeys,
}: LegalPageProps) {
  const legal = await getTranslations({ locale, namespace: "Legal" });
  const page = await getTranslations({
    locale,
    namespace: `Legal.${namespace}`,
  });

  return (
    <main>
      <section className="mx-auto min-h-screen w-full max-w-4xl px-5 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.2em] text-ocean"
        >
          {legal("backHome")}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ocean">
            URL to Video
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none text-ink sm:text-7xl">
            {page("title")}
          </h1>
          <p className="mt-5 text-sm font-semibold text-ink/52">
            {legal("lastUpdated")}
          </p>
          <p className="mt-8 text-lg leading-8 text-ink/70">{page("intro")}</p>
        </div>

        <div className="mt-12 space-y-4">
          {sectionKeys.map((sectionKey) => (
            <section
              key={sectionKey}
              className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black text-ink">
                {page(`sections.${sectionKey}.title`)}
              </h2>
              <p className="mt-3 text-base leading-7 text-ink/68">
                {page(`sections.${sectionKey}.body`)}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
