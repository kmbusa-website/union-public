import { PageHero } from "@/components/kit/page-hero";
import { EventsList } from "@/components/pages/events-list";

export default function EventsPage() {
  return (
    <>
      <PageHero title="Upcoming" highlight="Events" subtitle="Workshops, seminars, and community gatherings." />
      <div className="kit-page-main">
        <EventsList events={[]} />
      </div>
    </>
  );
}
