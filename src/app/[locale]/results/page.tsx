import { setRequestLocale } from "next-intl/server";
import { ResultsSearch } from "@/components/pages/results-search";

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="kit-page-main min-h-[calc(100vh-8rem)]">
      <ResultsSearch />
    </div>
  );
}
