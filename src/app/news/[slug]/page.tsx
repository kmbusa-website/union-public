import Link from "next/link";
import { format } from "date-fns";
import { PageHero } from "@/components/kit/page-hero";
import { getNewsBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug).catch(() => null);
  if (!article) notFound();

  return (
    <>
      <PageHero title={article.title} subtitle={article.publishedAt ? format(new Date(article.publishedAt), "PPP") : undefined} />
      <div className="kit-white-main">
        <div className="kit-container max-w-3xl">
          {article.featuredImage && (
            <img src={article.featuredImage} alt="" className="mb-8 w-full rounded-xl shadow-md" />
          )}
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          <Link href="/news" className="mt-10 inline-block text-blue-600 hover:underline">
            ← Back to news
          </Link>
        </div>
      </div>
    </>
  );
}
