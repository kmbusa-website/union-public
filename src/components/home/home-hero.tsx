"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HERO_CAMPUS_IMAGE, LOGO_PATH, STATS } from "@/lib/brand";

const statKeys = ["statsMembers", "statsPrograms", "statsEvents"] as const;

export function HomeHero() {
  const t = useTranslations("home");
  const tb = useTranslations("brand");

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image src={HERO_CAMPUS_IMAGE} alt={tb("orgShort")} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0a192f]/95 via-[#0a192f]/75 to-[#0a192f]/40" />
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            {t("welcome", { org: tb("orgShort") })}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("heroLine1")}
            <br />
            {t("heroLine2")} <span className="text-blue-400">{t("heroHighlight")}</span>
          </h1>
          <p className="mt-6 text-lg text-slate-200">{tb("tagline")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/events" className="kit-btn-primary">
              <CalendarDays className="h-4 w-4" />
              {t("exploreEvents")}
            </Link>
            <Link href="/results" className="kit-btn-outline">
              {t("viewResults")}
            </Link>
          </div>
        </div>
        <div className="relative mx-auto mt-12 hidden shrink-0 lg:mt-0 lg:block">
          <div className="rounded-full p-2 ring-4 ring-amber-400/80 ring-offset-4 ring-offset-transparent">
            <Image src={LOGO_PATH} alt={tb("orgShort")} width={220} height={220} className="rounded-full object-contain" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 kit-dark-band border-t border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10 px-4 py-6 sm:px-6 lg:px-8">
          {STATS.map((s, i) => (
            <div key={statKeys[i]} className="flex flex-col items-center px-4 text-center sm:flex-row sm:gap-3 sm:text-left">
              <span className="text-2xl font-bold text-white sm:text-3xl">{s.value}</span>
              <span className="text-sm text-slate-300">{t(statKeys[i])}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
