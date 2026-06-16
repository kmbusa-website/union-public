"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { UnionEvent, EventCategory } from "@/lib/types/event";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types/event";

const CSV_URL = "/events/events.csv";
const ALL = "all";

function isEventCategory(value: string): value is EventCategory {
  return value === "meeting" || value === "seminar" || value === "cultural" || value === "ceremony" || value === "sports";
}

function parseCsv(text: string): UnionEvent[] {
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
      const entry = Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()]));
      const cat = entry.category ?? "";
      if (!isEventCategory(cat)) return null;
      return {
        id: entry.id ?? "",
        title: entry.title ?? "",
        year: Number(entry.year ?? 0),
        date: entry.date ?? "",
        category: cat,
        description: entry.description ?? "",
        imageUrl: entry.imageUrl ?? "",
        featured: entry.featured === "true",
      } satisfies UnionEvent;
    })
    .filter((e): e is UnionEvent => Boolean(e?.id && e.title && e.year));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EventCard({ event, large = false }: { event: UnionEvent; large?: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const color = CATEGORY_COLORS[event.category];
  const hasPhoto = Boolean(event.imageUrl?.trim()) && !imgFailed;

  const cardStyle = {
    background: "var(--bg-card)",
    borderColor: "var(--border-color)",
    boxShadow: `inset 0 0 0 1px ${color}18`,
  };

  if (large) {
    return (
      <article className="group relative overflow-hidden rounded-2xl border transition hover:shadow-md" style={cardStyle}>
        <div className="flex flex-col sm:flex-row">
          {hasPhoto ? (
            <div className="h-52 shrink-0 overflow-hidden sm:h-auto sm:w-56">
              <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" loading="lazy" onError={() => setImgFailed(true)} />
            </div>
          ) : (
            <div className="flex h-52 shrink-0 items-center justify-center sm:h-auto sm:w-56" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
              <span className="text-4xl font-black" style={{ color }}>{event.title[0]}</span>
            </div>
          )}
          <div className="flex flex-col justify-center gap-3 p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{formatDate(event.date)}</span>
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${color}22`, color }}>
                {CATEGORY_LABELS[event.category]}
              </span>
              {event.featured && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" /> Featured
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
            {event.description && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{event.description}</p>}
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: color }} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border p-5 transition hover:shadow-md"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: `inset 0 0 0 1px ${color}14` }}
    >
      {hasPhoto && (
        <div className="mb-4 h-36 overflow-hidden rounded-xl">
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" loading="lazy" onError={() => setImgFailed(true)} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{formatDate(event.date)}</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${color}22`, color }}>
          {CATEGORY_LABELS[event.category]}
        </span>
        {event.featured && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
      </div>
      <h3 className="mt-2 font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
      {event.description && <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>{event.description}</p>}
      <div className="mt-4 h-1 w-10 rounded-full" style={{ backgroundColor: color }} />
    </article>
  );
}

export function EventsList() {
  const [events, setEvents] = useState<UnionEvent[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<EventCategory | typeof ALL>(ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load events.csv (${res.status})`);
        const parsed = parseCsv(await res.text());
        setEvents(parsed);
        const years = Array.from(new Set(parsed.map((e) => e.year))).sort((a, b) => b - a);
        if (years[0]) setSelectedYear(years[0]);
        setError(null);
      } catch (cause) {
        if ((cause as Error).name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const years = useMemo(() => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a), [events]);
  const currentIndex = Math.max(0, years.indexOf(selectedYear));

  const yearEvents = useMemo(
    () => [...events.filter((e) => e.year === selectedYear)].sort((a, b) => a.date.localeCompare(b.date)),
    [events, selectedYear],
  );

  const categories = useMemo(() => Array.from(new Set(yearEvents.map((e) => e.category))), [yearEvents]);

  const filtered = useMemo(
    () => (activeCategory === ALL ? yearEvents : yearEvents.filter((e) => e.category === activeCategory)),
    [yearEvents, activeCategory],
  );

  const featured = filtered.filter((e) => e.featured);
  const regular = filtered.filter((e) => !e.featured);

  const navBtnBase: React.CSSProperties = { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" };

  if (loading) return <div className="kit-container pb-16"><p className="text-center" style={{ color: "var(--text-secondary)" }}>Loading events...</p></div>;
  if (error) return <div className="kit-container pb-16"><p className="text-center" style={{ color: "var(--text-secondary)" }}>{error}</p></div>;

  return (
    <div className="kit-container pb-16">
      {yearEvents.length === 0 ? (
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>No events for {selectedYear}.</p>
      ) : (
        <div className="space-y-10">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(ALL)}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition"
              style={activeCategory === ALL
                ? { backgroundColor: "#06b6d4", color: "#0a192f" }
                : { ...navBtnBase, border: "1px solid var(--border-color)" }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition"
                style={activeCategory === cat
                  ? { backgroundColor: CATEGORY_COLORS[cat], color: "#0a192f", fontWeight: 700 }
                  : { ...navBtnBase, border: "1px solid var(--border-color)" }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {featured.length > 0 && (
            <section className="space-y-4">
              {featured.map((e) => <EventCard key={e.id} event={e} large />)}
            </section>
          )}

          {regular.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map((e) => <EventCard key={e.id} event={e} />)}
            </section>
          )}
        </div>
      )}

      {/* Year navigation */}
      <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Events year">
        <button
          type="button"
          onClick={() => { const i = Math.max(0, currentIndex - 1); if (years[i] !== undefined) setSelectedYear(years[i]); }}
          disabled={years.length === 0 || currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:border-cyan-400/50 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-30"
          style={navBtnBase}
          aria-label="Previous year"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setSelectedYear(year)}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition"
            style={selectedYear === year
              ? { backgroundColor: "#06b6d4", color: "#0a192f", fontWeight: 700 }
              : { ...navBtnBase, border: "1px solid var(--border-color)" }}
          >
            {year}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { const i = Math.min(years.length - 1, currentIndex + 1); if (years[i] !== undefined) setSelectedYear(years[i]); }}
          disabled={years.length === 0 || currentIndex === years.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:border-cyan-400/50 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-30"
          style={navBtnBase}
          aria-label="Next year"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
