import type { GalleryPhoto } from "@/lib/types/api";

const DATA_URL = "/data/gallery.json";

export async function loadGalleryPhotos(): Promise<GalleryPhoto[]> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .filter((photo): photo is GalleryPhoto => Boolean(photo?.id && photo?.title && photo?.imageUrl))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function filterGalleryPhotos(
  photos: GalleryPhoto[],
  options: { category?: string; query?: string },
): GalleryPhoto[] {
  const keyword = options.query?.trim().toLowerCase() ?? "";
  const category = options.category;

  return photos.filter((photo) => {
    if (category && photo.category !== category) return false;
    if (!keyword) return true;

    return (
      photo.title.toLowerCase().includes(keyword) ||
      photo.description?.toLowerCase().includes(keyword)
    );
  });
}
