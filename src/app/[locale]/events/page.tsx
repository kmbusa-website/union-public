import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { EventsList } from "@/components/pages/events-list";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
      />
      <div id="events-list" className="kit-page-main scroll-mt-28">
        <EventsList />
      </div>
    </>
  );
}
