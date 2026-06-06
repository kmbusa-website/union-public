"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { getPastPaperDownloadUrl, getPastPapers } from "@/lib/api";
import { POPULAR_SUBJECTS } from "@/lib/brand";
import type { PastPaper } from "@/lib/types/api";

export function PastPapersTable() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [subject, setSubject] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    getPastPapers({ examYear: year ? Number(year) : undefined, medium: medium || undefined })
      .then((p) => setPapers(p.content))
      .catch(() => setPapers([]));
  }, [year, medium]);

  const filtered = useMemo(() => {
    let list = papers;
    if (subject) list = list.filter((p) => p.subjectName.toLowerCase().includes(subject.toLowerCase()));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s) || p.subjectName.toLowerCase().includes(s));
    }
    return list;
  }, [papers, subject, q]);

  return (
    <div className="kit-container">
      <div className="mb-6 flex flex-wrap gap-3">
        <input className="kit-input w-36" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="kit-input w-28" type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <select className="kit-input w-36" value={medium} onChange={(e) => setMedium(e.target.value)}>
          <option value="">All mediums</option>
          <option value="ENGLISH">English</option>
          <option value="SINHALA">Sinhala</option>
          <option value="TAMIL">Tamil</option>
        </select>
        <input className="kit-input flex-1 min-w-[160px]" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="kit-card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Medium</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.subjectName}</td>
                <td className="px-4 py-3">{p.examYear}</td>
                <td className="px-4 py-3">{p.medium}</td>
                <td className="px-4 py-3">
                  <FileText className="inline h-4 w-4 text-red-500" /> PDF
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={async () => window.open(await getPastPaperDownloadUrl(p.id), "_blank")}
                  >
                    <Download className="inline h-4 w-4" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <p className="font-semibold text-slate-900">Popular Subjects</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {POPULAR_SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:border-blue-400 hover:text-blue-600"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
