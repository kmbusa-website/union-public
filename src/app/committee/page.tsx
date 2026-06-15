import { PageHero } from "@/components/kit/page-hero";
import { CommitteeMembers } from "@/components/pages/committee-members";

export default function CommitteePage() {
  return (
    <>
      <PageHero
        title="Executive"
        highlight="Committee"
        subtitle="Kilinochchi Maths Bio University Students' Association — leadership and members."
      />
      <div className="kit-page-main">
        <CommitteeMembers />
      </div>
    </>
  );
}
