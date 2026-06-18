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
      ? "text-[1.3rem] min-[400px]:text-xl sm:text-2xl lg:text-[1.75rem] xl:text-[2rem]"
      : "text-[1.65rem] min-[400px]:text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-[2.75rem]";

  return (
    <section className="home-hero">
      <div className="home-hero-main">
        <Image
          src={HERO_BANNER_IMAGE}
          alt="KMBUSA"
          fill
          className="home-hero-banner-image object-cover object-left"
          priority
          sizes="100vw"
        />

        <div className="home-hero-content">
          <div className="home-hero-panel-left flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-10 xl:px-14">
            <h1 className={`max-w-full font-extrabold leading-[1.12] tracking-tight ${titleSize}`}>
              <HeroTitleLines text={t("heroLine1")} className="text-white" />
              <HeroTitleLines text={t("heroLine2")} className="text-[var(--gold)]" />
            </h1>

            <div className="mt-6 flex justify-start">
              <div className="home-hero-badge">
                <span className="home-hero-badge-line" aria-hidden />
                <span className="home-hero-badge-dot home-hero-badge-dot--gold" aria-hidden />
                <span className="not-italic">{ORG_SHORT}</span>
                <span className="home-hero-badge-dot home-hero-badge-dot--gold" aria-hidden />
                <span className="home-hero-badge-line" aria-hidden />
              </div>
            </div>

            <div className="home-hero-tagline-row mt-8 max-w-md">
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
              <p className="text-sm leading-relaxed text-slate-100 sm:text-base">{t("heroTagline")}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/events" className="kit-btn-primary">
                <Users className="h-4 w-4" />
                {t("exploreActivities")}
              </Link>
              <Link href="/contact" className="home-hero-btn-join">
                <Handshake className="h-4 w-4" />
                {t("joinUs")}
              </Link>
              <Link href="/results" className="kit-btn-primary">
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
