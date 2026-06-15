"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, MAP_EMBED_URL, SOCIAL_LINKS } from "@/lib/brand";
import { SocialIcon } from "@/components/ui/social-icon";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : "",
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setStatus("ok");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="kit-container py-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">Get In Touch</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-300">
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
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {CONTACT.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-2">
            {SOCIAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:border-blue-400 hover:text-blue-400"
                aria-label={l.label}
              >
                <SocialIcon name={l.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="kit-card lg:col-span-5">
          <h2 className="text-lg font-bold text-white">Send Us a Message</h2>
          {["name", "email", "subject"].map((f) => (
            <div key={f} className="mt-4">
              <label className="kit-label capitalize">{f}</label>
              <input
                className="kit-input"
                required
                type={f === "email" ? "email" : "text"}
                value={form[f as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            </div>
          ))}
          <div className="mt-4">
            <label className="kit-label">Phone</label>
            <input className="kit-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="mt-4">
            <label className="kit-label">Message</label>
            <textarea className="kit-input" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" className="kit-btn-primary mt-6 w-full py-3">
            Send Message
          </button>
          {status === "ok" && (
            <p className="mt-3 text-sm text-emerald-400">Your email app should open with your message ready to send.</p>
          )}
        </form>
        <div className="overflow-hidden rounded-xl lg:col-span-4">
          <iframe title="Map" src={MAP_EMBED_URL} className="h-full min-h-[360px] w-full border-0" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
