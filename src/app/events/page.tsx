import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { EventsList } from "@/components/pages/events-list";
import { EVENTS_HERO_IMAGE, EVENTS_INTRO } from "@/lib/brand";

export default function EventsPage() {
  return (
    <>
      <PageIntroHero
        overline="Activities"
        title="Our"
        titleHighlight="Events"
        lead={EVENTS_INTRO}
        imageSrc={EVENTS_HERO_IMAGE}
        imageAlt="KMBUSA event"
        cta={{ href: "#events-list", label: "Browse Events" }}
      />
      <div id="events-list" className="kit-page-main scroll-mt-28">
        <EventsList />
      </div>
    </>
  );
}
