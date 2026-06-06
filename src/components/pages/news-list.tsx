"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { NEWS_FILTERS } from "@/lib/brand";
import type { News } from "@/lib/types/api";

export function NewsList({ articles }: { articles: News[] }) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = articles;
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          a.excerpt?.toLowerCase().includes(s) ||
          a.content?.toLowerCase().includes(s)
      );
    }
    if (filter !== "All") {
      list = list.filter((a) => a.categoryName?.toLowerCase().includes(filter.toLowerCase()) || filter === "Announcements");
    }
    return list;
  }, [articles, filter, q]);

  return (
    <div className="kit-container">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {NEWS_FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={filter === f ? "kit-filter-active" : "kit-filter"}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="kit-input pl-10" placeholder="Search news..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link key={a.id} href={`/news/${a.slug}`} className="kit-card-hover overflow-hidden p-0">
            <div className="aspect-video bg-slate-100">
              {a.featuredImage ? (
                <img src={a.featuredImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl text-slate-300">{a.title.charAt(0)}</div>
              )}
            </div>
            <div className="p-5">
              {a.categoryName && <span className="kit-badge">{a.categoryName}</span>}
              <h3 className="mt-2 font-semibold text-slate-900">{a.title}</h3>
              {a.publishedAt && (
                <p className="mt-1 text-xs text-slate-500">{format(new Date(a.publishedAt), "PPP")}</p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{a.excerpt}</p>
              <span className="mt-3 inline-flex text-sm font-medium text-blue-600">Read More →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
