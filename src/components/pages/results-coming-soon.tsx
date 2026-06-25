"use client";

import { Clock } from "lucide-react";

interface ResultsComingSoonProps {
  title: string;
  subtitle: string;
  hint: string;
}

export function ResultsComingSoon({ title, subtitle, hint }: ResultsComingSoonProps) {
  return (
    <div className="kit-container flex min-h-[calc(100vh-12rem)] items-center justify-center pb-16">
      <div className="results-panel mx-auto w-full max-w-lg py-16 text-center shadow-lg">
        <div className="results-award-icon mx-auto">
          <Clock className="results-accent h-10 w-10" strokeWidth={1.5} />
        </div>

        <div className="results-year-badge mx-auto mt-6 inline-block">2026</div>

        <h2
          className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        <p className="results-accent mt-3 text-base font-semibold">{subtitle}</p>

        <p className="results-muted mx-auto mt-4 max-w-xs text-sm">{hint}</p>
      </div>
    </div>
  );
}
