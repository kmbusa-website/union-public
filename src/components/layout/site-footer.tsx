import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { SocialIcon } from "@/components/ui/social-icon";
import {
  CONTACT,
  FOOTER_QUICK_LINKS,
  FOOTER_RESOURCES,
  FOOTER_SOCIAL,
  LOGO_PATH,
  ORG_FULL,
  ORG_SHORT,
  ORG_TAGLINE,
} from "@/lib/brand";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="footer-heading">{children}</h3>;
}

export function SiteFooter() {
  return (
    <footer
      className="transition-colors"
      style={{ background: "var(--bg-footer)", color: "var(--text-footer)" }}
    >
      <div className="h-1 w-full bg-(--gold)" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-start gap-3">
              <Image
                src={LOGO_PATH}
                alt={ORG_SHORT}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-contain"
              />
              <div>
                <p className="text-xl font-bold text-(--gold)">{ORG_SHORT}</p>
                <p className="mt-1 text-sm font-medium leading-snug" style={{ color: "var(--text-footer-heading)" }}>{ORG_FULL}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{ORG_TAGLINE}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {FOOTER_SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.icon === "email" ? undefined : "_blank"}
                  rel={item.icon === "email" ? undefined : "noopener noreferrer"}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition hover:scale-105 ${item.color}`}
                  aria-label={item.label}
                >
                  <SocialIcon name={item.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-(--gold)"
                    style={{ color: "var(--text-footer)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <FooterHeading>Resources</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-(--gold)"
                    style={{ color: "var(--text-footer)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="transition hover:text-(--gold)">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <a href={`mailto:${CONTACT.email}`} className="transition hover:text-(--gold)">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <span className="leading-snug">{CONTACT.location}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2">
            <FooterNewsletter />
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border-footer)", background: "var(--bg-footer-bottom)" }}>
        <p className="px-4 py-5 text-center text-xs sm:text-sm" style={{ color: "var(--text-footer)" }}>
          © {new Date().getFullYear()} {ORG_FULL}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
