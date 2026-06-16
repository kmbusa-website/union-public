import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { CommitteeMembers } from "@/components/pages/committee-members";
import { COMMITTEE_INTRO } from "@/lib/brand";

export default function CommitteePage() {
  return (
    <>
      <PageIntroHero
        overline="Leadership"
        title="Executive"
        titleHighlight="Committee"
        lead={COMMITTEE_INTRO}
      />
      <div id="committee-members" className="kit-page-main scroll-mt-28">
        <CommitteeMembers />
      </div>
    </>
  );
}
