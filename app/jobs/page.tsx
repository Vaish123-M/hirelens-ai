import { ArrowUpDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import { JobCard, PageShell, jobPortfolio } from "@/components/hirelens";

export default function JobsPage() {
  return (
    <PageShell
      role="candidate"
      title="Find your next role"
      subtitle="Explore curated opportunities matched to your background and preferences."
      rightAction={
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
      }
    >
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/60">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search by role, company, or keyword" className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['Remote', 'Product', 'Design', 'Full-time', 'AI'].map((tag) => (
              <button key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{tag}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600 dark:text-slate-300">Showing 3 roles</div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <ArrowUpDown className="h-4 w-4" /> Most relevant
        </button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {jobPortfolio.map((job) => (
          <JobCard key={job.title} role="candidate" {...job} />
        ))}
      </div>
    </PageShell>
  );
}
