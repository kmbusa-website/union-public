import { HomeHero } from "@/components/home/home-hero";
import { HomeNewsPreview } from "@/components/home/home-news-preview";
import { HomeQuickLinks } from "@/components/home/home-quick-links";
import { getFeaturedNews } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const news = await getFeaturedNews().catch(() => []);
  return (
    <>
      <HomeHero />
      <HomeQuickLinks />
      <HomeNewsPreview articles={news.slice(0, 4)} />
    </>
  );
}
