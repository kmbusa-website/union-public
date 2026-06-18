"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { TopBar } from "@/components/layout/top-bar";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/committee", key: "committee" },
  { href: "/events", key: "events" },
  { href: "/pastpapers", key: "pastpapers" },
  { href: "/gallery", key: "gallery" },
  { href: "/results", key: "results" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <TopBar />
      <div className="site-header-accent" aria-hidden />
      <div className="site-nav-bar">
        <div className="site-nav-inner">
          <Logo />

          <nav className="site-nav-links" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn("nav-link", active(l.href) && "nav-link-active")}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="site-nav-actions">
            <LanguageToggle />
            <ThemeToggle />
            <button
              type="button"
              className="site-nav-menu-btn"
              onClick={() => setOpen(!open)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="site-mobile-nav" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "site-mobile-nav-link",
                  active(l.href) && "site-mobile-nav-link--active",
                )}
                onClick={() => setOpen(false)}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
