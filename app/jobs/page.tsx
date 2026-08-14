"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpDown, Plus, Search, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { JobCard, PageShell } from "@/components/hirelens";
import type { Job } from "@/lib/store";

const chipOptions = ["Remote", "Product", "Design", "AI"] as const;

const emptyJobForm = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  requirements: "",
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [jobErrors, setJobErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data.jobs || []);
    })();
  }, []);

  const filteredJobs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const haystack = [job.title, job.company, job.location, job.description, ...(job.requirements || [])]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesFilters = selectedFilters.every((filter) => {
        switch (filter) {
          case "Remote":
            return job.location.toLowerCase().includes("remote");
          case "Product":
            return /product|strategy/i.test(job.title + " " + job.description + " " + (job.requirements || []).join(" "));
          case "Design":
            return /design|ux|research/i.test(job.title + " " + job.description + " " + (job.requirements || []).join(" "));
          case "AI":
            return /ai|ml|machine|data/i.test(job.title + " " + job.description + " " + (job.requirements || []).join(" "));
          default:
            return true;
        }
      });

      return matchesKeyword && matchesFilters;
    });
  }, [jobs, search, selectedFilters]);

  function toggleFilter(tag: string) {
    setSelectedFilters((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

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
    setIsApplyModalOpen(false);
    setResume(null);
    setTimeout(() => router.push("/applications"), 700);
  }

  function validateJobForm() {
    const nextErrors: Record<string, string> = {};

    if (!jobForm.title.trim()) nextErrors.title = "Job title is required.";
    if (!jobForm.company.trim()) nextErrors.company = "Company is required.";
    if (!jobForm.location.trim()) nextErrors.location = "Location is required.";
    if (!jobForm.description.trim()) nextErrors.description = "Description is required.";
    if (!jobForm.salary.trim()) nextErrors.salary = "Salary range is required.";
    if (!jobForm.requirements.trim()) nextErrors.requirements = "Add at least one required skill.";

    setJobErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleCreateJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateJobForm()) return;

    const payload = {
      ...jobForm,
      requirements: jobForm.requirements
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setJobErrors({ form: data.error || "Unable to create the role." });
      return;
    }

    setJobs((current) => [data.job, ...current]);
    setJobForm(emptyJobForm);
    setJobErrors({});
    setIsCreateModalOpen(false);
    setFeedback("Job created successfully.");
  }

  return (
    <PageShell
      role="candidate"
      title="Find your next role"
      subtitle="Explore curated opportunities matched to your background and preferences."
      rightAction={
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"
        >
          <Plus className="h-4 w-4" /> Create Job
        </button>
      }
    >
      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-950/60">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by role, company, or keyword"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {chipOptions.map((tag) => {
              const active = selectedFilters.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600 dark:text-slate-300">Showing {filteredJobs.length} roles</div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <ArrowUpDown className="h-4 w-4" /> Most relevant
        </button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                role="candidate"
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                salary={job.salary}
                match={Math.min(98, 86 + (job.title.length % 10))}
                skills={(job.requirements || []).slice(0, 4)}
                onApply={() => {
                  setSelectedJob(job);
                  setFeedback("");
                  setIsApplyModalOpen(true);
                }}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              No roles match your current search or filters.
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Quick apply</div>
          <form onSubmit={handleApply} className="space-y-5">
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              <span className="mb-2 block">Select role</span>
              <select
                value={selectedJob?.id || ""}
                onChange={(event) => setSelectedJob(jobs.find((job) => job.id === event.target.value) || null)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Choose a role</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-600 dark:text-slate-300">
              <span className="mb-2 block">Resume upload</span>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResume(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sky-700 dark:file:bg-sky-500/10 dark:file:text-sky-300"
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <UploadCloud className="h-3.5 w-3.5" /> PDF or DOCX up to 10MB
                </div>
              </div>
            </label>

            {feedback ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{feedback}</div> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"
            >
              {isSubmitting ? "Submitting..." : "Apply now"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {isApplyModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Apply</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{selectedJob?.title || "Role"}</h3>
              </div>
              <button type="button" onClick={() => setIsApplyModalOpen(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 dark:border-slate-700 dark:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950/50">
                <div className="font-medium text-slate-800 dark:text-slate-200">{selectedJob?.company}</div>
                <div className="mt-1 text-slate-500 dark:text-slate-400">{selectedJob?.location} • {selectedJob?.type}</div>
              </div>

              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Attach resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResume(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sky-700 dark:file:bg-sky-500/10 dark:file:text-sky-300"
                />
              </label>

              {feedback ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{feedback}</div> : null}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsApplyModalOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
                <button type="submit" disabled={isSubmitting || !resume} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500/15 dark:text-sky-100">
                  {isSubmitting ? "Submitting..." : "Submit application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Recruiter</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Create job</h3>
              </div>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 dark:border-slate-700 dark:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} placeholder="Job title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                  {jobErrors.title ? <div className="mt-1 text-xs text-rose-500">{jobErrors.title}</div> : null}
                </div>
                <div>
                  <input value={jobForm.company} onChange={(event) => setJobForm({ ...jobForm, company: event.target.value })} placeholder="Company" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                  {jobErrors.company ? <div className="mt-1 text-xs text-rose-500">{jobErrors.company}</div> : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} placeholder="Location" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                  {jobErrors.location ? <div className="mt-1 text-xs text-rose-500">{jobErrors.location}</div> : null}
                </div>
                <select value={jobForm.type} onChange={(event) => setJobForm({ ...jobForm, type: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div>
                <input value={jobForm.salary} onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })} placeholder="Salary range" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                {jobErrors.salary ? <div className="mt-1 text-xs text-rose-500">{jobErrors.salary}</div> : null}
              </div>

              <div>
                <textarea value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} placeholder="Job description" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                {jobErrors.description ? <div className="mt-1 text-xs text-rose-500">{jobErrors.description}</div> : null}
              </div>

              <div>
                <input value={jobForm.requirements} onChange={(event) => setJobForm({ ...jobForm, requirements: event.target.value })} placeholder="Skills, comma-separated" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950/50" />
                {jobErrors.requirements ? <div className="mt-1 text-xs text-rose-500">{jobErrors.requirements}</div> : null}
              </div>

              {jobErrors.form ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{jobErrors.form}</div> : null}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
                <button type="submit" className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100">Create role</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
