import { PageHero } from "@/components/kit/page-hero";
import { NewsList } from "@/components/pages/news-list";
import { getNews } from "@/lib/api";

export const revalidate = 60;

export default async function NewsPage() {
  const { content } = await getNews().catch(() => ({ content: [] }));
  return (
    <>
      <PageHero title="News &" highlight="Updates" subtitle="Latest announcements from KMBUSA." />
      <div className="kit-white-main">
        <NewsList articles={content} />
      </div>
    </>
  );
}
