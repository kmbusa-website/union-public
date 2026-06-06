import Link from "next/link";
import { BarChart3, CalendarDays, FileText, ImageIcon, Newspaper, Users } from "lucide-react";

const links = [
  { href: "/events", label: "Events", sub: "View upcoming events", icon: CalendarDays },
  { href: "/news", label: "Latest News", sub: "Stay updated daily", icon: Newspaper },
  { href: "/results", label: "A/L Results", sub: "Check your results", icon: BarChart3 },
  { href: "/past-papers", label: "Past Papers", sub: "Study resources", icon: FileText },
  { href: "/gallery", label: "Gallery", sub: "Photo albums", icon: ImageIcon },
  { href: "/committee", label: "Committee", sub: "Meet the team", icon: Users },
];

export function HomeQuickLinks() {
  return (
    <section className="kit-white-main">
      <div className="kit-container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="kit-card-hover flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <item.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
