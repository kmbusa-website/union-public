import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function ExamsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageIntroHero
        overline="Exams"
        title="Exams"
        titleHighlight="Section"
        lead="Past papers, future exam resources, and subject files."
      />

      <div className="kit-page-main">
        <div className="kit-container pb-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <Link
              href="/exams/pastpapers"
              className="group overflow-hidden rounded-3xl border p-6 shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Past Papers</p>
              <h2 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Year-wise Papers
              </h2>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-400 transition group-hover:bg-cyan-400/10">
                Open Past Papers
              </div>
            </Link>

            <Link
              href="/exams/schemes"
              className="group overflow-hidden rounded-3xl border p-6 shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">Schemes</p>
              <h2 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Year-wise Schemes
              </h2>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-500 transition group-hover:bg-amber-400/10">
                Open Schemes
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
