import { ArrowRight } from "lucide-react";
import { PageShell, pipelineColumns, recruiterCandidates } from "@/components/hirelens";

export default function PipelinePage() {
  return (
    <PageShell
      role="recruiter"
      title="Kanban pipeline"
      subtitle="Move candidates through your hiring funnel and review the interview readiness of each stage."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">Review next <ArrowRight className="h-4 w-4" /></button>}
    >
      <div className="grid gap-5 xl:grid-cols-4">
        {pipelineColumns.map((column) => (
          <div key={column.title} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className={`mb-4 flex items-center justify-between rounded-2xl p-2.5 ${column.accent}`}>
              <span className="font-medium">{column.title}</span>
              <span className="text-sm font-semibold">{column.count}</span>
            </div>
            <div className="space-y-3">
              {recruiterCandidates.slice(0, Math.min(column.count / 4, 3)).map((candidate) => (
                <div key={candidate.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{candidate.name}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{candidate.role}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{candidate.score}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{candidate.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
