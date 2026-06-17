import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarDays, ImageIcon, Images } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { EventPhotosGrid } from "@/components/pages/event-photos-grid";
import { loadEventBySlug, loadEventSlugs } from "@/lib/data/events";

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function generateStaticParams() {
  const slugs = await loadEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const data = await loadEventBySlug(slug);

  if (!data) {
    return { title: "Event not found" };
  }

  return {
    title: `${data.event.title} | Events`,
    description: data.event.description,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const data = await loadEventBySlug(slug);

  if (!data) {
    notFound();
  }

  const { event, photos } = data;
  const hasCover = Boolean(event.imageUrl?.trim());

  return (
    <>
      <PageIntroHero
        overline={t("detailsOverline")}
        title={event.title}
        titleHighlight={String(event.year)}
        lead={event.description || t("detailsIntro")}
      />

      <div className="kit-container -mt-12 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-3xl border shadow-xl" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            {hasCover ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full max-h-[520px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-cyan-400/20 via-slate-500/10 to-indigo-500/20">
                <ImageIcon className="h-20 w-20 text-cyan-300" />
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-4 rounded-3xl border p-6 shadow-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{t(`categories.${event.category}`)}</p>
              <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{event.title}</h2>
            </div>

            <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-cyan-400" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Images className="h-4 w-4 text-cyan-400" />
                <span>{photos.length} {t("photoCount")}</span>
              </div>
            </div>

            {event.description && (
              <p className="rounded-2xl border p-4 text-sm leading-6" style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                {event.description}
              </p>
            )}

            <Link
              href="/events"
              className="mt-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
              style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToEvents")}
            </Link>
          </aside>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">{t("allPhotos")}</p>
              <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{t("photosHeading")}</h2>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {photos.length ? `${photos.length} ${t("photoCount")}` : t("noPhotos")}
            </p>
          </div>

          <EventPhotosGrid photos={photos} />
        </section>
      </div>
    </>
  );
}
