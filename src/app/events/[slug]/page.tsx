import Link from "next/link";
import { format } from "date-fns";
import { PageHero } from "@/components/kit/page-hero";
import { getEventBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug).catch(() => null);
  if (!event) notFound();

  return (
    <>
      <PageHero title={event.title} subtitle={format(new Date(event.startAt), "PPP p")} />
      <div className="kit-white-main">
        <div className="kit-container max-w-3xl">
          {event.coverImageUrl && (
            <img src={event.coverImageUrl} alt="" className="mb-8 w-full rounded-xl shadow-md" />
          )}
          {event.location && <p className="text-slate-600">📍 {event.location}</p>}
          {event.description && <p className="mt-6 whitespace-pre-wrap text-slate-700">{event.description}</p>}
          <Link href="/events" className="mt-10 inline-block text-blue-600 hover:underline">
            ← Back to events
          </Link>
        </div>
      </div>
    </>
  );
}
