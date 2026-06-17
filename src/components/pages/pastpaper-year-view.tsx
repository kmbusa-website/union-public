"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { PastPaper } from "@/lib/types/pastpaper";

type PastPaperFilter = "all" | "mathematics" | "biology" | "physics" | "chemistry";

const FILTER_LABELS: Record<PastPaperFilter, string> = {
  all: "All",
  mathematics: "Mathematics",
  biology: "Biology",
  physics: "Physics",
  chemistry: "Chemistry",
};

function paperBadgeColor(paperType: string) {
  if (paperType === "Pure" || paperType === "Applied" || paperType === "Applied Scheme") return "text-cyan-400";
  if (paperType === "Structure" || paperType === "Essay") return "text-amber-400";
  if (paperType === "MCQ") return "text-emerald-400";
  return "text-violet-400";
}

function matchesFilter(paper: PastPaper, filter: PastPaperFilter) {
  if (filter === "all") return true;
  const subject = paper.subject.toLowerCase();
  switch (filter) {
    case "mathematics":
      return subject.includes("combined mathematics");
    case "biology":
      return subject.includes("biology");
    case "physics":
      return subject.includes("physics");
    case "chemistry":
      return subject.includes("chemistry");
  }
}

export function PastPaperYearView({ year, papers }: { year: number; papers: PastPaper[] }) {
  const [filter, setFilter] = useState<PastPaperFilter>("all");

  const filtered = useMemo(() => papers.filter((paper) => matchesFilter(paper, filter)), [papers, filter]);

  return (
    <div className="kit-container pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Year</p>
          <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {year} Papers
          </h2>
        </div>
        <Link
          href="/exams/pastpapers"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
          style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
        >
          Back to years
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as PastPaperFilter[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={
              filter === key
                ? { backgroundColor: "#06b6d4", color: "#0a192f" }
                : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }
            }
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>No papers found for this subject.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((paper) => (
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
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
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
