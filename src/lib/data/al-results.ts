import type { AlResult } from "@/lib/types/api";

const DATA_URL = "/data/al-results.json";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export async function loadAlResults(): Promise<AlResult[]> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function getExamYears(results: AlResult[]): number[] {
  return [...new Set(results.map((r) => r.examYear))].sort((a, b) => b - a);
}

export function searchAlResults(results: AlResult[], query: string, examYear?: number): AlResult[] {
  const q = normalize(query);
  if (!q) return [];

  return results.filter((result) => {
    if (examYear != null && result.examYear !== examYear) return false;

    const index = normalize(result.indexNumber);
    const nic = normalize(result.nicNumber ?? "");

    return index === q || nic === q;
  });
}
