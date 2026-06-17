"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { UnionEvent, EventCategory } from "@/lib/types/event";
import { CATEGORY_COLORS } from "@/lib/types/event";

const ALL = "all";

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EventCard({ event, large = false }: { event: UnionEvent; large?: boolean }) {
  const t = useTranslations("events");
  const [imgFailed, setImgFailed] = useState(false);
  const color = CATEGORY_COLORS[event.category];
  const categoryLabel = t(`categories.${event.category}`);
  const hasPhoto = Boolean(event.imageUrl?.trim()) && !imgFailed;

  const cardStyle = {
    background: "var(--bg-card)",
    borderColor: "var(--border-color)",
    boxShadow: `inset 0 0 0 1px ${color}18`,
  };

  const content = (
    <article className={`group relative overflow-hidden rounded-2xl border transition hover:shadow-md ${large ? "" : "p-5"}`} style={large ? cardStyle : { ...cardStyle, boxShadow: `inset 0 0 0 1px ${color}14` }}>
      {large ? (
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
                {categoryLabel}
              </span>
              {event.featured && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" /> {t("featured")}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
            {event.description && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{event.description}</p>}
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: color }} />
          </div>
        </div>
      ) : (
        <>
          {hasPhoto && (
            <div className="mb-4 h-36 overflow-hidden rounded-xl">
              <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" loading="lazy" onError={() => setImgFailed(true)} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{formatDate(event.date)}</span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${color}22`, color }}>
              {categoryLabel}
            </span>
            {event.featured && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
          </div>
          <h3 className="mt-2 font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
          {event.description && <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>{event.description}</p>}
          <div className="mt-4 h-1 w-10 rounded-full" style={{ backgroundColor: color }} />
        </>
      )}
    </article>
  );

  return (
    <Link href={`/events/${event.id}`} className="block transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}

export function EventsList({ events }: { events: UnionEvent[] }) {
  const t = useTranslations("events");
  const tc = useTranslations("common");
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const years = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a);
    return years[0] ?? 0;
  });
  const [activeCategory, setActiveCategory] = useState<EventCategory | typeof ALL>(ALL);

  const years = useMemo(() => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a), [events]);
  const currentYear = selectedYear || years[0] || 0;
  const currentIndex = Math.max(0, years.indexOf(currentYear));

  const yearEvents = useMemo(
    () => [...events.filter((e) => e.year === currentYear)].sort((a, b) => a.date.localeCompare(b.date)),
    [events, currentYear],
  );

  const categories = useMemo(() => Array.from(new Set(yearEvents.map((e) => e.category))), [yearEvents]);

  const filtered = useMemo(
    () => (activeCategory === ALL ? yearEvents : yearEvents.filter((e) => e.category === activeCategory)),
    [yearEvents, activeCategory],
  );

  const featured = filtered.filter((e) => e.featured);
  const regular = filtered.filter((e) => !e.featured);

  const navBtnBase: React.CSSProperties = { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" };

  if (events.length === 0) {
    return (
      <div className="kit-container pb-16">
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{t("emptyCatalog")}</p>
      </div>
    );
  }

  return (
    <div className="kit-container pb-16">
      {yearEvents.length === 0 ? (
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{t("emptyCatalog")}</p>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(ALL)}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition"
              style={activeCategory === ALL
                ? { backgroundColor: "#06b6d4", color: "#0a192f" }
                : { ...navBtnBase, border: "1px solid var(--border-color)" }}
            >
              {tc("all")}
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
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {featured.length > 0 && (
            <section className="space-y-4">
              {featured.map((event) => <EventCard key={event.id} event={event} large />)}
            </section>
          )}

          {regular.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map((event) => <EventCard key={event.id} event={event} />)}
            </section>
          )}
        </div>
      )}

      <nav className="mt-12 flex items-center justify-center gap-3" aria-label={t("yearNav")}>
        <button
          type="button"
          onClick={() => {
            const i = Math.max(0, currentIndex - 1);
            if (years[i] !== undefined) setSelectedYear(years[i]);
          }}
          disabled={years.length === 0 || currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:border-cyan-400/50 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-30"
          style={navBtnBase}
          aria-label={tc("previousYear")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setSelectedYear(year)}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition"
            style={currentYear === year
              ? { backgroundColor: "#06b6d4", color: "#0a192f", fontWeight: 700 }
              : { ...navBtnBase, border: "1px solid var(--border-color)" }}
          >
            {year}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const i = Math.min(years.length - 1, currentIndex + 1);
            if (years[i] !== undefined) setSelectedYear(years[i]);
          }}
          disabled={years.length === 0 || currentIndex === years.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border transition hover:border-cyan-400/50 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-30"
          style={navBtnBase}
          aria-label={tc("nextYear")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
