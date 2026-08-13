"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpDown, Search, SlidersHorizontal, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { JobCard, PageShell } from "@/components/hirelens";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data.jobs || []);
    }

    fetchJobs();
  }, []);

  async function handleApply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedJob || !resume) {
      setFeedback("Please select a role and upload a resume.");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("jobId", selectedJob.id);
    formData.append("resume", resume);

    const response = await fetch("/api/applications", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setFeedback(data.error || "Could not submit your application.");
      return;
    }

    setFeedback("Application submitted successfully.");
    setTimeout(() => router.push("/applications"), 800);
  }

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
        <div className="text-sm text-slate-600 dark:text-slate-300">Showing {jobs.length} roles</div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <ArrowUpDown className="h-4 w-4" /> Most relevant
        </button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} role="candidate" title={job.title} company={job.company} location={job.location} type={job.type} salary={job.salary} match={94} skills={job.requirements.slice(0, 4)} />
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Quick apply</div>
          <form onSubmit={handleApply} className="space-y-5">
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              <span className="mb-2 block">Select role</span>
              <select value={selectedJob?.id || ""} onChange={(event) => setSelectedJob(jobs.find((job) => job.id === event.target.value) || null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                <option value="">Choose a role</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-600 dark:text-slate-300">
              <span className="mb-2 block">Resume upload</span>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sky-700 dark:file:bg-sky-500/10 dark:file:text-sky-300" />
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><UploadCloud className="h-3.5 w-3.5" /> PDF or DOCX up to 10MB</div>
              </div>
            </label>

            {feedback ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{feedback}</div> : null}

            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
              {isSubmitting ? "Submitting..." : "Apply now"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
