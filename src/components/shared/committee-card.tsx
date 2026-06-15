"use client";

import { useState } from "react";
import { Building2, GraduationCap, Users } from "lucide-react";
import { COMMITTEE_TIER_LABELS, type CommitteeMember } from "@/lib/types/committee";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberPhoto({ member, size }: { member: CommitteeMember; size: "md" | "lg" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const dims = size === "lg" ? "h-28 w-24" : "h-24 w-20";
  const initials = getInitials(member.name);
  const hasPhoto = Boolean(member.photoUrl?.trim());

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ${dims}`}
      style={{ boxShadow: `0 0 0 2px ${member.accent}` }}
    >
      {hasPhoto && !imageFailed ? (
        <img
          src={member.photoUrl}
          alt={member.name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-slate-900 text-lg font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${member.accent}44, #0f172a)` }}
          aria-label={member.name}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function MemberDetails({ member, showRole }: { member: CommitteeMember; showRole?: boolean }) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-bold leading-tight text-white sm:text-lg">{member.name}</h3>
      <span
        className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
        style={{ backgroundColor: `${member.accent}22`, color: member.accent }}
      >
        {COMMITTEE_TIER_LABELS[member.tier]}
      </span>
      {showRole && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">{member.role}</p>
      )}
      <p className="mt-2 flex items-start gap-2 text-xs text-slate-400 sm:text-sm">
        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" style={{ color: member.accent }} />
        <span>{member.faculty}</span>
      </p>
      <p className="mt-1 flex items-start gap-2 text-xs text-slate-400 sm:text-sm">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: member.accent }} />
        <span>{member.university}</span>
      </p>
    </div>
  );
}

export function CommitteeCard({ member, featured = false }: { member: CommitteeMember; featured?: boolean }) {
  if (featured) {
    return (
      <article
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1527] p-5 transition hover:border-white/20"
        style={{ boxShadow: `inset 0 0 0 1px ${member.accent}18` }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full opacity-60 blur-2xl transition group-hover:opacity-80"
          style={{ background: `radial-gradient(circle, ${member.accent}55 0%, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-5">
          <MemberPhoto member={member} size="lg" />
          <MemberDetails member={member} showRole />
          <div
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 sm:flex"
            style={{ color: member.accent }}
          >
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 h-1 w-14 rounded-full" style={{ backgroundColor: member.accent }} />
      </article>
    );
  }

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1527] p-4 transition hover:border-white/20"
      style={{ boxShadow: `inset 0 0 0 1px ${member.accent}14` }}
    >
      <div className="flex gap-4">
        <MemberPhoto member={member} size="md" />
        <MemberDetails member={member} showRole={member.tier !== "members"} />
      </div>
      <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: member.accent }} />
    </article>
  );
}
