import { Download, FileUp, Sparkles } from "lucide-react";
import { CandidateProfilePanel, PageShell } from "@/components/hirelens";

export default function ResumePage() {
  return (
    <PageShell
      role="candidate"
      title="Resume & profile"
      subtitle="Parse, optimize, and sharpen your application with AI guidance."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><Download className="h-4 w-4" /> Export PDF</button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Document parser</div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Uploaded resume</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              <FileUp className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm dark:bg-slate-900 dark:text-sky-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ava_Rodriguez_Resume.pdf</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Last parsed 12 minutes ago · 94% skill coverage</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Core skills", "UX Research, Strategy, Design Systems"],
              ["Experience", "7 years across SaaS and fintech"],
              ["Top matches", "Senior Product Designer, Research Lead"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <CandidateProfilePanel />
        </div>
      </div>
    </PageShell>
  );
}
