import { cache } from "react";
import { readFile } from "fs/promises";
import path from "path";
import type { GalleryPhoto } from "@/lib/types/api";
import type { UnionEvent } from "@/lib/types/event";

const EVENTS_MANIFEST_PATH = path.join(process.cwd(), "public", "data", "events.json");

interface EventManifestEntry extends UnionEvent {
  photoFiles: string[];
}

interface EventsManifest {
  events: EventManifestEntry[];
}

function fileUrlFromParts(folderName: string, fileName: string) {
  return `/events/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

function toGalleryPhoto(event: EventManifestEntry, fileName: string): GalleryPhoto {
  return {
    id: `${event.id}-${fileName}`,
    title: event.title,
    description: event.description || undefined,
    category: event.category,
    imageUrl: fileUrlFromParts(event.folderName ?? "", fileName),
    createdAt: event.date,
    eventSlug: event.id,
  };
}

async function readManifest(): Promise<EventsManifest> {
  const text = await readFile(EVENTS_MANIFEST_PATH, "utf8");
  return JSON.parse(text) as EventsManifest;
}

export const loadEvents = cache(async (): Promise<UnionEvent[]> => {
  try {
    const { events } = await readManifest();
    return events.map(({ photoFiles: _photoFiles, ...event }) => event);
  } catch {
    return [];
  }
});

export const loadGalleryPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  try {
    const { events } = await readManifest();
    const photos: GalleryPhoto[] = [];

    for (const event of events) {
      for (const fileName of event.photoFiles) {
        photos.push(toGalleryPhoto(event, fileName));
      }
    }

    return photos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
});

export const loadEventBySlug = cache(async (slug: string) => {
  try {
    const { events } = await readManifest();
    const event = events.find((item) => item.id === slug);
    if (!event) return null;

    return {
      event: (({ photoFiles: _photoFiles, ...rest }) => rest)(event),
      photos: event.photoFiles.map((fileName) => toGalleryPhoto(event, fileName)),
    };
  } catch {
    return null;
  }
});

export const loadEventSlugs = cache(async (): Promise<string[]> => {
  const events = await loadEvents();
  return events.map((event) => event.id);
});
