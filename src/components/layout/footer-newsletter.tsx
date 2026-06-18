"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

export function FooterNewsletter() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <div>
      <h3 className="footer-heading">{t("newsletter")}</h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-footer)" }}>
        {t("newsletterDesc")}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          disabled={sent}
          className="min-w-0 flex-1 rounded-l-lg border px-3 py-2.5 text-sm transition focus:outline-none"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-footer)",
            color: "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-r-lg bg-[var(--blue-light)] px-3.5 text-white transition hover:bg-[var(--blue)]"
          aria-label={t("subscribe")}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {sent && <p className="mt-2 text-xs text-emerald-500">{t("subscribed")}</p>}
    </div>
  );
}
