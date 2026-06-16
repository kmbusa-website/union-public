"use client";

import { useState } from "react";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, MAP_EMBED_URL, SOCIAL_LINKS } from "@/lib/brand";
import { SocialIcon } from "@/components/ui/social-icon";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

async function parseJsonResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as { success?: boolean; message?: string };
  } catch {
    return null;
  }
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("err");
      setError("Contact form is not configured. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to .env.local");
      return;
    }

    setStatus("sending");
    setError("");

    const fullMessage = form.phone.trim()
      ? `${form.message.trim()}\n\nPhone: ${form.phone.trim()}`
      : form.message.trim();

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: fullMessage,
          from_name: form.name.trim(),
          replyto: form.email.trim(),
        }),
      });

      const data = await parseJsonResponse(res);

      if (!data?.success) {
        throw new Error(data?.message ?? "Could not send your message. Please try again.");
      }

      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Failed to send message.");
    }
  };

  return (
    <div className="kit-container py-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">Get In Touch</h2>
          <ul className="mt-6 space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-blue-400" />
              {CONTACT.location}
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-blue-400" />
              {CONTACT.phone}
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-blue-400" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-blue-400">
                {CONTACT.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-2">
            {SOCIAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:border-blue-400 hover:text-blue-400"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                aria-label={l.label}
              >
                <SocialIcon name={l.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="kit-card lg:col-span-5">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Send Us a Message</h2>
          {["name", "email", "subject"].map((f) => (
            <div key={f} className="mt-4">
              <label className="kit-label capitalize">{f}</label>
              <input
                className="kit-input"
                required
                type={f === "email" ? "email" : "text"}
                value={form[f as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                disabled={status === "sending"}
              />
            </div>
          ))}
          <div className="mt-4">
            <label className="kit-label">Phone</label>
            <input
              className="kit-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={status === "sending"}
            />
          </div>
          <div className="mt-4">
            <label className="kit-label">Message</label>
            <textarea
              className="kit-input"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              disabled={status === "sending"}
            />
          </div>
          <button type="submit" disabled={status === "sending"} className="kit-btn-primary mt-6 w-full py-3">
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
          {status === "ok" && (
            <p className="mt-3 text-sm text-emerald-400">
              Message sent successfully. We will get back to you soon.
            </p>
          )}
          {status === "err" && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </form>
        <div className="overflow-hidden rounded-xl lg:col-span-4">
          <iframe title="Map" src={MAP_EMBED_URL} className="h-full min-h-[360px] w-full border-0" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
