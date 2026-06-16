"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { TopBar } from "@/components/layout/top-bar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/committee", label: "Committee" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/results", label: "A/L Results" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors"
      style={{ background: "var(--bg-header)", borderColor: "var(--border-header)" }}
    >
      <TopBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-4 xl:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("nav-link", active(l.href) && "nav-link-active")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/contact" className="kit-btn-header hidden lg:inline-flex">
            Get Started
          </Link>
        </div>
        <button
          type="button"
          className="xl:hidden transition"
          style={{ color: "var(--text-nav)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          className="border-t px-4 py-4 xl:hidden"
          style={{ borderColor: "var(--border-header)" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("block py-2 text-sm transition hover:text-blue-500", active(l.href) ? "font-semibold text-blue-500" : "")}
              style={{ color: active(l.href) ? undefined : "var(--text-nav)" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
