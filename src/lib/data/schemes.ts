import { cache } from "react";
import { readFile } from "fs/promises";
import path from "path";
import type { PastPaper } from "@/lib/types/pastpaper";

const SCHEMES_CSV = path.join(process.cwd(), "public", "exams", "schemes.csv");

function parseCsv(text: string): PastPaper[] {
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
      return {
        year: Number(entry.year ?? 0),
        subject: entry.subject ?? "",
        title: entry.title ?? "",
        paperType: entry.paperType ?? "",
        sourceName: entry.sourceName ?? "",
        url: entry.url ?? "",
      } satisfies PastPaper;
    })
    .filter((paper) => Boolean(paper.year && paper.subject && paper.title && paper.paperType && paper.sourceName));
}

export const loadSchemes = cache(async (): Promise<PastPaper[]> => {
  try {
    const csv = await readFile(SCHEMES_CSV, "utf8");
    return parseCsv(csv);
  } catch {
    return [];
  }
});

export const loadSchemeYears = cache(async (): Promise<number[]> => {
  const papers = await loadSchemes();
  return Array.from(new Set(papers.map((paper) => paper.year))).sort((a, b) => b - a);
});

export const loadSchemesByYear = cache(async (year: number): Promise<PastPaper[]> => {
  const papers = await loadSchemes();
  return papers.filter((paper) => paper.year === year);
});
