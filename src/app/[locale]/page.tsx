import { HomeHero } from "@/components/home/home-hero";
import { HomeQuickLinks } from "@/components/home/home-quick-links";
import { HomeCommitteePreview } from "@/components/home/home-committee-preview";
import { HomeHighlights } from "@/components/home/home-highlights";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <HomeQuickLinks />
      <HomeHighlights />
      <HomeCommitteePreview />
    </>
  );
}
