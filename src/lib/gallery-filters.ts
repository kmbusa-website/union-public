export const GALLERY_FILTER_KEYS = [
  "all",
  "academic",
  "sports",
  "events",
  "seminars",
  "communityService",
] as const;

export type GalleryFilterKey = (typeof GALLERY_FILTER_KEYS)[number];

export const GALLERY_FILTER_API: Record<GalleryFilterKey, string | undefined> = {
  all: undefined,
  academic: "ACADEMIC",
  sports: "SPORTS",
  events: "EVENTS",
  seminars: "SEMINARS",
  communityService: "COMMUNITY_SERVICE",
};
