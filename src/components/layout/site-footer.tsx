"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { SocialIcon } from "@/components/ui/social-icon";
import { CONTACT, FOOTER_SOCIAL, LOGO_PATH } from "@/lib/brand";

const quickLinks = [
  { href: "/", labelKey: "home", ns: "nav" },
  { href: "/about", labelKey: "aboutUs", ns: "footer" },
  { href: "/committee", labelKey: "committee", ns: "nav" },
  { href: "/events", labelKey: "events", ns: "nav" },
  { href: "/contact", labelKey: "contact", ns: "nav" },
] as const;

const resourceLinks = [
  { href: "/results", labelKey: "results", ns: "nav" },
  { href: "/gallery", labelKey: "gallery", ns: "nav" },
  { href: "/events", labelKey: "events", ns: "nav" },
] as const;

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="footer-heading">{children}</h3>;
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tBrand = useTranslations("brand");

  const label = (ns: "nav" | "footer", key: string) =>
    ns === "nav" ? tNav(key as Parameters<typeof tNav>[0]) : t(key as Parameters<typeof t>[0]);

  return (
    <footer
      className="site-footer transition-colors"
      style={{ background: "var(--bg-footer)", color: "var(--text-footer)" }}
    >
      <div className="h-1 w-full bg-(--gold)" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-start gap-3">
              <Image
                src={LOGO_PATH}
                alt={tBrand("orgShort")}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-contain"
              />
              <div>
                <p className="not-italic text-xl font-bold text-(--gold)">{tBrand("orgShort")}</p>
                <p className="mt-1 text-sm font-medium leading-snug" style={{ color: "var(--text-footer-heading)" }}>
                  {tBrand("orgName")}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed">{t("description")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {FOOTER_SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition hover:scale-105 ${item.color}`}
                  aria-label={item.label}
                >
                  <SocialIcon name={item.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{t("quickLinks")}</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-(--gold)"
                    style={{ color: "var(--text-footer)" }}
                  >
                    {label(link.ns, link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{t("resources")}</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={`${link.href}-${link.labelKey}`}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-(--gold)"
                    style={{ color: "var(--text-footer)" }}
                  >
                    {label(link.ns, link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{t("contactUs")}</FooterHeading>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="latin-text transition hover:text-(--gold)"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <a href={`mailto:${CONTACT.email}`} className="latin-text transition hover:text-(--gold)">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--gold)" />
                <span className="latin-text leading-snug">{CONTACT.location}</span>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <FooterNewsletter />
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border-footer)", background: "var(--bg-footer-bottom)" }}>
        <p className="px-4 py-5 text-center text-xs sm:text-sm" style={{ color: "var(--text-footer)" }}>
          © {new Date().getFullYear()}{" "}
          <span className="not-italic">{tBrand("orgShort")}</span> — {tBrand("orgName")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
