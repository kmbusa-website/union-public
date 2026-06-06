import { PageHero } from "@/components/kit/page-hero";
import { PastPapersTable } from "@/components/pages/past-papers-table";

export default function PastPapersPage() {
  return (
    <>
      <PageHero title="Past Papers" highlight="Repository" subtitle="Download A/L past papers by subject and year." />
      <div className="kit-white-main">
        <PastPapersTable />
      </div>
    </>
  );
}
