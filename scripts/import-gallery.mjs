/**
 * Import gallery photos from Excel or CSV into public/data/gallery.json
 *
 * 1. Place images in public/gallery/ (or use full paths like /events/photo.jpg)
 * 2. Add rows to data/source/gallery.csv (or gallery.xlsx)
 * 3. Run: npm run import:gallery
 *
 * Columns (header row — flexible names):
 * id | title | description | category | imageUrl | createdAt
 *
 * category values: ACADEMIC | SPORTS | EVENTS | SEMINARS | COMMUNITY_SERVICE
 * (friendly names like "Events" or "Community Service" also work)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "data", "source");
const galleryPublicDir = path.join(root, "public", "gallery");
const outDir = path.join(root, "public", "data");
const outFile = path.join(outDir, "gallery.json");

const VALID_CATEGORIES = new Set([
  "ACADEMIC",
  "SPORTS",
  "EVENTS",
  "SEMINARS",
  "COMMUNITY_SERVICE",
]);

const CATEGORY_ALIASES = {
  academic: "ACADEMIC",
  sports: "SPORTS",
  events: "EVENTS",
  event: "EVENTS",
  seminars: "SEMINARS",
  seminar: "SEMINARS",
  communityservice: "COMMUNITY_SERVICE",
  community: "COMMUNITY_SERVICE",
};

const HEADER_ALIASES = {
  id: "id",
  photoid: "id",
  title: "title",
  name: "title",
  description: "description",
  desc: "description",
  category: "category",
  type: "category",
  imageurl: "imageUrl",
  image: "imageUrl",
  imagepath: "imageUrl",
  photo: "imageUrl",
  filepath: "imageUrl",
  filename: "imageUrl",
  createdat: "createdAt",
  date: "createdAt",
  uploadedat: "createdAt",
};

function findInputFiles() {
  if (!fs.existsSync(sourceDir)) return [];

  return fs
    .readdirSync(sourceDir)
    .filter((name) => /^gallery/i.test(name) && /\.(xlsx|xls|csv)$/i.test(name))
    .sort()
    .map((name) => path.join(sourceDir, name));
}

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function cell(value) {
  if (value == null) return "";
  return String(value).trim();
}

function normalizeCategory(value) {
  const raw = cell(value);
  if (!raw) return "";

  const key = raw.toLowerCase().replace(/[\s_-]+/g, "");
  if (CATEGORY_ALIASES[key]) return CATEGORY_ALIASES[key];

  const upper = raw.toUpperCase().replace(/[\s-]+/g, "_");
  return VALID_CATEGORIES.has(upper) ? upper : "";
}

function normalizeImageUrl(value) {
  const raw = cell(value);
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }

  return `/gallery/${raw.replace(/^\.?\//, "")}`;
}

function normalizeDate(value) {
  const raw = cell(value);
  if (!raw) return new Date().toISOString().slice(0, 10);

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return raw;
}

function slugify(value) {
  return cell(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildColumnMap(headers) {
  const map = {};
  headers.forEach((header, index) => {
    const key = HEADER_ALIASES[normalizeHeader(header)];
    if (key && map[key] == null) map[key] = index;
  });
  return map;
}

function resolveImagePath(imageUrl) {
  if (!imageUrl || imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return null;
  }

  const relative = imageUrl.replace(/^\//, "");
  return path.join(root, "public", relative);
}

function rowToPhoto(cells, col, rowNumber) {
  const title = cell(cells[col.title]);
  const imageUrl = normalizeImageUrl(cells[col.imageUrl]);
  const category = normalizeCategory(cells[col.category]);

  if (!title || !imageUrl || !category) return null;

  const id = cell(cells[col.id]) || `${slugify(title)}-${rowNumber}`;
  const createdAt = normalizeDate(cells[col.createdAt]);
  const description = cell(cells[col.description]) || undefined;

  return {
    id,
    title,
    description,
    category,
    imageUrl,
    createdAt,
  };
}

function importFile(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rows.length < 2) {
    throw new Error("Sheet must have a header row and at least one data row.");
  }

  const col = buildColumnMap(rows[0]);
  if (col.title == null || col.imageUrl == null || col.category == null) {
    throw new Error('Missing required columns: "title", "category", and "imageUrl".');
  }

  const photos = [];
  const skipped = [];
  const warnings = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => cell(c) === "")) continue;

    const photo = rowToPhoto(row, col, i + 1);
    if (!photo) {
      skipped.push(i + 1);
      continue;
    }

    const imagePath = resolveImagePath(photo.imageUrl);
    if (imagePath && !fs.existsSync(imagePath)) {
      warnings.push(`Row ${i + 1}: image not found at public/${photo.imageUrl.replace(/^\//, "")}`);
    }

    photos.push(photo);
  }

  return { photos, skipped, warnings };
}

function main() {
  fs.mkdirSync(galleryPublicDir, { recursive: true });

  const inputs = findInputFiles();

  if (inputs.length === 0) {
    console.log("No gallery files found in data/source/. Skipping import.");
    if (!fs.existsSync(outFile)) {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, "[]\n");
      console.log("Created empty public/data/gallery.json");
    }
    return;
  }

  const byId = new Map();
  let skipped = 0;
  const warnings = [];

  for (const input of inputs) {
    const { photos, skipped: fileSkipped, warnings: fileWarnings } = importFile(input);
    skipped += fileSkipped.length;
    warnings.push(...fileWarnings);

    for (const photo of photos) {
      byId.set(photo.id, photo);
    }

    console.log(`  ${photos.length} rows from ${path.basename(input)}`);
  }

  const merged = [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(merged, null, 2)}\n`);

  console.log(`Imported ${merged.length} gallery photo(s) from ${inputs.length} file(s)`);
  console.log("Output: public/data/gallery.json");

  if (skipped > 0) {
    console.log(`Skipped ${skipped} row(s) missing title, category, or imageUrl`);
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }
}

main();
