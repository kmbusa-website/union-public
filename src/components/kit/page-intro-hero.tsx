export interface PageIntroHeroProps {
  overline: string;
  title: string;
  titleHighlight: string;
  lead: string;
  leadSecondary?: string;
}

export function PageIntroHero({
  overline,
  title,
  titleHighlight,
  lead,
  leadSecondary,
}: PageIntroHeroProps) {
  return (
    <section className="page-intro-hero relative overflow-hidden text-center">
      <div className="page-intro-hero-dots page-intro-hero-dots--left pointer-events-none" aria-hidden />
      <div className="page-intro-hero-dots page-intro-hero-dots--right pointer-events-none" aria-hidden />
      <div className="page-intro-hero-curve" aria-hidden />

      <div className="kit-container relative z-10 pb-20 pt-14 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-2xl">
          <p className="page-intro-overline">{overline}</p>
          <h1 className="page-intro-title mt-4">
            {title} <span className="page-intro-title-accent">{titleHighlight}</span>
          </h1>
          <div className="page-intro-title-rule mx-auto" aria-hidden />
          <p className="page-intro-lead mt-6 leading-relaxed">{lead}</p>
          {leadSecondary && (
            <p className="page-intro-lead mt-2 leading-relaxed">{leadSecondary}</p>
          )}
        </div>
      </div>
    </section>
  );
}
