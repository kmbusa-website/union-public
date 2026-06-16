import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageIntroHeroProps {
  overline: string;
  title: string;
  titleHighlight: string;
  lead: string;
  imageSrc: string;
  imageAlt: string;
  cta?: { href: string; label: string };
  imageFit?: "cover" | "contain";
  priority?: boolean;
}

export function PageIntroHero({
  overline,
  title,
  titleHighlight,
  lead,
  imageSrc,
  imageAlt,
  cta,
  imageFit = "cover",
  priority = false,
}: PageIntroHeroProps) {
  return (
    <section className="page-intro-hero relative overflow-hidden">
      <div
        className="page-intro-hero-dots pointer-events-none absolute right-0 top-0 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96"
        aria-hidden
      />

      <div className="kit-container relative pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-xl">
            <p className="page-intro-overline">{overline}</p>
            <h1 className="page-intro-title mt-4">
              {title} <span className="page-intro-title-accent">{titleHighlight}</span>
            </h1>
            <div className="page-intro-title-rule" aria-hidden />
            <p className="page-intro-lead mt-6 leading-relaxed">{lead}</p>
            {cta && (
              <Link href={cta.href} className="page-intro-btn-outline mt-8">
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="relative">
            <div
              className="page-intro-image-wrap relative aspect-[4/3] overflow-hidden"
              style={imageFit === "contain" ? { background: "var(--bg-page)" } : undefined}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={cn(imageFit === "contain" ? "object-contain p-2" : "object-cover")}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={priority}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
