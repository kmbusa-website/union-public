export type EventCategory = "meeting" | "seminar" | "cultural" | "ceremony" | "sports";

export interface UnionEvent {
  id: string;
  title: string;
  year: number;
  date: string;
  category: EventCategory;
  description: string;
  imageUrl: string;
  featured: boolean;
  folderName?: string;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  meeting: "Meeting",
  seminar: "Seminar",
  cultural: "Cultural",
  ceremony: "Ceremony",
  sports: "Sports",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  meeting: "#fbbf24",
  seminar: "#22d3ee",
  cultural: "#f472b6",
  ceremony: "#a78bfa",
  sports: "#34d399",
};
