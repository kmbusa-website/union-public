"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PastPaper } from "@/lib/types/pastpaper";

type PastPaperFilter = "all" | "mathematics" | "biology" | "physics" | "chemistry";

function paperBadgeColor(paperType: string) {
  if (paperType === "Pure" || paperType === "Applied" || paperType === "Applied Scheme") return "text-[var(--blue)]";
  if (paperType === "Structure" || paperType === "Essay") return "text-[var(--blue)]";
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
  const t = useTranslations("pastpapers");
  const [filter, setFilter] = useState<PastPaperFilter>("all");

  const filtered = useMemo(() => papers.filter((paper) => matchesFilter(paper, filter)), [papers, filter]);
  const filterKeys: PastPaperFilter[] = ["all", "mathematics", "biology", "physics", "chemistry"];

  return (
    <div className="kit-container pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--blue)]">{t("yearLabel")}</p>
          <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {t("papersHeading", { year })}
          </h2>
        </div>
        <Link
          href="/pastpapers"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-[var(--blue)] hover:text-[var(--blue)]"
          style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
        >
          {t("backToYears")}
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filterKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={
              filter === key
                ? { backgroundColor: "var(--blue)", color: "#ffffff" }
                : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }
            }
          >
            {t(`filters.${key}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)" }}>{t("noSubjectPapers")}</p>
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
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--blue)]/40 px-4 py-2 text-sm font-semibold text-[var(--blue)] transition hover:bg-[var(--blue)]/10"
                >
                  {t("openPdf")}
                </a>
              ) : (
                <span className="mt-4 inline-flex items-center justify-center rounded-full border border-dashed border-[var(--border-color)] px-4 py-2 text-sm font-semibold" style={{ color: "var(--text-subtle)" }}>
                  {t("addLinkCsv")}
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
