"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/hirelens";

const initialSchedule = [
  {
    id: "1",
    title: "Portfolio review",
    candidate: "Ava Rodriguez",
    time: "Wed, 10:00 AM",
    format: "Video interview",
    stage: "Shortlist",
    date: "2026-08-18",
    timeValue: "10:00",
    meetingLink: "https://meet.hirelens.ai/ava-portfolio-review",
  },
  {
    id: "2",
    title: "Engineering panel",
    candidate: "Jordan Kim",
    time: "Thu, 2:30 PM",
    format: "Live coding session",
    stage: "Interview",
    date: "2026-08-19",
    timeValue: "14:30",
    meetingLink: "https://meet.hirelens.ai/jordan-panel",
  },
  {
    id: "3",
    title: "Hiring manager sync",
    candidate: "Mila Chen",
    time: "Fri, 9:15 AM",
    format: "Video interview",
    stage: "Screening",
    date: "2026-08-20",
    timeValue: "09:15",
    meetingLink: "https://meet.hirelens.ai/mila-sync",
  },
];

export default function InterviewsPage() {
  const [schedule, setSchedule] = useState(initialSchedule);

  const updateEntry = (id: string, patch: Partial<(typeof initialSchedule)[number]>) => {
    setSchedule((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  return (
    <PageShell
      role="candidate"
      title="Interviews"
      subtitle="Your upcoming conversations and preparation notes are all in one place."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><CalendarClock className="h-4 w-4" /> Schedule</button>}
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {schedule.map((item) => (
          <div key={item.id} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.title}</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.candidate}</h3>
              </div>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">{item.stage}</span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Date</span>
                <input
                  type="date"
                  value={item.date}
                  onChange={(event) =>
                    updateEntry(item.id, {
                      date: event.target.value,
                      time: `${new Date(event.target.value).toLocaleDateString("en-US", { weekday: "short" })}, ${item.timeValue}`,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Time</span>
                <input
                  type="time"
                  value={item.timeValue}
                  onChange={(event) => {
                    const formatted = new Date(`2026-01-01T${event.target.value}:00`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                    updateEntry(item.id, {
                      timeValue: event.target.value,
                      time: `${new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })}, ${formatted}`,
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">{item.format}</div>

              {item.meetingLink ? (
                <a href={item.meetingLink} target="_blank" rel="noreferrer" className="block rounded-2xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">
                  {item.meetingLink}
                </a>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                const meetingId = `${item.candidate.toLowerCase().replace(/\s+/g, "-")}-${item.date}`;
                const link = `https://meet.hirelens.ai/${meetingId}`;
                updateEntry(item.id, { meetingLink: link });
              }}
              className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100"
            >
              Generate meeting link
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
