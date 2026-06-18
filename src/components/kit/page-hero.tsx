interface PageHeroProps {
  title: string;
  highlight?: string;
  subtitle?: string;
}

export function PageHero({ title, highlight, subtitle }: PageHeroProps) {
  return (
    <div className="kit-page-hero">
      <div className="kit-container !py-0">
        <h1 className="kit-page-hero-title">
          {title}
          {highlight && <span className="text-[var(--blue)]"> {highlight}</span>}
        </h1>
        {subtitle && <p className="kit-page-hero-sub">{subtitle}</p>}
      </div>
    </div>
  );
}
