"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CommitteeMember } from "@/lib/types/committee";

const CSV_URL = "/committee/committee.csv";

function parseCsv(text: string): CommitteeMember[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') { cell += '"'; i++; } else { inQuotes = !inQuotes; }
      continue;
    }
    if (char === "," && !inQuotes) { row.push(cell); cell = ""; continue; }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = []; cell = "";
      continue;
    }
    cell += char;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
  }

  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return [];
  const headers = headerRow.map((v) => v.trim());

  return dataRows
    .map((values) => {
      const e = Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()]));
      const tier = e.tier ?? "";
      if (tier !== "executive" && tier !== "roles" && tier !== "mentors" && tier !== "members") return null;
      return {
        id: e.id ?? "",
        name: e.name ?? "",
        role: e.role ?? "",
        tier: tier as CommitteeMember["tier"],
        faculty: e.faculty ?? "",
        university: e.university ?? "",
        photoUrl: e.photoUrl ?? "",
        accent: e.accent ?? "#22d3ee",
        year: Number(e.year ?? 0),
      } satisfies CommitteeMember;
    })
    .filter((m): m is CommitteeMember => Boolean(m?.id && m.name && m.year));
}

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function MemberCard({ member }: { member: CommitteeMember }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = Boolean(member.photoUrl?.trim()) && !imgFailed;

  return (
    <div
      className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border transition hover:border-amber-400/30 hover:-translate-y-1 sm:w-48"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="relative h-48 w-full overflow-hidden sm:h-52">
        {hasPhoto ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="h-full w-full object-cover object-top transition group-hover:scale-105"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-black"
            style={{ background: `linear-gradient(135deg, ${member.accent}55, #0f172a)`, color: "#ffffff" }}
          >
            {getInitials(member.name)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      <div className="px-4 pb-5 pt-2">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: member.accent }}>
          {member.role}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
        <p className="mt-1 line-clamp-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>{member.faculty}</p>
        <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{member.university}</p>
      </div>
    </div>
  );
}

export function HomeCommitteePreview() {
  const t = useTranslations("home");
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || members.length === 0) return;

    const step = 0.6;
    const timer = window.setInterval(() => {
      const halfWidth = scroller.scrollWidth / 2;
      if (halfWidth <= 0) return;

      scroller.scrollLeft += step;
      if (scroller.scrollLeft >= halfWidth) {
        scroller.scrollLeft -= halfWidth;
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [members]);

  useEffect(() => {
    fetch(CSV_URL, { cache: "no-store" })
      .then((r) => r.text())
      .then((text) => {
        const all = parseCsv(text);
        const years = Array.from(new Set(all.map((m) => m.year))).sort((a, b) => b - a);
        const latest = years[0];
        setMembers(all.filter((m) => m.year === latest));
      })
      .catch(() => {});
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="kit-page-main border-t" style={{ borderColor: "var(--border-color)" }}>
      <div className="kit-container">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">{t("committeeOverline")}</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {t("committeeTitle")} <span className="text-amber-500">{t("committeeHighlight")}</span>
          </h2>
        </div>

        <div ref={scrollerRef} className="overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 px-1">
            {[...members, ...members].map((m, i) => (
              <MemberCard key={`${m.id}-${i}`} member={m} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/committee"
            className="flex items-center gap-2 rounded-full border border-amber-400/40 px-6 py-2.5 text-sm font-semibold text-amber-500 transition hover:bg-amber-400/10"
          >
            {t("viewAllMembers")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
