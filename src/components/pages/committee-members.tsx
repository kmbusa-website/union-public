"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CommitteeCard } from "@/components/shared/committee-card";
import { COMMITTEE_MEMBERS, COMMITTEE_YEARS } from "@/lib/data/committee";
import type { CommitteeMember, CommitteeTier } from "@/lib/types/committee";

function byTier(members: CommitteeMember[], tier: CommitteeTier) {
  return members.filter((m) => m.tier === tier);
}

export function CommitteeMembers() {
  const [yearIndex, setYearIndex] = useState(0);
  const year = COMMITTEE_YEARS[yearIndex];

  const members = useMemo(() => COMMITTEE_MEMBERS.filter((m) => m.year === year), [year]);
  const executives = byTier(members, "executive");
  const roles = byTier(members, "roles");
  const general = byTier(members, "members");

  const prevYear = () => setYearIndex((i) => Math.max(0, i - 1));
  const nextYear = () => setYearIndex((i) => Math.min(COMMITTEE_YEARS.length - 1, i + 1));

  return (
    <div className="kit-container pb-16">
      {members.length === 0 ? (
        <p className="text-center text-slate-400">Committee information for {year} is not available yet.</p>
      ) : (
        <div className="space-y-12">
          {executives.length > 0 && (
            <section>
              <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
                Executive Committee {year}
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
          disabled={yearIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous year"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {COMMITTEE_YEARS.map((y, i) => (
          <button
            key={y}
            type="button"
            onClick={() => setYearIndex(i)}
            className={
              year === y
                ? "rounded-lg bg-cyan-500 px-5 py-2 text-sm font-bold text-[#0a192f]"
                : "rounded-lg border border-white/15 px-5 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/30 hover:text-white"
            }
          >
            {y}
          </button>
        ))}

        <button
          type="button"
          onClick={nextYear}
          disabled={yearIndex === COMMITTEE_YEARS.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next year"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
