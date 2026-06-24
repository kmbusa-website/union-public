"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Hash,
  MapPin,
  School,
  Search,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
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

function sortSubjects(stream: string | undefined, subjects: SubjectResult[]) {
  const order = stream ? SUBJECT_ORDER[stream] : null;
  if (!order) return subjects;
  return [...subjects].sort((a, b) => {
    const ai = order.indexOf(a.subjectCode ?? "");
    const bi = order.indexOf(b.subjectCode ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

function displaySubjectName(subject: SubjectResult, t: ReturnType<typeof useTranslations<"results">>) {
  const code = subject.subjectCode ?? "";
  const map: Record<string, string> = {
    PHY: t("subjects.PHY"),
    CHE: t("subjects.CHE"),
    MAT: t("subjects.MAT"),
    BIO: t("subjects.BIO"),
  };
  if (code && map[code]) return map[code];
  if (subject.subjectName) return subject.subjectName.toUpperCase();
  return code || "—";
}

function InfoItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="results-accent mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="results-subtle text-xs font-medium">{label}</p>
        <p
          className={
            highlight
              ? "results-accent mt-0.5 text-sm font-bold uppercase tracking-wide"
              : "mt-0.5 text-sm font-semibold"
          }
          style={{ color: highlight ? undefined : "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ResultDetail({ result }: { result: AlResult }) {
  const t = useTranslations("results");
  const subjects = sortSubjects(result.stream, result.subjectResults ?? []);

  return (
    <div className="results-panel relative shadow-lg">
      <span className="results-year-badge absolute right-5 top-5">
        {t("yearBadge", { year: result.examYear })}
      </span>

      <div
        className="border-b px-6 pb-8 pt-10 text-center"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="results-award-icon mx-auto">
          <Award className="results-accent h-10 w-10" strokeWidth={1.5} />
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-primary)" }}>
          {result.studentName}
        </h3>
        <p className="results-accent mt-1 text-sm font-medium">{t("examLabel")}</p>
      </div>

      <div
        className="grid gap-8 border-b p-6 sm:grid-cols-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="space-y-5">
          <InfoItem icon={User} label={t("labels.name")} value={result.studentName} />
          <InfoItem icon={Hash} label={t("labels.index")} value={result.indexNumber} />
          <InfoItem icon={School} label={t("labels.school")} value={result.schoolName ?? "—"} />
          {result.district && <InfoItem icon={MapPin} label={t("labels.district")} value={result.district} />}
        </div>
        <div className="space-y-5">
          <InfoItem icon={Trophy} label={t("labels.districtRank")} value={result.districtRank ?? "—"} />
          <InfoItem icon={BookOpen} label={t("labels.stream")} value={formatStream(result.stream)} highlight />
        </div>
      </div>

      <div className="p-6">
        <h4 className="results-accent flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <BarChart3 className="h-4 w-4" />
          {t("subjectResults")}
        </h4>
        <ul className="results-subject-list">
          {subjects.map((subject) => (
            <li
              key={subject.subjectCode ?? subject.subjectName}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
              <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
                {displaySubjectName(subject, t)}
              </span>
              <span className="results-grade-badge">{subject.grade ?? "—"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResultsSearchForm() {
  const t = useTranslations("results");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allResults, setAllResults] = useState<AlResult[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [query, setQuery] = useState(() => searchParams.get("query") ?? "");
  const [loading, setLoading] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState(() => searchParams.get("query") ?? "");

  useEffect(() => {
    let cancelled = false;
    loadAlResults()
      .then((data) => {
        if (!cancelled) setAllResults(data);
      })
      .catch(() => {
        if (!cancelled) {
          setDataError(t("dataError"));
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const searched = submittedQuery.trim().length > 0;
  const result = searched ? searchAlResults(allResults, submittedQuery)[0] : undefined;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setSubmittedQuery(trimmed);
    router.replace(`/results?query=${encodeURIComponent(trimmed)}`);
    setLoading(false);
  };

  if (dataLoading) {
    return (
      <div className="kit-container pb-16">
        <div className="kit-card flex min-h-100 items-center justify-center">
          <p className="results-muted">{t("loadingData")}</p>
        </div>
      </div>
    );
  }

  if (dataError || allResults.length === 0) {
    return (
      <div className="kit-container pb-16">
        <div className="kit-card max-w-2xl space-y-3">
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {t("noDataTitle")}
          </p>
          <p className="results-muted text-sm">
            {dataError || t("noDataHint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kit-container pb-16">
      <div className="results-hero">
        <div className="results-trophy-wrap">
          <Trophy className="h-11 w-11" strokeWidth={1.5} />
          <Sparkles className="absolute -right-0.5 -top-0.5 h-5 w-5 text-amber-500" />
        </div>
        <p className="results-hero-text">
          <span className="results-muted">{t("hardWork")} </span>
          <span className="results-highlight-success font-bold">{t("success")}</span>
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <form onSubmit={onSubmit} className="results-search-card">
          <h2 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            <Search className="results-search-icon h-5 w-5" />
            {t("findResults")}
          </h2>
          <p className="results-muted mt-1 text-sm">{t("searchHint")}</p>

          <div className="mt-5">
            <label className="results-field-label" htmlFor="search-query">
              {t("indexOrNic")}
            </label>
            <div className="results-search-row">
              <input
                id="search-query"
                name="query"
                className="results-search-input"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="26001"
              />
              <button type="submit" disabled={loading} className="results-search-btn">
                <Search className="h-4 w-4" />
                {loading ? t("searching") : t("searchButton")}
              </button>
            </div>
          </div>
        </form>

        <div className="min-h-95">
          {loading ? (
            <div className="results-panel flex min-h-105 items-center justify-center">
              <p className="results-muted">{t("searchingResults")}</p>
            </div>
          ) : !searched ? (
            <div className="results-empty-state min-h-105">
              <Search className="results-subtle mb-4 h-14 w-14" />
              <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                {t("placeholderTitle")}
              </p>
              <p className="results-muted mt-2 max-w-sm text-sm">
                {t("placeholderHint")}
              </p>
            </div>
          ) : !result ? (
            <div className="results-panel flex min-h-105 items-center justify-center p-8">
              <p className="results-muted text-center">{t("notFound")}</p>
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
  const t = useTranslations("results");
  return (
    <Suspense
      fallback={
        <div className="kit-container">
          <div className="kit-card flex min-h-100 items-center justify-center">
            <p className="results-muted">{t("loadingSearch")}</p>
          </div>
        </div>
      }
    >
      <ResultsSearchForm />
    </Suspense>
  );
}
