"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GALLERY_CATEGORY_API, GALLERY_FILTERS } from "@/lib/brand";
import type { GalleryPhoto } from "@/lib/types/api";

export function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<GalleryPhoto | null>(null);

  const photos = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const category = filter === "All" ? undefined : GALLERY_CATEGORY_API[filter];

    return ([] as GalleryPhoto[]).filter((photo) => {
      if (category && photo.category !== category) return false;
      if (!keyword) return true;
      return (
        photo.title.toLowerCase().includes(keyword) ||
        photo.description?.toLowerCase().includes(keyword)
      );
    });
  }, [filter, q]);

  return (
    <div className="kit-container pb-16">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={filter === f ? "kit-filter-active" : "kit-filter"}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
          <input
            className="kit-input pl-10"
            placeholder="Search gallery..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="text-center" style={{ color: "var(--text-secondary)" }}>No photos in this category yet.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
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
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>{photo.description}</p>
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
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="max-h-[90vh] max-w-4xl overflow-auto rounded-xl bg-[#0a192f] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.imageUrl}
              alt={preview.title}
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
            <div className="mt-4 text-white">
              <p className="text-sm text-amber-400">{preview.category.replace(/_/g, " ")}</p>
              <h2 className="text-xl font-bold">{preview.title}</h2>
              {preview.description && <p className="mt-2 text-slate-300">{preview.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
