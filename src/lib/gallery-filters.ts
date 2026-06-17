export const GALLERY_FILTER_KEYS = [
  "all",
  "meeting",
  "seminar",
  "cultural",
  "ceremony",
  "sports",
] as const;

export type GalleryFilterKey = (typeof GALLERY_FILTER_KEYS)[number];

export const GALLERY_FILTER_API: Record<GalleryFilterKey, string | undefined> = {
  all: undefined,
  meeting: "meeting",
  seminar: "seminar",
  cultural: "cultural",
  ceremony: "ceremony",
  sports: "sports",
};
