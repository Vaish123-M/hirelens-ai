"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicationRow, PageShell } from "@/components/hirelens";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
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

    load();
  }, []);

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
          <div className="text-sm text-slate-500 dark:text-slate-400">{applications.length} active application{applications.length === 1 ? "" : "s"}</div>
        </div>

        <div className="space-y-3">
          {applications.length ? applications.map((application) => (
            <ApplicationRow key={application.id} position={jobs.find((job) => job.id === application.jobId)?.title || "Role"} company={jobs.find((job) => job.id === application.jobId)?.company || "HireLens"} submitted={new Date(application.createdAt).toLocaleDateString()} status={application.status} match={`${application.score}%`} />
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No applications found yet.</div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
