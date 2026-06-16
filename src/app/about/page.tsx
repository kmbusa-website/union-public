import { Target, Eye, Heart, Flag } from "lucide-react";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { ABOUT_INTRO, ABOUT_VALUES, MILESTONES, ORG_SHORT } from "@/lib/brand";

const icons = [Target, Eye, Heart, Flag];

export default function AboutPage() {
  return (
    <>
      <PageIntroHero
        overline={`About ${ORG_SHORT}`}
        title="About"
        titleHighlight={ORG_SHORT}
        lead={ABOUT_INTRO}
      />

      <div className="kit-page-main">
        <div id="mission-vision" className="kit-container scroll-mt-28 pb-16">
          <div className="mb-10 text-center">
            <p className="page-intro-overline">What we stand for</p>
            <h2 className="page-intro-title mt-3 text-3xl sm:text-4xl">
              Mission, Vision <span className="page-intro-title-accent">&amp; Values</span>
            </h2>
            <div className="page-intro-title-rule mx-auto" aria-hidden />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_VALUES.map((v, i) => {
              const Icon = icons[i] ?? Target;
              return (
                <div key={v.title} className="kit-card text-center">
                  <Icon className="page-intro-title-accent mx-auto h-10 w-10" strokeWidth={1.5} />
                  <h3 className="mt-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MILESTONES.map((m) => (
              <div key={m.label} className="kit-card text-center">
                <p className="page-intro-title-accent text-2xl font-bold">{m.value}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
