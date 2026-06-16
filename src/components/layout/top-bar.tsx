import { Mail, MapPin } from "lucide-react";
import { CONTACT, SOCIAL_LINKS } from "@/lib/brand";
import { SocialIcon } from "@/components/ui/social-icon";

export function TopBar() {
  return (
    <div
      className="hidden border-b text-xs md:block transition-colors"
      style={{ background: "var(--bg-topbar)", borderColor: "var(--border-header)", color: "var(--text-nav)" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-4 py-2 lg:grid-cols-3 lg:px-8">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          {CONTACT.location}
        </span>
        <a
          href={`mailto:${CONTACT.email}`}
          className="inline-flex items-center justify-center gap-1.5 transition hover:text-blue-500"
        >
          <Mail className="h-3.5 w-3.5 text-blue-500" />
          {CONTACT.email}
        </a>
        <div className="flex items-center gap-2 lg:justify-end">
          <span>Follow Us:</span>
          {SOCIAL_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-full border transition hover:border-blue-400 hover:text-blue-400"
              style={{ borderColor: "var(--border-header)" }}
              aria-label={l.label}
            >
              <SocialIcon name={l.icon} className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
