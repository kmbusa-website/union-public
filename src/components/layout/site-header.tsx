"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { TopBar } from "@/components/layout/top-bar";

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
    <header className="sticky top-0 z-50 kit-dark-band border-b border-white/10">
      <TopBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-4 xl:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("nav-link", active(l.href) && "nav-link-active")}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="kit-btn-outline-white hidden lg:inline-flex">
          Get Started
        </Link>
        <button type="button" className="text-white xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 py-4 xl:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("block py-2 text-sm", active(l.href) ? "text-blue-400" : "text-slate-300")}
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
