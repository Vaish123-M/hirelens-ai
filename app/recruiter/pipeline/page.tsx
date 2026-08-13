"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/hirelens";

const columns = [
  { title: "Applied", value: "Applied", accent: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  { title: "Shortlisted", value: "Shortlisted", accent: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200" },
  { title: "Interview", value: "Interview", accent: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200" },
  { title: "Offer", value: "Offer", accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" },
  { title: "Hired / Rejected", value: "Hired", accent: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200" },
];

export default function PipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);

  async function loadApplications() {
    const response = await fetch("/api/applications");
    const data = await response.json();
    setApplications(data.applications || []);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateStatus(applicationId: string, status: string) {
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadApplications();
  }

  return (
    <PageShell
      role="recruiter"
      title="Kanban pipeline"
      subtitle="Move candidates through your hiring funnel and review the interview readiness of each stage."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">Review next <ArrowRight className="h-4 w-4" /></button>}
    >
      <div className="grid gap-5 xl:grid-cols-5">
        {columns.map((column) => {
          const items = applications.filter((item) => item.status === column.value || (column.title === "Hired / Rejected" && (item.status === "Hired" || item.status === "Rejected")));

          return (
            <div key={column.title} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <div className={`mb-4 flex items-center justify-between rounded-2xl p-2.5 ${column.accent}`}>
                <span className="font-medium">{column.title}</span>
                <span className="text-xl font-semibold">{items.length}</span>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No candidates</div>
                ) : null}

                {items.map((candidate) => (
                  <div key={candidate.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{candidate.candidateName}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{candidate.score}% match</div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{candidate.status}</span>
                      <select value={candidate.status} onChange={(event) => updateStatus(candidate.id, event.target.value)} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
