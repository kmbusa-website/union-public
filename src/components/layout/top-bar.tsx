"use client";

import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT, SOCIAL_LINKS } from "@/lib/brand";
import { SocialIcon } from "@/components/ui/social-icon";

export function TopBar() {
  const t = useTranslations("common");
  return (
    <div className="site-topbar">
      <div className="site-topbar-inner">
        <span className="site-topbar-link latin-text">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
          {CONTACT.location}
        </span>
        <a
          href={`mailto:${CONTACT.email}`}
          className="site-topbar-link latin-text lg:justify-self-center"
        >
          <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
          {CONTACT.email}
        </a>
        <div className="flex items-center gap-2 lg:justify-end">
          <span className="font-medium text-slate-400">{t("followUs")}</span>
          {SOCIAL_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="site-topbar-social"
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
