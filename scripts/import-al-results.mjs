/**
 * Import A/L results from Excel or CSV into public/data/al-results.json
 *
 * 1. Place your file at: data/source/al-results.xlsx (or .xls / .csv)
 * 2. Run: npm run import:results
 *
 * Expected columns (first row headers — names are flexible):
 * Student Name | Index Number | NIC Number | Exam Year | Stream | District | School |
 * Physics | Chemistry | Combined Mathematics | Biology | Z-Score | District Rank | Island Rank | Exam Session
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourceDir = path.join(root, "data", "source");
const outDir = path.join(root, "public", "data");
const outFile = path.join(outDir, "al-results.json");

const INPUT_CANDIDATES = [
  "exam_results.xlsx",
  "exam_results.xls",
  "exam_results.csv",
  "al-results.xlsx",
  "al-results.xls",
  "al-results.csv",
];

function findInputFile() {
  const exactExam = ["exam_results.xlsx", "exam_results.xls", "exam_results.csv"];
  for (const name of exactExam) {
    const file = path.join(sourceDir, name);
    if (fs.existsSync(file)) return file;
  }

  if (fs.existsSync(sourceDir)) {
    const examMatch = fs
      .readdirSync(sourceDir)
      .filter((name) => /^exam_results/i.test(name) && /\.(xlsx|xls|csv)$/i.test(name))
      .sort()
      .pop();
    if (examMatch) return path.join(sourceDir, examMatch);
  }

  for (const name of ["al-results.xlsx", "al-results.xls", "al-results.csv"]) {
    const file = path.join(sourceDir, name);
    if (fs.existsSync(file)) return file;
  }

  return null;
}

const HEADER_ALIASES = {
  studentname: "studentName",
  name: "studentName",
  indexnumber: "indexNumber",
  indexno: "indexNumber",
  index: "indexNumber",
  nicnumber: "nicNumber",
  nic: "nicNumber",
  examyear: "examYear",
  year: "examYear",
  stream: "stream",
  district: "district",
  schoolname: "schoolName",
  school: "schoolName",
  physics: "phy",
  phy: "phy",
  chemistry: "che",
  che: "che",
  combinedmathematics: "mat",
  mathematics: "mat",
  maths: "mat",
  mat: "mat",
  biology: "bio",
  bio: "bio",
  zscore: "zScore",
  districtrank: "districtRank",
  islandrank: "islandRank",
  examsession: "examSessionName",
  session: "examSessionName",
};

const SUBJECT_META = {
  phy: { subjectCode: "PHY", subjectName: "Physics" },
  che: { subjectCode: "CHE", subjectName: "Chemistry" },
  mat: { subjectCode: "MAT", subjectName: "Combined Mathematics" },
  bio: { subjectCode: "BIO", subjectName: "Biology" },
};

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseStream(value) {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  if (raw.includes("BIO")) return "BIO_SCIENCE";
  if (raw.includes("PHYSICAL") || raw.includes("MATH") || raw.includes("PHY")) return "PHYSICAL_SCIENCE";
  return raw || "PHYSICAL_SCIENCE";
}

function cell(value) {
  if (value == null) return "";
  return String(value).trim();
}

function toNumber(value) {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function buildColumnMap(headers) {
  const map = {};
  headers.forEach((header, index) => {
    const key = HEADER_ALIASES[normalizeHeader(header)];
    if (key) map[key] = index;
  });
  return map;
}

function rowToResult(cells, col) {
  const studentName = cell(cells[col.studentName]);
  const indexNumber = cell(cells[col.indexNumber]);
  if (!studentName || !indexNumber) return null;

  const stream =
    col.stream != null
      ? parseStream(cells[col.stream])
      : col.bio != null && cell(cells[col.bio]) && !(col.mat != null && cell(cells[col.mat]))
        ? "BIO_SCIENCE"
        : "PHYSICAL_SCIENCE";
  const zScore = toNumber(cells[col.zScore]);
  const districtRank = toNumber(cells[col.districtRank]);
  const islandRank = toNumber(cells[col.islandRank]);

  const subjectKeys =
    stream === "BIO_SCIENCE" ? ["bio", "che", "phy"] : ["phy", "che", "mat"];

  const subjectResults = subjectKeys
    .filter((key) => col[key] != null)
    .map((key) => {
      const grade = cell(cells[col[key]]);
      if (!grade) return null;
      const meta = SUBJECT_META[key];
      const subject = { ...meta, grade };
      if (key === subjectKeys[0]) {
        if (zScore != null) subject.zScore = zScore;
        if (districtRank != null) subject.districtRank = districtRank;
        if (islandRank != null) subject.islandRank = islandRank;
      } else if (zScore != null) {
        subject.zScore = zScore;
      }
      return subject;
    })
    .filter(Boolean);

  return {
    studentName,
    indexNumber,
    nicNumber: cell(cells[col.nicNumber]) || undefined,
    examYear: toNumber(cells[col.examYear]) ?? new Date().getFullYear(),
    examSessionName: cell(cells[col.examSessionName]) || undefined,
    stream,
    district: cell(cells[col.district]) || undefined,
    schoolName: cell(cells[col.schoolName]) || undefined,
    subjectResults,
  };
}

function importFile(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (rows.length < 2) {
    throw new Error("Sheet must have a header row and at least one data row.");
  }

  const col = buildColumnMap(rows[0]);
  if (col.studentName == null || col.indexNumber == null) {
    throw new Error('Missing required columns: "Student Name" and "Index Number".');
  }

  const results = [];
  const skipped = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => cell(c) === "")) continue;

    const result = rowToResult(row, col);
    if (result) {
      results.push(result);
    } else {
      skipped.push(i + 1);
    }
  }

  return { results, skipped };
}

function main() {
  const input = findInputFile();

  if (!input) {
    console.log("No file found in data/source/ (al-results.xlsx, .xls, or .csv). Skipping import.");
    if (!fs.existsSync(outFile)) {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, "[]\n");
      console.log("Created empty public/data/al-results.json");
    }
    return;
  }

  const { results, skipped } = importFile(input);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(results, null, 2)}\n`);

  console.log(`Imported ${results.length} results from ${path.basename(input)}`);
  console.log(`Output: public/data/al-results.json`);
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} row(s) missing name or index: ${skipped.slice(0, 10).join(", ")}${skipped.length > 10 ? "…" : ""}`);
  }
}

main();
