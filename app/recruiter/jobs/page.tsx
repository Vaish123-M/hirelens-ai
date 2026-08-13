import { Plus, Search } from "lucide-react";
import { JobCard, PageShell, jobPortfolio } from "@/components/hirelens";

export default function RecruiterJobsPage() {
  return (
    <PageShell
      role="recruiter"
      title="Open roles"
      subtitle="Create, review, and optimize hiring plans across your active opportunities."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><Plus className="h-4 w-4" /> Create job</button>}
    >
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search jobs or departments" className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" />
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">4 active roles</div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {jobPortfolio.map((job) => (
          <JobCard key={job.title} role="recruiter" {...job} />
        ))}
      </div>
    </PageShell>
  );
}
