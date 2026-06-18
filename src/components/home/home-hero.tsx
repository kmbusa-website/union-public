"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, GraduationCap, Handshake, Medal, BarChart3, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HERO_BANNER_IMAGE, LOGO_PATH, ORG_SHORT, STATS } from "@/lib/brand";

const statKeys = ["statsMembers", "statsPrograms", "statsEvents", "statsGoal"] as const;

const statIcons = {
  users: Users,
  graduation: GraduationCap,
  calendar: CalendarDays,
  medal: Medal,
} as const;

function HeroTitleLines({ text, className }: { text: string; className: string }) {
  return (
    <>
      {text.split("\n").map((line) => (
        <span key={line} className={`block ${className}`}>
          {line}
        </span>
      ))}
    </>
  );
}

export function HomeHero() {
  const locale = useLocale();
  const t = useTranslations("home");
  const titleSize =
    locale === "ta"
      ? "text-[1.05rem] min-[380px]:text-[1.15rem] sm:text-2xl lg:text-[1.75rem] xl:text-[2rem]"
      : "text-[1.2rem] min-[380px]:text-[1.35rem] sm:text-4xl lg:text-[2.35rem] xl:text-[2.75rem]";

  return (
    <section className="home-hero">
      <div className="home-hero-main">
        <Image
          src={HERO_BANNER_IMAGE}
          alt="KMBUSA"
          fill
          className="home-hero-banner-image object-cover object-[72%_center] lg:object-left"
          priority
          sizes="100vw"
        />

        <div className="home-hero-content">
          <div className="home-hero-panel-left flex flex-col justify-center px-4 py-6 sm:px-10 sm:py-14 lg:px-12 lg:py-10 xl:px-14">
            <h1 className={`max-w-full font-extrabold leading-[1.1] tracking-tight ${titleSize}`}>
              <HeroTitleLines text={t("heroLine1")} className="text-white" />
              <HeroTitleLines text={t("heroLine2")} className="text-[var(--gold)]" />
            </h1>

            <div className="mt-3 flex justify-start sm:mt-6">
              <div className="home-hero-badge">
                <span className="home-hero-badge-line" aria-hidden />
                <span className="home-hero-badge-dot home-hero-badge-dot--gold" aria-hidden />
                <span className="not-italic">{ORG_SHORT}</span>
                <span className="home-hero-badge-dot home-hero-badge-dot--gold" aria-hidden />
                <span className="home-hero-badge-line" aria-hidden />
              </div>
            </div>

            <div className="home-hero-tagline-row mt-4 max-w-md sm:mt-8">
              <div className="home-hero-tagline-icon">
                <Image
                  src={LOGO_PATH}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-contain"
                  aria-hidden
                />
              </div>
              <span className="home-hero-tagline-rule" aria-hidden />
              <p className="text-xs leading-snug text-slate-100 sm:text-base sm:leading-relaxed">{t("heroTagline")}</p>
            </div>

            <div className="home-hero-actions mt-4 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3 md:gap-4">
              <Link href="/events" className="kit-btn-primary home-hero-action-btn">
                <Users className="h-4 w-4" />
                {t("exploreActivities")}
              </Link>
              <Link href="/contact" className="home-hero-btn-join home-hero-action-btn">
                <Handshake className="h-4 w-4" />
                {t("joinUs")}
              </Link>
              <Link href="/results" className="kit-btn-primary home-hero-action-btn">
                <BarChart3 className="h-4 w-4" />
                {t("viewResults")}
              </Link>
            </div>
          </div>

          <div className="home-hero-panel-right hidden lg:block" aria-hidden />
        </div>
      </div>

      <div className="home-hero-stats-bar">
        <div className="home-hero-stats">
          {STATS.map((stat, i) => {
            const Icon = statIcons[stat.icon];
            return (
              <div key={statKeys[i]} className="home-hero-stat">
                <div className="home-hero-stat-icon">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="home-hero-stat-copy">
                  <p className="home-hero-stat-value not-italic">{stat.value}</p>
                  <p className="home-hero-stat-label">{t(statKeys[i])}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
