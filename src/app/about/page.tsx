import Image from "next/image";
import { Target, Eye, Heart, Flag } from "lucide-react";
import { PageHero } from "@/components/kit/page-hero";
import { ABOUT_INTRO, ABOUT_VALUES, HERO_CAMPUS_IMAGE, MILESTONES } from "@/lib/brand";

const icons = [Target, Eye, Heart, Flag];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About" highlight="KMBUSA" subtitle="Learn about our mission and community." />
      <div className="kit-page-main">
        <div className="kit-container pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-4" style={{ color: "var(--text-secondary)" }}>
              {ABOUT_INTRO.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
              <Image src={HERO_CAMPUS_IMAGE} alt="KMBUSA campus" fill className="object-cover" sizes="50vw" />
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_VALUES.map((v, i) => {
              const Icon = icons[i] ?? Target;
              return (
                <div key={v.title} className="kit-card text-center">
                  <Icon className="mx-auto h-10 w-10 text-cyan-400" strokeWidth={1.5} />
                  <h3 className="mt-4 font-semibold" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{v.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MILESTONES.map((m) => (
              <div key={m.label} className="kit-card text-center">
                <p className="text-2xl font-bold text-cyan-400">{m.value}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
