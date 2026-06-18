/**
 * Scan public/events/ and events.csv into public/data/events.json.
 * Run at build time so serverless routes do not bundle hundreds of MB of photos.
 *
 * Run: npm run import:events
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const EVENTS_DIR = path.join(root, "public", "events");
const EVENTS_CSV_PATH = path.join(EVENTS_DIR, "events.csv");
const OUT_DIR = path.join(root, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "events.json");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const EVENT_FOLDER_ALIASES = {
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

const FEATURED_EVENT_IDS_BY_YEAR = {
  2024: "al-pilot-2024",
  2025: "pongal-2025",
  2026: "cricket-2026",
};

const EVENT_CATEGORIES = new Set(["meeting", "seminar", "cultural", "ceremony", "sports"]);

function parseCsv(text) {
  const rows = [];
  let row = [];
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
      if (!EVENT_CATEGORIES.has(category)) return null;

      return {
        id: entry.id ?? "",
        title: entry.title ?? "",
        year: Number(entry.year ?? 0),
        date: entry.date ?? "",
        category,
        description: entry.description ?? "",
        imageUrl: entry.imageUrl ?? "",
        featured: (entry.featured ?? "").trim() === "true",
      };
    })
    .filter((event) => Boolean(event?.id && event.title && event.date));
}

function normalizeName(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function candidateFoldersForEvent(event) {
  const aliases = EVENT_FOLDER_ALIASES[event.id] ?? [];
  const names = [...aliases, event.title, `${event.title} ${event.year}`, event.id];
  return names.map((name) => normalizeName(name)).filter((name, index, list) => list.indexOf(name) === index);
}

function sortPhotoFiles(folderName, fileNames) {
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

function fileUrlFromParts(folderName, fileName) {
  return `/events/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;
}

async function readEventFolders() {
  const entries = await fs.readdir(EVENTS_DIR, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function readFolderPhotos(folderName) {
  const folderPath = path.join(EVENTS_DIR, folderName);
  const entries = await fs.readdir(folderPath, { withFileTypes: true }).catch(() => []);
  const fileNames = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  return sortPhotoFiles(folderName, fileNames);
}

async function buildManifest() {
  const csvText = await fs.readFile(EVENTS_CSV_PATH, "utf8");
  const events = parseCsv(csvText);
  const folders = await readEventFolders();
  const photosByFolder = new Map();
  const folderByEventId = new Map();

  for (const event of events) {
    const candidates = candidateFoldersForEvent(event);
    let chosenFolder;
    let chosenPhotos = [];

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

  const manifestEvents = events.map((event) => {
    const folderName = folderByEventId.get(event.id);
    const photoFiles = folderName ? photosByFolder.get(folderName) ?? [] : [];
    const imageUrl =
      event.imageUrl?.trim() || (folderName && photoFiles[0] ? fileUrlFromParts(folderName, photoFiles[0]) : "");

    return {
      ...event,
      imageUrl,
      folderName,
      featured: FEATURED_EVENT_IDS_BY_YEAR[event.year] === event.id,
      photoFiles,
    };
  });

  return { events: manifestEvents };
}

async function main() {
  const manifest = await buildManifest();
  const photoCount = manifest.events.reduce((sum, event) => sum + event.photoFiles.length, 0);

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Imported ${manifest.events.length} event(s) with ${photoCount} photo(s)`);
  console.log("Output: public/data/events.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
