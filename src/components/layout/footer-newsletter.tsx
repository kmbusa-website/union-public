"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function FooterNewsletter() {
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
      <h3 className="footer-heading">Newsletter</h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-footer)" }}>
        Subscribe to get the latest updates and announcements.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
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
          aria-label="Subscribe"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {sent && <p className="mt-2 text-xs text-emerald-500">Thanks for subscribing!</p>}
    </div>
  );
}
