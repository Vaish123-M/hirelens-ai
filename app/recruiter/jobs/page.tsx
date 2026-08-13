"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { JobCard, PageShell } from "@/components/hirelens";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  requirements: "", 
};

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  async function loadJobs() {
    const response = await fetch("/api/jobs");
    const data = await response.json();
    setJobs(data.jobs || []);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const payload = {
      ...(editingId ? { id: editingId } : {}),
      ...form,
      requirements: form.requirements.split(",").map((item) => item.trim()).filter(Boolean),
    };

    const response = await fetch("/api/jobs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      setFeedback(editingId ? "Job updated." : "Job created.");
      loadJobs();
    } else {
      const data = await response.json();
      setFeedback(data.error || "Unable to save job.");
    }
  }

  async function handleClose(jobId: string) {
    const response = await fetch("/api/jobs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: jobId, status: "Closed" }),
    });

    if (response.ok) {
      setFeedback("Job closed.");
      loadJobs();
    }
  }

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
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{jobs.length} roles</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">{editingId ? "Edit job" : "Create job"}</div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Job title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Hybrid</option>
            </select>
          </div>
          <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Salary range" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Role description" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
          <input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Skills or requirements, comma separated" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />

          {feedback ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{feedback}</div> : null}

          <div className="flex gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">{editingId ? "Save changes" : "Create role"}</button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700 dark:text-slate-200">Cancel</button> : null}
          </div>
        </form>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{job.company}</div>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{job.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
                <span>•</span>
                <span>{job.salary}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(job.requirements || []).slice(0, 4).map((skill: string) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => { setEditingId(job.id); setForm({ title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary, description: job.description, requirements: (job.requirements || []).join(", ") }); }} className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-200">Edit</button>
                <button type="button" onClick={() => handleClose(job.id)} className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:text-slate-200">Close</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
