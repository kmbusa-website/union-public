"use client";

import { Link } from "@/i18n/navigation";
import type { PastPaper } from "@/lib/types/pastpaper";

function paperBadgeColor(paperType: string) {
  if (paperType === "Scheme" || paperType === "Applied Scheme") return "text-[var(--blue)]";
  return "text-violet-400";
}

export function SchemeYearView({ year, papers }: { year: number; papers: PastPaper[] }) {
  return (
    <div className="kit-container pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--blue)]">Year</p>
          <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {year} Schemes
          </h2>
        </div>
        <Link
          href="/exams/schemes"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-[var(--blue)] hover:text-[var(--blue)]"
          style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
        >
          Back to years
        </Link>
      </div>

      {papers.length === 0 ? (
        <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No scheme papers found for this year.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <article
              key={`${paper.year}-${paper.sourceName}`}
              className="overflow-hidden rounded-3xl border p-5 shadow-lg"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${paperBadgeColor(paper.paperType)}`}>
                    {paper.paperType}
                  </p>
                  <h3 className="mt-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {paper.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {paper.subject}
                  </p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                  {paper.year}
                </span>
              </div>

              {paper.url ? (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--blue)]/40 px-4 py-2 text-sm font-semibold text-[var(--blue)] transition hover:bg-[var(--blue)]/10"
                >
                  Open PDF
                </a>
              ) : (
                <span className="mt-4 inline-flex items-center justify-center rounded-full border border-dashed border-[var(--border-color)] px-4 py-2 text-sm font-semibold" style={{ color: "var(--text-subtle)" }}>
                  Add link in CSV
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
