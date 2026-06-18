"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const CSV_URL = "/home/highlights.csv";

interface Highlight {
  id: string;
  caption: string;
  imageUrl: string;
}

function parseCsv(text: string): Highlight[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const entry = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
      return { id: entry.id ?? "", caption: entry.caption ?? "", imageUrl: entry.imageUrl ?? "" };
    })
    .filter((h) => h.id && h.imageUrl);
}

function PhotoCard({ item }: { item: Highlight }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="group relative shrink-0 overflow-hidden rounded-2xl" style={{ width: "450px", height: "300px" }}>
      <img
        src={item.imageUrl}
        alt={item.caption}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/80 to-transparent px-4 py-3 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-sm font-semibold text-white">{item.caption}</p>
        </div>
      )}
    </div>
  );
}

export function HomeHighlights() {
  const t = useTranslations("home");
  const [items, setItems] = useState<Highlight[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length === 0) return;

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
  }, [items]);

  useEffect(() => {
    fetch(CSV_URL, { cache: "no-store" })
      .then((r) => r.text())
      .then((text) => setItems(parseCsv(text)))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="kit-page-main overflow-hidden border-t" style={{ borderColor: "var(--border-color)" }}>
      <div className="kit-container pb-10!">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">{t("highlightsOverline")}</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            {t("highlightsTitle")} <span className="text-cyan-400">{t("highlightsHighlight")}</span>
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          ref={scrollerRef}
          className="overflow-x-auto pb-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div className="flex gap-4 px-4">
            {[...items, ...items].map((item, i) => (
              <PhotoCard key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-2">
          <Link
            href="/events"
            className="flex items-center gap-2 rounded-full border border-cyan-400/40 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
          >
            {t("viewAllEvents")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
