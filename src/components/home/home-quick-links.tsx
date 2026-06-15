import Link from "next/link";
import { BarChart3, CalendarDays, ImageIcon, Users } from "lucide-react";

const links = [
  { href: "/events", label: "Events", sub: "View upcoming events", icon: CalendarDays },
  { href: "/results", label: "A/L Results", sub: "Check your results", icon: BarChart3 },
  { href: "/gallery", label: "Gallery", sub: "Photo albums", icon: ImageIcon },
  { href: "/committee", label: "Committee", sub: "Meet the team", icon: Users },
];

export function HomeQuickLinks() {
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
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
