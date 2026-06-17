import type { GalleryPhoto } from "@/lib/types/api";

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
