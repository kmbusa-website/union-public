"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, Search, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GALLERY_FILTER_API, GALLERY_FILTER_KEYS, type GalleryFilterKey } from "@/lib/gallery-filters";
import { filterGalleryPhotos } from "@/lib/data/gallery";
import type { GalleryPhoto } from "@/lib/types/api";

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("gallery");
  const tc = useTranslations("common");
  const [filter, setFilter] = useState<GalleryFilterKey>("all");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<GalleryPhoto | null>(null);

  function getPhotoYear(createdAt: string) {
    return new Date(`${createdAt}T00:00:00`).getFullYear();
  }

  const filtered = useMemo(() => {
    const category = GALLERY_FILTER_API[filter];
    return filterGalleryPhotos(photos, { category, query: q });
  }, [photos, filter, q]);

  if (photos.length === 0) {
    return (
      <div className="kit-container pb-16">
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{t("empty")}</p>
        <p className="mt-2 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{t("emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="kit-container pb-16">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {GALLERY_FILTER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={filter === key ? "kit-filter-active" : "kit-filter"}
            >
              {t(`filters.${key}`)}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
          <input
            className="kit-input pl-10"
            placeholder={t("searchPlaceholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{t("noCategory")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setPreview(photo)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-xl border text-left shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <div className="relative aspect-[4/3] w-full" style={{ background: "var(--bg-surface)" }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-400">
                  <span>{t(`filters.${photo.category as GalleryFilterKey}`)}</span>
                  <span className="rounded-full border px-2 py-0.5 text-[10px] tracking-wider" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                    {getPhotoYear(photo.createdAt)}
                  </span>
                </div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{photo.title}</p>
                {photo.description && (
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {photo.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/95 p-1 sm:p-2"
          role="dialog"
          aria-modal
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
            aria-label={tc("close")}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.imageUrl}
              alt={preview.title}
              className="h-full w-full max-h-[100vh] max-w-[100vw] rounded-lg object-contain shadow-2xl"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white sm:p-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-cyan-300">{t(`filters.${preview.category as GalleryFilterKey}`)}</p>
                  <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                    {getPhotoYear(preview.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{preview.title}</h2>
                {preview.description && (
                  <p className="mt-1 text-sm text-white/75">
                    {preview.description}
                  </p>
                )}
              </div>
              {preview.eventSlug && (
                <Link
                  href={`/events/${preview.eventSlug}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <CalendarDays className="h-4 w-4" />
                  {t("viewEvent")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
