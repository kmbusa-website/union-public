import { notFound } from "next/navigation";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { loadPastPaperYears, loadPastPapersByYear } from "@/lib/data/pastpapers";
import { setRequestLocale } from "next-intl/server";
import { PastPaperYearView } from "@/components/pages/pastpaper-year-view";

export async function generateStaticParams() {
  const years = await loadPastPaperYears();
  return years.map((year) => ({ year: String(year) }));
}

export default async function PastPaperYearPage({ params }: { params: Promise<{ locale: string; year: string }> }) {
  const { locale, year } = await params;
  setRequestLocale(locale);
  const numericYear = Number(year);
  if (!Number.isFinite(numericYear)) {
    notFound();
  }

  const years = await loadPastPaperYears();
  if (!years.includes(numericYear)) {
    notFound();
  }

  const papers = await loadPastPapersByYear(numericYear);

  return (
    <>
      <PageIntroHero
        overline="Exams"
        title={`${numericYear}`}
        titleHighlight="Past Papers"
        lead=""
      />
      <div className="kit-page-main">
        <PastPaperYearView year={numericYear} papers={papers} />
      </div>
    </>
  );
}
