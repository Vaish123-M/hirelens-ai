"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicationRow, PageShell } from "@/components/hirelens";
import type { Application, Job } from "@/lib/store";

const columns: Application["status"][] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  async function load() {
    const [jobsResponse, appsResponse] = await Promise.all([
      fetch("/api/jobs"),
      fetch("/api/applications"),
    ]);

    const jobsData = jobsResponse.ok ? await jobsResponse.json() : { jobs: [] };
    const appsData = appsResponse.ok ? await appsResponse.json() : { applications: [] };
    setJobs(jobsData.jobs || []);
    setApplications(appsData.applications || []);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function updateStatus(applicationId: string, status: Application["status"]) {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) return;
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status } : application,
      ),
    );
  }

  const filteredApplications = applications.filter((application) => {
    const jobTitle = jobs.find((job) => job.id === application.jobId)?.title || "";
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [jobTitle, application.status, application.candidateName].some((value) =>
      value.toLowerCase().includes(query),
    );
  });

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
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white" />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{filteredApplications.length} active application{filteredApplications.length === 1 ? "" : "s"}</div>
        </div>

        <div className="space-y-3">
          {filteredApplications.length ? filteredApplications.map((application) => (
            <div key={application.id} className="rounded-2xl border border-slate-200/80 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-900/60">
              <ApplicationRow
                position={jobs.find((job) => job.id === application.jobId)?.title || "Role"}
                company={jobs.find((job) => job.id === application.jobId)?.company || "HireLens"}
                submitted={new Date(application.createdAt).toLocaleDateString()}
                status={application.status}
                match={`${application.score}%`}
              />
              <div className="flex justify-end px-4 pb-3">
                <select
                  value={application.status}
                  onChange={(event) =>
                    updateStatus(application.id, event.target.value as Application["status"])
                  }
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {columns.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No applications found yet.</div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Recruiter Kanban</div>
        <div className="grid gap-4 xl:grid-cols-5">
          {columns.map((status) => {
            const items = applications.filter((application) => application.status === status);
            return (
              <div
                key={status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={async () => {
                  if (!draggedId) return;
                  await updateStatus(draggedId, status);
                  setDraggedId(null);
                }}
                className="min-h-44 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-100 px-2.5 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <span>{status}</span>
                  <span>{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.length ? items.map((application) => (
                    <div
                      key={application.id}
                      draggable
                      onDragStart={() => setDraggedId(application.id)}
                      className="cursor-grab rounded-2xl border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{application.candidateName}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{jobs.find((job) => job.id === application.jobId)?.title || "Role"}</div>
                      <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">{application.score}% match</div>
                    </div>
                  )) : <div className="rounded-2xl border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">No candidates</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
