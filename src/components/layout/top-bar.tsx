import { Mail, MapPin } from "lucide-react";
import { CONTACT, SOCIAL_LINKS } from "@/lib/brand";
import { SocialIcon } from "@/components/ui/social-icon";

export function TopBar() {
  return (
    <div className="hidden border-b border-white/10 bg-[#030712] text-xs text-slate-400 md:block">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-4 py-2 lg:grid-cols-3 lg:px-8">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-blue-400" />
          {CONTACT.location}
        </span>
        <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center justify-center gap-1.5 hover:text-white">
          <Mail className="h-3.5 w-3.5 text-blue-400" />
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
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 hover:border-blue-400 hover:text-blue-400"
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
