"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Award, Search } from "lucide-react";
import { loadAlResults, searchAlResults } from "@/lib/data/al-results";
import type { AlResult, SubjectResult } from "@/lib/types/api";

const SUBJECT_ORDER: Record<string, string[]> = {
  PHYSICAL_SCIENCE: ["PHY", "CHE", "MAT"],
  BIO_SCIENCE: ["BIO", "CHE", "PHY"],
};

function formatStream(stream?: string) {
  if (!stream) return "—";
  return stream.replace(/_/g, " ");
}

function formatZScore(value?: number) {
  if (value == null) return "—";
  return value.toFixed(4);
}

function getZScoreMeta(result: AlResult) {
  const withZ = result.subjectResults?.find((s) => (s.zScore ?? s.zscore) != null);
  return {
    zScore: withZ?.zScore ?? withZ?.zscore,
    districtRank: withZ?.districtRank,
    islandRank: withZ?.islandRank,
  };
}

function sortSubjects(stream: string | undefined, subjects: SubjectResult[]) {
  const order = stream ? SUBJECT_ORDER[stream] : null;
  if (!order) return subjects;
  return [...subjects].sort((a, b) => {
    const ai = order.indexOf(a.subjectCode ?? "");
    const bi = order.indexOf(b.subjectCode ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

function displaySubjectName(subject: SubjectResult) {
  if (subject.subjectName) return subject.subjectName.toUpperCase();
  const names: Record<string, string> = {
    PHY: "PHYSICS",
    CHE: "CHEMISTRY",
    MAT: "COMBINED MATHEMATICS",
    BIO: "BIOLOGY",
  };
  return names[subject.subjectCode ?? ""] ?? subject.subjectCode ?? "—";
}

function ResultDetail({ result }: { result: AlResult }) {
  const { zScore, districtRank, islandRank } = getZScoreMeta(result);
  const subjects = sortSubjects(result.stream, result.subjectResults ?? []);

  const infoRows: { label: string; value: React.ReactNode }[] = [
    { label: "Examination", value: "G.C.E. (A/L) Examination" },
    { label: "Year", value: result.examYear },
    { label: "Name", value: result.studentName },
    { label: "Index Number", value: result.indexNumber },
    { label: "NIC Number", value: result.nicNumber ?? "—" },
  ];

  if (result.district) {
    infoRows.push({ label: "District", value: result.district });
  }
  if (result.schoolName) {
    infoRows.push({ label: "School", value: result.schoolName });
  }

  infoRows.push(
    { label: "District Rank", value: districtRank ?? "—" },
    { label: "Z-Score", value: formatZScore(zScore) }
  );

  if (islandRank != null) {
    infoRows.push({ label: "Island Rank", value: islandRank });
  }

  infoRows.push({
    label: "Subject Stream",
    value: (
      <span className="font-semibold uppercase tracking-wide text-cyan-400">
        {formatStream(result.stream)}
      </span>
    ),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c1527] shadow-lg shadow-black/20">
      <div className="border-b border-white/10 bg-gradient-to-b from-cyan-500/10 to-transparent px-6 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15">
          <Award className="h-9 w-9 text-cyan-400" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">{result.studentName}</h3>
      </div>

      <div className="px-6 py-5">
        <dl className="divide-y divide-white/10">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
              <dt className="font-medium text-slate-400">{row.label}</dt>
              <dd className="text-right font-semibold text-white">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left">
                <th className="px-4 py-3 font-semibold text-cyan-400">Subject</th>
                <th className="px-4 py-3 text-right font-semibold text-cyan-400">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {subjects.map((subject) => (
                <tr key={subject.subjectCode ?? subject.subjectName}>
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {displaySubjectName(subject)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex min-w-[2rem] items-center justify-center rounded-md bg-cyan-500/20 px-2.5 py-1 text-base font-bold text-cyan-400">
                      {subject.grade ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ResultsSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allResults, setAllResults] = useState<AlResult[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAlResults()
      .then((data) => {
        if (!cancelled) setAllResults(data);
      })
      .catch(() => {
        if (!cancelled) {
          setDataError("Could not load results data. Run npm run import:results and refresh.");
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback((value: string, dataset: AlResult[]) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearched(true);
    setResults(searchAlResults(dataset, trimmed));
  }, []);

  const urlQuery = searchParams.get("query") ?? "";

  useEffect(() => {
    if (dataLoading || allResults.length === 0) return;
    setQuery((prev) => (prev === urlQuery ? prev : urlQuery));
    if (urlQuery) runSearch(urlQuery, allResults);
  }, [urlQuery, allResults, dataLoading, runSearch]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setLoading(true);
    const params = new URLSearchParams();
    if (trimmed) params.set("query", trimmed);
    router.replace(params.size ? `/results?${params.toString()}` : "/results");
    runSearch(trimmed, allResults);
    setLoading(false);
  };

  const result = results[0];

  if (dataLoading) {
    return (
      <div className="kit-container pb-16">
        <div className="kit-card flex min-h-[320px] items-center justify-center">
          <p className="text-slate-400">Loading results data...</p>
        </div>
      </div>
    );
  }

  if (dataError || allResults.length === 0) {
    return (
      <div className="kit-container pb-16">
        <div className="kit-card max-w-2xl space-y-3">
          <p className="font-semibold text-white">No results data loaded</p>
          <p className="text-sm text-slate-400">
            {dataError ||
              "Add your Excel sheet to data/source/al-results.xlsx, then run npm run import:results."}
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-400">
            <li>Copy data/source/al-results-template.csv as a starting point</li>
            <li>Paste all ~360 student rows from your sheet</li>
            <li>Save as data/source/al-results.xlsx (or .csv)</li>
            <li>Run: npm run import:results</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="kit-container pb-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <form onSubmit={onSubmit} method="post" className="kit-card h-fit lg:sticky lg:top-8">
          <h2 className="text-lg font-bold text-white">Check Your Results</h2>
          <p className="mt-1 text-sm text-slate-400">
            Enter your index number or NIC number to view the A/L results.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="kit-label" htmlFor="search-query">
                Index Number or NIC Number
              </label>
              <input
                id="search-query"
                name="query"
                className="kit-input"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="7364521 or 200512345678"
              />
            </div>
            <p className="text-xs text-slate-500">
              {allResults.length} students loaded. Search by exact index or NIC number.
            </p>
            <button type="submit" disabled={loading} className="kit-btn-primary w-full py-3">
              <Search className="h-4 w-4" />
              {loading ? "Searching..." : "Search Results"}
            </button>
          </div>
        </form>

        <div className="min-h-[320px]">
          {loading ? (
            <div className="kit-card flex min-h-[320px] items-center justify-center">
              <p className="text-slate-400">Searching results...</p>
            </div>
          ) : !searched ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-slate-400">
              <Search className="mb-3 h-12 w-12 text-slate-500" />
              <p className="font-medium text-slate-300">Results will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Search by index number or NIC number to view your A/L results</p>
            </div>
          ) : !result ? (
            <div className="kit-card flex min-h-[320px] items-center justify-center">
              <p className="text-center text-slate-400">
                No results found for this index or NIC number.
              </p>
            </div>
          ) : (
            <ResultDetail result={result} />
          )}
        </div>
      </div>
    </div>
  );
}

export function ResultsSearch() {
  return (
    <Suspense
      fallback={
        <div className="kit-container">
          <div className="kit-card flex min-h-[320px] items-center justify-center">
            <p className="text-slate-400">Loading search...</p>
          </div>
        </div>
      }
    >
      <ResultsSearchForm />
    </Suspense>
  );
}
