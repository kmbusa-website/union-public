import { cache } from "react";
import { readdir, readFile } from "fs/promises";
import path from "path";
import type { GalleryPhoto } from "@/lib/types/api";
import type { EventCategory, UnionEvent } from "@/lib/types/event";

const EVENTS_DIR = path.join(process.cwd(), "public", "events");
const EVENTS_CSV_PATH = path.join(EVENTS_DIR, "events.csv");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const EVENT_FOLDER_ALIASES: Record<string, string[]> = {
  "annual-meeting-2024": ["annual meeting 2024"],
  "annual-meeting-2025": ["annual meeting 2025"],
  "al-pilot-2024": ["annual pilot exam 2024"],
  "al-pilot-2025": ["annual pilot exam 2025", "annual pilot exam"],
  "al-pilot-2026": ["annual pilot exam 2026"],
  "course-seminar-2024": ["course selection 2024"],
  "course-seminar-2025": ["course selection 2025"],
  "course-seminar-2026": ["course selection 2026"],
  "ol-seminar-2024": ["Ezhumin OL Seminar 2024"],
  "ol-seminar-2025": ["Ezhumin OL Seminar 2025"],
  "pongal-2025": ["mathuram pongal 2025"],
  "pongal-2026": ["mathuram pongal 2026"],
  "cricket-2026": ["annual cricket friendship match 2026", "Annual Cricket Friendship Match 2026"],
  "office-opening": ["office opening ceremony 2024", "office opening ceremony"],
};
const FEATURED_EVENT_IDS_BY_YEAR: Record<number, string> = {
  2024: "al-pilot-2024",
  2025: "pongal-2025",
  2026: "cricket-2026",
};

function isEventCategory(value: string): value is EventCategory {
  return value === "meeting" || value === "seminar" || value === "cultural" || value === "ceremony" || value === "sports";
}

function parseCsv(text: string): UnionEvent[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return [];

  const headers = headerRow.map((value) => value.trim());

  return dataRows
    .map((values) => {
      const entry = Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? "").trim()]));
      const category = entry.category ?? "";
      if (!isEventCategory(category)) return null;

      return {
        id: entry.id ?? "",
        title: entry.title ?? "",
        year: Number(entry.year ?? 0),
        date: entry.date ?? "",
        category,
        description: entry.description ?? "",
        imageUrl: entry.imageUrl ?? "",
        featured: (entry.featured ?? "").trim() === "true",
      } satisfies UnionEvent;
    })
    .filter((event): event is UnionEvent => Boolean(event?.id && event.title && event.date));
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function candidateFoldersForEvent(event: UnionEvent) {
  const aliases = EVENT_FOLDER_ALIASES[event.id] ?? [];
  const names = [...aliases, event.title, `${event.title} ${event.year}`, event.id];
  return names.map((name) => normalizeName(name)).filter((name, index, list) => list.indexOf(name) === index);
}

function sortPhotoFiles(folderName: string, fileNames: string[]) {
  const normalizedFolder = normalizeName(folderName);

  return [...fileNames].sort((a, b) => {
    const normalizedA = normalizeName(a);
    const normalizedB = normalizeName(b);
    const aIsExact = normalizedA === normalizedFolder;
    const bIsExact = normalizedB === normalizedFolder;

    if (aIsExact !== bIsExact) return aIsExact ? -1 : 1;

    const aIsNumbered = /-\d+$/.test(path.parse(a).name);
    const bIsNumbered = /-\d+$/.test(path.parse(b).name);
    if (aIsNumbered !== bIsNumbered) return aIsNumbered ? 1 : -1;

    return a.localeCompare(b);
  });
}

function fileUrlFromParts(folderName: string, fileName: string) {
  return `/events/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

async function readEventFolders() {
  const entries = await readdir(EVENTS_DIR, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function readFolderPhotos(folderName: string) {
  const folderPath = path.join(EVENTS_DIR, folderName);
  const entries = await readdir(folderPath, { withFileTypes: true }).catch(() => []);
  const fileNames = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  return sortPhotoFiles(folderName, fileNames);
}

async function loadAllEvents() {
  const csvText = await readFile(EVENTS_CSV_PATH, "utf8");
  const events = parseCsv(csvText);
  const folders = await readEventFolders();
  const photosByFolder = new Map<string, string[]>();
  const folderByEventId = new Map<string, string>();

  for (const event of events) {
    const candidates = candidateFoldersForEvent(event);
    let chosenFolder: string | undefined;
    let chosenPhotos: string[] = [];

    for (const candidate of candidates) {
      const matchedFolder = folders.find((folder) => normalizeName(folder) === candidate);
      if (!matchedFolder) continue;

      const photos = await readFolderPhotos(matchedFolder);
      if (photos.length > 0) {
        chosenFolder = matchedFolder;
        chosenPhotos = photos;
        break;
      }

      if (!chosenFolder) {
        chosenFolder = matchedFolder;
        chosenPhotos = photos;
      }
    }

    if (chosenFolder) {
      folderByEventId.set(event.id, chosenFolder);
      photosByFolder.set(chosenFolder, chosenPhotos);
    }
  }

  return events.map((event) => {
    const folderName = folderByEventId.get(event.id);
    const folderPhotos = folderName ? photosByFolder.get(folderName) ?? [] : [];
    return {
      ...event,
      imageUrl: event.imageUrl?.trim() || (folderName && folderPhotos[0] ? fileUrlFromParts(folderName, folderPhotos[0]) : ""),
      folderName,
      featured: FEATURED_EVENT_IDS_BY_YEAR[event.year] === event.id,
    };
  });
}

export const loadEvents = cache(async (): Promise<UnionEvent[]> => {
  try {
    return await loadAllEvents();
  } catch {
    return [];
  }
});

export const loadGalleryPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  const events = await loadEvents();
  const photos: GalleryPhoto[] = [];

  for (const event of events) {
    const folderName = event.folderName;
    const photoFiles = folderName ? await readFolderPhotos(folderName) : [];

    photoFiles.forEach((fileName) => {
      photos.push({
        id: `${event.id}-${fileName}`,
        title: event.title,
        description: event.description || undefined,
        category: event.category,
        imageUrl: fileUrlFromParts(folderName ?? "", fileName),
        createdAt: event.date,
        eventSlug: event.id,
      });
    });
  }

  return photos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

export const loadEventBySlug = cache(async (slug: string) => {
  const events = await loadEvents();
  const event = events.find((item) => item.id === slug);
  if (!event) return null;

  const folderName = event.folderName;
  const photoFiles = folderName ? await readFolderPhotos(folderName) : [];

  return {
    event,
    photos: photoFiles.map((fileName) => ({
      id: `${event.id}-${fileName}`,
      title: event.title,
      description: event.description,
      category: event.category,
      imageUrl: fileUrlFromParts(folderName ?? "", fileName),
      createdAt: event.date,
      eventSlug: event.id,
    } satisfies GalleryPhoto)),
  };
});

export const loadEventSlugs = cache(async (): Promise<string[]> => {
  const events = await loadEvents();
  return events.map((event) => event.id);
});
