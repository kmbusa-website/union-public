import { HomeHero } from "@/components/home/home-hero";
import { HomeQuickLinks } from "@/components/home/home-quick-links";
import { HomeCommitteePreview } from "@/components/home/home-committee-preview";
import { HomeHighlights } from "@/components/home/home-highlights";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeQuickLinks />
      <HomeHighlights />
      <HomeCommitteePreview />
    </>
  );
}
