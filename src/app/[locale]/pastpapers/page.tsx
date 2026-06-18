import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { Link } from "@/i18n/navigation";
import { loadPastPaperYears } from "@/lib/data/pastpapers";

export default async function PastPapersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pastpapers");
  const years = await loadPastPaperYears();

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
      />

      <div className="kit-page-main">
        <div className="kit-container pb-16">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">{t("years")}</p>
              <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {t("chooseYear")}
              </h2>
            </div>
            <Link
              href="/pastpapers/schemes"
              className="rounded-full border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-500 transition hover:bg-amber-400/10"
            >
              {t("viewSchemes")}
            </Link>
          </div>

          {years.length === 0 ? (
            <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
              <p style={{ color: "var(--text-secondary)" }}>{t("empty")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {years.map((year) => (
                <Link
                  key={year}
                  href={`/pastpapers/${year}`}
                  className="overflow-hidden rounded-3xl border p-6 shadow-lg transition hover:-translate-y-0.5"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">{t("yearLabel")}</p>
                  <h3 className="mt-3 text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                    {year}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {t("openYear", { year })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
