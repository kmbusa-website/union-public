"use client";

import { useTranslations } from "next-intl";
import { BarChart3, CalendarDays, ImageIcon, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";

const links = [
  { href: "/events", labelKey: "quickEvents", subKey: "quickEventsSub", icon: CalendarDays },
  { href: "/results", labelKey: "quickResults", subKey: "quickResultsSub", icon: BarChart3 },
  { href: "/gallery", labelKey: "quickGallery", subKey: "quickGallerySub", icon: ImageIcon },
  { href: "/committee", labelKey: "quickCommittee", subKey: "quickCommitteeSub", icon: Users },
] as const;

export function HomeQuickLinks() {
  const t = useTranslations("home");

  return (
    <section className="kit-page-main">
      <div className="kit-container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="kit-card-hover flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <item.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {t(item.labelKey)}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t(item.subKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
