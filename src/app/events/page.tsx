import { PageHero } from "@/components/kit/page-hero";
import { EventsList } from "@/components/pages/events-list";

export default function EventsPage() {
  return (
    <>
      <PageHero title="Our" highlight="Events" subtitle="Seminars, cultural events, and union activities over the years." />
      <div className="kit-page-main">
        <EventsList />
      </div>
    </>
  );
}
