"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className="flex items-center rounded-lg border p-0.5 text-xs font-semibold"
      style={{ borderColor: "var(--border-header)" }}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            "rounded-md px-2.5 py-1 transition",
            locale === code ? "bg-[var(--blue)] text-white" : "hover:text-blue-500",
          )}
          style={locale === code ? undefined : { color: "var(--text-nav)" }}
        >
          {code === "en" ? "EN" : "தமிழ்"}
        </button>
      ))}
    </div>
  );
}
