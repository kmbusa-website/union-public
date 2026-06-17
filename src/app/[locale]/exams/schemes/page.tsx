import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { Link } from "@/i18n/navigation";
import { loadSchemeYears } from "@/lib/data/schemes";
import { setRequestLocale } from "next-intl/server";

export default async function SchemesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const years = await loadSchemeYears();

  return (
    <>
      <PageIntroHero
        overline="Exams"
        title="Schemes"
        titleHighlight="Section"
        lead="Year-wise schemes for each subject."
      />

      <div className="kit-page-main">
        <div className="kit-container pb-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">Schemes</p>
              <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Choose a year
              </h2>
            </div>
          </div>

          {years.length === 0 ? (
            <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
              <p style={{ color: "var(--text-secondary)" }}>No scheme data available yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {years.map((year) => (
                <Link
                  key={year}
                  href={`/exams/schemes/${year}`}
                  className="overflow-hidden rounded-3xl border p-6 shadow-lg transition hover:-translate-y-0.5"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">Year</p>
                  <h3 className="mt-3 text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                    {year}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    Open scheme papers for {year}.
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
