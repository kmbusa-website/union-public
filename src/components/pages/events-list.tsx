"use client";

import Link from "next/link";
import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Bell, Calendar, Clock, MapPin, Ticket } from "lucide-react";
import type { Event } from "@/lib/types/api";

function MiniCalendar({ events }: { events: Event[] }) {
  const now = new Date();
  const days = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
  const pad = getDay(startOfMonth(now));
  const has = (d: Date) => events.some((e) => isSameDay(new Date(e.startAt), d));

  return (
    <div className="kit-card">
      <h3 className="text-center font-semibold text-white">{format(now, "MMMM yyyy")}</h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="font-medium text-slate-500">
            {d}
          </span>
        ))}
        {Array.from({ length: pad }).map((_, i) => (
          <span key={`p${i}`} />
        ))}
        {days.map((d) => (
          <span
            key={d.toISOString()}
            className={`rounded py-1 ${isSameDay(d, now) ? "bg-cyan-500 font-bold text-[#0a192f]" : has(d) ? "bg-cyan-500/20 font-semibold text-cyan-400" : "text-slate-300"}`}
          >
            {format(d, "d")}
          </span>
        ))}
      </div>
    </div>
  );
}

const features = [
  { icon: Bell, title: "Event Reminders", desc: "Never miss important dates" },
  { icon: Ticket, title: "Easy Registration", desc: "Sign up online" },
  { icon: Calendar, title: "Calendar View", desc: "Plan your schedule" },
  { icon: MapPin, title: "Venue Details", desc: "Know where to go" },
];

export function EventsList({ events }: { events: Event[] }) {
  const sorted = [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  return (
    <div className="kit-container">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {sorted.length === 0 ? (
            <p className="text-slate-400">No upcoming events.</p>
          ) : (
            sorted.map((event) => {
              const start = new Date(event.startAt);
              return (
                <div key={event.id} className="kit-card flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-600 text-white">
                    <span className="text-xs font-bold uppercase">{format(start, "MMM")}</span>
                    <span className="text-xl font-bold leading-none">{format(start, "dd")}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {format(start, "h:mm a")}
                    </p>
                    {event.location && (
                      <p className="flex items-center gap-1 text-sm text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </p>
                    )}
                    <Link href={`/events/${event.slug}`} className="kit-btn-primary mt-3 text-xs">
                      Register Now
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <MiniCalendar events={sorted} />
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="kit-card flex gap-3">
            <f.icon className="h-8 w-8 shrink-0 text-cyan-400" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-white">{f.title}</p>
              <p className="text-xs text-slate-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
