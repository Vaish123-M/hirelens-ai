import { ArrowRight, BriefcaseBusiness, ChartColumnBig, FileText, Plus, Users } from "lucide-react";
import Link from "next/link";
import { MetricCard, PageShell, SectionHeader, fakeStats, pipelineColumns, recruiterCandidates, interviewSchedule } from "@/components/hirelens";

export default function RecruiterDashboardPage() {
  return (
    <PageShell
      role="recruiter"
      title="Hiring command center"
      subtitle="Track job health, candidate quality, and the most critical next actions."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><Plus className="h-4 w-4" /> New job</button>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fakeStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pipeline</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Candidate funnel</h2>
              </div>
              <Link href="/recruiter/pipeline" className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300">Open board <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {pipelineColumns.map((column) => (
                <div key={column.title} className={`rounded-2xl p-4 ${column.accent}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{column.title}</span>
                    <span className="text-xl font-semibold">{column.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <SectionHeader eyebrow="Top matches" title="Strongest candidates" action={<Link href="/recruiter/candidates" className="text-sm font-medium text-sky-600 dark:text-sky-300">See all</Link>} />
            <div className="space-y-3">
              {recruiterCandidates.map((candidate) => (
                <div key={candidate.name} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1.4fr_0.8fr_0.7fr] dark:border-slate-800 dark:bg-slate-950/50">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{candidate.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{candidate.role}</div>
                  </div>
                  <div className="flex items-center justify-start font-semibold text-emerald-600 dark:text-emerald-300 sm:justify-center">{candidate.score}</div>
                  <div className="flex items-center justify-start sm:justify-end"><span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">{candidate.stage}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Operations</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Key actions</h3>
              </div>
              <ChartColumnBig className="h-5 w-5 text-sky-500" />
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><span>Review open design roles</span><Users className="h-4 w-4" /></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><span>Schedule final panel</span><BriefcaseBusiness className="h-4 w-4" /></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><span>Prepare offer packets</span><FileText className="h-4 w-4" /></div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <SectionHeader eyebrow="Schedule" title="Interviews" />
            <div className="space-y-3">
              {interviewSchedule.slice(0, 2).map((item) => (
                <div key={item.candidate} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{item.candidate}</div>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{item.stage}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{item.time} • {item.format}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
