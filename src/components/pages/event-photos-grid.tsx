"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types/api";

export function EventPhotosGrid({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("events");
  const [preview, setPreview] = useState<GalleryPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className="rounded-3xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
        {t("noPhotos")}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setPreview(photo)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left shadow-lg transition hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
          >
            <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {photo.title}
              </p>
              {photo.description && (
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {photo.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

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
            aria-label={t("backToEvents")}
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
                <h2 className="text-xl font-bold">{preview.title}</h2>
                {preview.description && (
                  <p className="mt-1 text-sm text-white/75">
                    {preview.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
