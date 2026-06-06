import { PageHero } from "@/components/kit/page-hero";
import { ResultsSearch } from "@/components/pages/results-search";

export default function ResultsPage() {
  return (
    <>
      <PageHero title="A/L" highlight="Results" subtitle="Check your G.C.E. Advanced Level examination results." />
      <div className="kit-white-main">
        <ResultsSearch />
      </div>
    </>
  );
}
