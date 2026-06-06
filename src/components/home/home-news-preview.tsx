import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { News } from "@/lib/types/api";

export function HomeNewsPreview({ articles }: { articles: News[] }) {
  if (!articles.length) return null;
  const [featured, ...rest] = articles;

  return (
    <section className="kit-white-main border-t border-slate-200">
      <div className="kit-container">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="kit-section-title">Latest News</h2>
            <p className="kit-section-sub">Announcements and stories from our community</p>
          </div>
          <Link href="/news" className="hidden items-center gap-1 text-sm font-medium text-blue-600 hover:underline sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Link href={`/news/${featured.slug}`} className="kit-card-hover overflow-hidden p-0">
            <div className="aspect-video bg-slate-200">
              {featured.featuredImage ? (
                <img src={featured.featuredImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl font-bold text-slate-300">
                  {featured.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-6">
              {featured.categoryName && <span className="kit-badge">{featured.categoryName}</span>}
              <h3 className="mt-2 text-xl font-bold text-slate-900">{featured.title}</h3>
              <p className="mt-2 line-clamp-2 text-slate-600">{featured.excerpt}</p>
            </div>
          </Link>
          <div className="space-y-4">
            {rest.slice(0, 3).map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="kit-card-hover flex gap-4 p-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {a.featuredImage && <img src={a.featuredImage} alt="" className="h-full w-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{a.title}</h3>
                  {a.publishedAt && (
                    <p className="mt-1 text-xs text-slate-500">{format(new Date(a.publishedAt), "MMM d, yyyy")}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
