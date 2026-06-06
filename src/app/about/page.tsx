import Image from "next/image";
import { Target, Eye, Heart, Flag } from "lucide-react";
import { PageHero } from "@/components/kit/page-hero";
import { getSitePage } from "@/lib/api";
import { ABOUT_VALUES, HERO_CAMPUS_IMAGE, MILESTONES } from "@/lib/brand";

export const revalidate = 120;

const icons = [Target, Eye, Heart, Flag];

export default async function AboutPage() {
  const page = await getSitePage("about").catch(() => null);

  return (
    <>
      <PageHero title="About" highlight="KMBUSA" subtitle="Learn about our mission and community." />
      <div className="kit-white-main">
        <div className="kit-container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  page?.content ??
                  "<p>We unite Maths and Bio university students in Kilinochchi — supporting academic growth, events, and community outreach.</p>",
              }}
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
              <Image src={HERO_CAMPUS_IMAGE} alt="Campus" fill className="object-cover" sizes="50vw" />
            </div>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_VALUES.map((v, i) => {
              const Icon = icons[i] ?? Target;
              return (
                <div key={v.title} className="kit-card text-center">
                  <Icon className="mx-auto h-10 w-10 text-blue-600" strokeWidth={1.5} />
                  <h3 className="mt-4 font-semibold text-slate-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{v.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MILESTONES.map((m) => (
              <div key={m.label} className="kit-card text-center">
                <p className="text-2xl font-bold text-blue-600">{m.value}</p>
                <p className="mt-1 text-sm text-slate-600">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
