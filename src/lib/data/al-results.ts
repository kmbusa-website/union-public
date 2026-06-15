import type { AlResult } from "@/lib/types/api";

const DATA_URL = "/data/al-results.json";

function normalize(value: string) {
  let s = value.trim().toLowerCase().replace(/\s+/g, "");

  if (/^[\d.]+e[+-]?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isFinite(n)) s = String(Math.trunc(n));
  }
  if (/^\d+\.0+$/.test(s)) s = s.replace(/\.0+$/, "");

  return s;
}

export async function loadAlResults(): Promise<AlResult[]> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function searchAlResults(results: AlResult[], query: string): AlResult[] {
  const q = normalize(query);
  if (!q) return [];

  const matches = results.filter((result) => {
    const index = normalize(result.indexNumber);
    const nic = normalize(result.nicNumber ?? "");
    return index === q || nic === q;
  });

  return matches;
}
