"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays, GraduationCap, Handshake, Medal, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HERO_CAMPUS_IMAGE, LOGO_PATH, ORG_SHORT, STATS } from "@/lib/brand";

const statKeys = ["statsMembers", "statsPrograms", "statsEvents", "statsGoal"] as const;

const statIcons = {
  users: Users,
  graduation: GraduationCap,
  calendar: CalendarDays,
  medal: Medal,
} as const;

export function HomeHero() {
  const t = useTranslations("home");
  const tb = useTranslations("brand");

  return (
    <section className="home-hero">
      <div className="home-hero-main relative lg:grid lg:min-h-[34rem] lg:grid-cols-2 xl:min-h-[38rem]">
        {/* Left — copy */}
        <div className="home-hero-panel-left relative z-10 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-12 lg:py-20 xl:px-16">
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-lg xl:max-w-xl">
            <div className="mb-6 flex justify-start lg:hidden">
              <div className="home-hero-logo-ring home-hero-logo-ring--mobile rounded-full bg-white p-1">
                <Image
                  src={LOGO_PATH}
                  alt={tb("orgShort")}
                  width={72}
                  height={72}
                  className="rounded-full object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="max-w-full text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-white min-[400px]:text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
              {t("heroLine1")}
              <br />
              <span className="text-[var(--gold)]">{t("heroLine2")}</span>
            </h1>

            <div className="mt-6 flex justify-start">
              <div className="home-hero-badge">
                <span className="home-hero-badge-line" aria-hidden />
                <span className="home-hero-badge-dot" aria-hidden />
                <span>{ORG_SHORT}</span>
                <span className="home-hero-badge-dot" aria-hidden />
                <span className="home-hero-badge-line" aria-hidden />
              </div>
            </div>

            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-200 sm:text-lg">
              {t("heroTagline")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/events" className="kit-btn-primary">
                <Users className="h-4 w-4" />
                {t("exploreActivities")}
              </Link>
              <Link href="/contact" className="home-hero-btn-join">
                <Handshake className="h-4 w-4" />
                {t("joinUs")}
              </Link>
            </div>
          </div>
        </div>

        {/* Right — campus / hospital image */}
        <div className="home-hero-panel-right relative">
          <Image
            src={HERO_CAMPUS_IMAGE}
            alt={tb("orgShort")}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[var(--navy)]/80 via-[var(--navy)]/25 to-transparent lg:from-[var(--navy)]/70 lg:via-transparent" />
        </div>

        {/* Center logo — desktop */}
        <div className="pointer-events-none absolute left-1/2 top-[42%] z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="home-hero-logo-ring rounded-full bg-white p-1.5">
            <Image
              src={LOGO_PATH}
              alt={tb("orgShort")}
              width={200}
              height={200}
              className="rounded-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="home-hero-wave" aria-hidden />
      </div>

      <div className="home-hero-stats-section">
        <div className="home-hero-stats">
          {STATS.map((stat, i) => {
            const Icon = statIcons[stat.icon];
            return (
              <div key={statKeys[i]} className="home-hero-stat">
                <div className="home-hero-stat-icon">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="home-hero-stat-copy">
                  <p className="home-hero-stat-value">{stat.value}</p>
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
