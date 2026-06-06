"use client";

import { useState } from "react";
import { Award, Search } from "lucide-react";
import { searchResults } from "@/lib/api";
import { getErrorMessage } from "@/lib/api/client";
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
  ];

  if (result.nicNumber) {
    infoRows.push({ label: "NIC Number", value: result.nicNumber });
  }
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
      <span className="font-semibold uppercase tracking-wide text-blue-600">
        {formatStream(result.stream)}
      </span>
    ),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md shadow-slate-200/60">
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white px-6 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Award className="h-9 w-9 text-blue-600" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{result.studentName}</h3>
      </div>

      <div className="px-6 py-5">
        <dl className="divide-y divide-slate-100">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
              <dt className="font-medium text-slate-500">{row.label}</dt>
              <dd className="text-right font-semibold text-slate-900">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 font-semibold text-blue-600">Subject</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-600">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((subject) => (
                <tr key={subject.subjectCode ?? subject.subjectName} className="bg-white">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {displaySubjectName(subject)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex min-w-[2rem] items-center justify-center rounded-md bg-blue-100 px-2.5 py-1 text-base font-bold text-blue-700">
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

export function ResultsSearch() {
  const [index, setIndex] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState<AlResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      setResults(await searchResults(index.trim(), year ? Number(year) : undefined));
    } catch (err) {
      setError(getErrorMessage(err));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const result = results[0];

  return (
    <div className="kit-container">
      <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <form onSubmit={onSubmit} className="kit-card h-fit lg:sticky lg:top-8">
          <h2 className="text-lg font-bold text-slate-900">Check Your Results</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your index number to view the A/L results.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="kit-label" htmlFor="index-number">
                Index Number
              </label>
              <input
                id="index-number"
                className="kit-input"
                required
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                placeholder="7364521"
              />
            </div>
            <div>
              <label className="kit-label" htmlFor="exam-year">
                Exam Year (optional)
              </label>
              <input
                id="exam-year"
                className="kit-input"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
              />
            </div>
            <button type="submit" disabled={loading} className="kit-btn-primary w-full py-3">
              <Search className="h-4 w-4" />
              {loading ? "Searching..." : "Search Results"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>

        <div className="min-h-[320px]">
          {!searched ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 p-8 text-slate-500">
              <Search className="mb-3 h-12 w-12 text-slate-300" />
              <p className="font-medium">Results will appear here</p>
              <p className="mt-1 text-sm text-slate-400">Search by index number to view your A/L results</p>
            </div>
          ) : !result ? (
            <div className="kit-card flex min-h-[320px] items-center justify-center">
              <p className="text-slate-600">No results found for this index number.</p>
            </div>
          ) : (
            <ResultDetail result={result} />
          )}
        </div>
      </div>
    </div>
  );
}
