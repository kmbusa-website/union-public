"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Search, X } from "lucide-react";
import { GALLERY_FILTER_API, GALLERY_FILTER_KEYS, type GalleryFilterKey } from "@/lib/gallery-filters";
import { filterGalleryPhotos, loadGalleryPhotos } from "@/lib/data/gallery";
import type { GalleryPhoto } from "@/lib/types/api";

export function GalleryGrid() {
  const t = useTranslations("gallery");
  const tc = useTranslations("common");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<GalleryFilterKey>("all");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGalleryPhotos()
      .then((data) => {
        if (!cancelled) setPhotos(data);
      })
      .catch(() => {
        if (!cancelled) setError(t("loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const category = GALLERY_FILTER_API[filter];
    return filterGalleryPhotos(photos, { category, query: q });
  }, [photos, filter, q]);

  if (loading) {
    return (
      <div className="kit-container flex min-h-[280px] items-center justify-center pb-16">
        <p className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kit-container pb-16">
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{error}</p>
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

      {photos.length === 0 ? (
        <div className="text-center" style={{ color: "var(--text-secondary)" }}>
          <p>{t("empty")}</p>
          <p className="mt-2 text-sm">{t("emptyHint")}</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>{t("noCategory")}</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setPreview(photo)}
              className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-xl border text-left shadow-lg transition hover:-translate-y-0.5"
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
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                  {photo.category.replace(/_/g, " ")}
                </p>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreview(null)}
            aria-label={tc("close")}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="max-h-[90vh] max-w-4xl overflow-auto rounded-xl p-4 shadow-2xl"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.imageUrl}
              alt={preview.title}
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
            <div className="mt-4">
              <p className="text-sm text-cyan-400">{preview.category.replace(/_/g, " ")}</p>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {preview.title}
              </h2>
              {preview.description && (
                <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                  {preview.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
