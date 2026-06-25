import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ResultsSearch } from "@/components/pages/results-search";
import { ResultsComingSoon } from "@/components/pages/results-coming-soon";

const RESULTS_ENABLED = process.env.NEXT_PUBLIC_RESULTS_ENABLED === "true";

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!RESULTS_ENABLED) {
    const t = await getTranslations("results");
    return (
      <div className="kit-page-main min-h-[calc(100vh-8rem)]">
        <ResultsComingSoon
          title={t("comingSoonTitle")}
          subtitle={t("comingSoonSubtitle")}
          hint={t("comingSoonHint")}
        />
      </div>
    );
  }

  return (
    <div className="kit-page-main min-h-[calc(100vh-8rem)]">
      <ResultsSearch />
    </div>
  );
}
