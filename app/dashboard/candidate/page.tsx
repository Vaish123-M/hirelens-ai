import Link from "next/link";
import { ArrowRight, Bell, FileText, Search, Sparkles, UploadCloud } from "lucide-react";
import { ApplicationRow, CandidateProfilePanel, MetricCard, PageShell, candidateApplications, fakeStats, jobPortfolio } from "@/components/hirelens";

export default function CandidateDashboardPage() {
  return (
    <PageShell
      role="candidate"
      title="Your talent dashboard"
      subtitle="Track applications, resume fit, interviews, and next best opportunities."
      rightAction={
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Bell className="h-4 w-4" /> 3 updates
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
            <UploadCloud className="h-4 w-4" /> Upload resume
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fakeStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recommended jobs</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">High-fit opportunities</h2>
              </div>
              <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4">
              {jobPortfolio.slice(0, 2).map((job) => (
                <div key={job.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-sky-600 dark:text-sky-300">{job.company}</div>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{job.match}% match</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Applications</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Your status</h2>
              </div>
              <Link href="/applications" className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300">Manage <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="space-y-3">
              {candidateApplications.map((app) => (
                <ApplicationRow key={app.position} {...app} />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AI analysis</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Resume summary</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">94% match</div>
            </div>
            <CandidateProfilePanel />
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resume boost</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">AI recommendations</h3>
              </div>
              <Search className="h-5 w-5 text-sky-500" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Add quantified impact statements for product launches and performance uplifts.</li>
              <li className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Highlight accessibility and experimentation work in your design portfolio.</li>
              <li className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">Your resume aligns with 3 of 4 key requirements for senior product design.</li>
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
