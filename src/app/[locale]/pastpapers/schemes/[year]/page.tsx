import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { SchemeYearView } from "@/components/pages/scheme-year-view";
import { loadSchemeYears, loadSchemesByYear } from "@/lib/data/schemes";

export async function generateStaticParams() {
  const years = await loadSchemeYears();
  return years.map((year) => ({ year: String(year) }));
}

export default async function SchemeYearPage({ params }: { params: Promise<{ locale: string; year: string }> }) {
  const { locale, year } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schemes");
  const numericYear = Number(year);
  if (!Number.isFinite(numericYear)) {
    notFound();
  }

  const years = await loadSchemeYears();
  if (!years.includes(numericYear)) {
    notFound();
  }

  const papers = await loadSchemesByYear(numericYear);

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={`${numericYear}`}
        titleHighlight={t("yearTitleHighlight")}
        lead=""
      />

      <div className="kit-page-main">
        <SchemeYearView year={numericYear} papers={papers} />
      </div>
    </>
  );
}
