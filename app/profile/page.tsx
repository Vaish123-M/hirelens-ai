"use client";

import { ArrowRight, CheckCircle2, Download, FileText, Sparkles, Star } from "lucide-react";
import { CandidateProfilePanel, PageShell } from "@/components/hirelens";

export default function ProfilePage() {
  return (
    <PageShell
      role="candidate"
      title="My profile"
      subtitle="Your public profile, AI analysis, and role fit snapshot for recruiters."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><Download className="h-4 w-4" /> Download CV</button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AI summary</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Profile strengths</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">94% fit</div>
            </div>
            <div className="space-y-4">
              {[
                { title: "Design leadership", description: "Strong systems thinking, cross-functional communication, and end-to-end product problem framing." },
                { title: "Customer insight", description: "Transforms user interviews into product directions and measurable experience improvements." },
                { title: "Execution quality", description: "Delivers polished interfaces, research synthesis, and handoff clarity for engineering teams." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item.title}</div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Gaps to close</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Skill development roadmap</h3>
              </div>
              <Sparkles className="h-5 w-5 text-sky-500" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><Star className="h-4 w-4 text-amber-500" /> Deepen experimentation and measurement fluency for high-growth product teams.</li>
              <li className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><Star className="h-4 w-4 text-amber-500" /> Expand accessibility QA coverage for enterprise design systems.</li>
              <li className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><Star className="h-4 w-4 text-amber-500" /> Strengthen mobile-first prototyping and conversion analytics storytelling.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <CandidateProfilePanel />
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Portfolio</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Recent impact</h3>
              </div>
              <FileText className="h-5 w-5 text-sky-500" />
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Led redesign of customer onboarding and increased activation by 22%.</div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Shipped a reusable design system adopted across 4 core product teams.</div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Created a research insight hub that reduced stakeholder handoff time by 35%.</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
