import { Plus, Search } from "lucide-react";
import { ApplicationRow, PageShell, candidateApplications } from "@/components/hirelens";

export default function ApplicationsPage() {
  return (
    <PageShell
      role="candidate"
      title="Applications"
      subtitle="Track every role, the current stage, and your AI match confidence."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><Plus className="h-4 w-4" /> Add application</button>}
    >
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search applications" className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">3 active applications</div>
        </div>

        <div className="space-y-3">
          {candidateApplications.map((application) => (
            <ApplicationRow key={application.position} {...application} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
