import { Search } from "lucide-react";
import { CandidateProfilePanel, PageShell } from "@/components/hirelens";

export default function RecruiterCandidatesPage() {
  return (
    <PageShell
      role="recruiter"
      title="Candidates"
      subtitle="Review ranking, AI analysis, strengths, and gaps for every applicant."
      rightAction={<div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">17 applicants</div>}
    >
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/50">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search by name or skill" className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" />
          </div>
          <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Top-ranked 3</div>
        </div>

        <CandidateProfilePanel />
      </div>
    </PageShell>
  );
}
