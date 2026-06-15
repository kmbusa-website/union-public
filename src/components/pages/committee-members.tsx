"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CommitteeCard } from "@/components/shared/committee-card";
import type { CommitteeMember, CommitteeTier } from "@/lib/types/committee";

const CSV_URL = "/committee/committee.csv";
const DEFAULT_YEAR = 2026;

function byTier(members: CommitteeMember[], tier: CommitteeTier) {
  return members.filter((m) => m.tier === tier);
}

function isCommitteeTier(value: string): value is CommitteeTier {
  return value === "executive" || value === "roles" || value === "mentors" || value === "members";
}

function parseCsv(text: string): CommitteeMember[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return [];

  const headers = headerRow.map((value) => value.trim());

  return dataRows
    .map((values) => {
      const entry = Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? "").trim()]));
      const tierValue = String(entry.tier ?? "");
      if (!isCommitteeTier(tierValue)) return null;

      return {
        id: String(entry.id ?? ""),
        name: String(entry.name ?? ""),
        role: String(entry.role ?? ""),
        tier: tierValue,
        faculty: String(entry.faculty ?? ""),
        university: String(entry.university ?? ""),
        photoUrl: String(entry.photoUrl ?? ""),
        accent: String(entry.accent ?? "#22d3ee"),
        year: Number(entry.year ?? DEFAULT_YEAR),
      } satisfies CommitteeMember;
    })
    .filter((member): member is CommitteeMember => Boolean(member?.id && member.name && member.year));
}

export function CommitteeMembers() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const response = await fetch(CSV_URL, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load committee.csv (${response.status})`);
        }

        const text = await response.text();
        const parsed = parseCsv(text);
        setMembers(parsed);
        setError(null);

        const years = Array.from(new Set(parsed.map((member) => member.year))).sort((a, b) => b - a);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (cause) {
        if ((cause as Error).name === "AbortError") return;
        setMembers([]);
        setError(cause instanceof Error ? cause.message : "Failed to load committee data");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const years = useMemo(() => Array.from(new Set(members.map((member) => member.year))).sort((a, b) => b - a), [members]);
  const activeYear = years.includes(selectedYear) ? selectedYear : years[0];
  const currentIndex = Math.max(0, years.indexOf(activeYear));
  const yearMembers = useMemo(
    () => members.filter((member) => member.year === activeYear),
    [activeYear, members],
  );
  const executives = byTier(yearMembers, "executive");
  const roles = byTier(yearMembers, "roles");
  const mentors = byTier(yearMembers, "mentors");
  const general = byTier(yearMembers, "members");

  const prevYear = () => {
    const nextIndex = Math.max(0, currentIndex - 1);
    if (years[nextIndex] !== undefined) setSelectedYear(years[nextIndex]);
  };

  const nextYear = () => {
    const nextIndex = Math.min(years.length - 1, currentIndex + 1);
    if (years[nextIndex] !== undefined) setSelectedYear(years[nextIndex]);
  };

  if (loading) {
    return (
      <div className="kit-container pb-16">
        <p className="text-center text-slate-400">Loading committee information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kit-container pb-16">
        <p className="text-center text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="kit-container pb-16">
      {yearMembers.length === 0 ? (
        <p className="text-center text-slate-400">
          Committee information for {activeYear ?? DEFAULT_YEAR} is not available yet.
        </p>
      ) : (
        <div className="space-y-12">
          {executives.length > 0 && (
            <section>
              <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
                Executive Committee {activeYear}
              </h2>
              <div className="grid gap-5 lg:grid-cols-3">
                {executives.map((member) => (
                  <CommitteeCard key={member.id} member={member} featured />
                ))}
              </div>
            </section>
          )}

          {roles.length > 0 && (
            <section>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {roles.map((member) => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}

          {mentors.length > 0 && (
            <section>
              <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.35em] text-white">
                Mentors
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {mentors.map((member) => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}

          {general.length > 0 && (
            <section>
              <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.35em] text-white">
                Members
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {general.map((member) => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Committee year">
        <button
          type="button"
          onClick={prevYear}
          disabled={years.length === 0 || currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous year"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setSelectedYear(year)}
            className={
              activeYear === year
                ? "rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-[#0a192f]"
                : "rounded-lg border border-white/15 px-5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/30 hover:text-white"
            }
          >
            {year}
          </button>
        ))}

        <button
          type="button"
          onClick={nextYear}
          disabled={years.length === 0 || currentIndex === years.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next year"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
