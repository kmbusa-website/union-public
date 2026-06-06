import { PageHero } from "@/components/kit/page-hero";
import { EventsList } from "@/components/pages/events-list";
import { getUpcomingEvents } from "@/lib/api";

export const revalidate = 60;

export default async function EventsPage() {
  const { content } = await getUpcomingEvents().catch(() => ({ content: [] }));
  return (
    <>
      <PageHero title="Upcoming" highlight="Events" subtitle="Workshops, seminars, and community gatherings." />
      <div className="kit-white-main">
        <EventsList events={content} />
      </div>
    </>
  );
}
