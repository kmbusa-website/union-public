"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LOGO_PATH } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const t = useTranslations("brand");
  return (
    <Link href="/" className={cn("group flex shrink-0 items-center gap-3", className)}>
      <Image
        src={LOGO_PATH}
        alt={t("orgShort")}
        width={48}
        height={48}
        className="site-logo-mark h-11 w-11 shrink-0 rounded-full object-contain ring-2 ring-[var(--gold)]/30 transition group-hover:ring-[var(--gold)]/60"
        priority
      />
      <div className="hidden leading-tight sm:block">
        <span
          className="site-logo-short block text-sm font-bold tracking-wide not-italic"
          style={{ color: "var(--text-nav-active)" }}
        >
          {t("orgShort")}
        </span>
        <span
          className="site-logo-org block max-w-[20rem] whitespace-normal font-medium leading-snug sm:max-w-[22rem] xl:max-w-[14rem] text-[10px]"
          style={{ color: "var(--text-nav)" }}
        >
          {t("orgName")}
        </span>
      </div>
    </Link>
  );
}
