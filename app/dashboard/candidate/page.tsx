"use client";

import Link from "next/link";
import { ArrowRight, Bell, BriefcaseBusiness, FileText, Search, Sparkles, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ApplicationRow, CandidateProfilePanel, MetricCard, PageShell } from "@/components/hirelens";

const defaultProfile = {
  name: "Ava Rodriguez",
  title: "Senior Product Designer",
  experience: "7 yrs experience",
  match: 94,
  strengths: ["Design systems", "B2B SaaS UX", "Research synthesis"],
  missingSkills: ["A/B experimentation", "Accessibility audits"],
  suggestions: ["Schedule portfolio review and product strategy interview with design leadership."],
};

export default function CandidateDashboardPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState(defaultProfile);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function loadData() {
    const [jobsResponse, applicationsResponse, profileResponse] = await Promise.all([
      fetch("/api/jobs"),
      fetch("/api/applications"),
      fetch("/api/profile"),
    ]);

    const jobsData = jobsResponse.ok ? await jobsResponse.json() : { jobs: [] };
    const appsData = applicationsResponse.ok ? await applicationsResponse.json() : { applications: [] };
    const profileData = profileResponse.ok ? await profileResponse.json() : { profile: defaultProfile };

    setJobs(jobsData.jobs || []);
    setApplications(appsData.applications || []);
    if (profileData.profile) {
      setProfile(profileData.profile);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleResumeUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      setUploadMessage("Only PDF or DOCX files are accepted.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage("Resume must be 10MB or less.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setUploading(false);
    event.target.value = "";

    if (!response.ok) {
      setUploadMessage(data.error || "Upload failed.");
      return;
    }

    if (data.profile) {
      setProfile(data.profile);
    }
    if (data.applications) {
      setApplications(data.applications);
    }

    setUploadMessage("Resume parsed and AI profile refreshed.");
  }

  const metrics = [
    { label: "Active applications", value: String(applications.length || 1), delta: "+3%", icon: BriefcaseBusiness },
    { label: "AI match confidence", value: `${profile.match}%`, delta: "+8%", icon: Sparkles },
    { label: "Resume freshness", value: "Updated", delta: "Live", icon: FileText },
    { label: "Jobs explored", value: String(jobs.length), delta: "+2", icon: Search },
  ];

  return (
    <PageShell
      role="candidate"
      title="Your talent dashboard"
      subtitle="Track applications, resume fit, interviews, and next best opportunities."
      rightAction={
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Bell className="h-4 w-4" /> 3 updates
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20" disabled={uploading}>
            <UploadCloud className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload resume"}
          </button>
        </div>
      }
    >
      {uploadMessage ? (
        <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{uploadMessage}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recommended jobs</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">High-fit opportunities</h2>
              </div>
              <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4">
              {(jobs.slice(0, 2)).map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-sky-600 dark:text-sky-300">{job.company}</div>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{Math.min(98, Math.max(80, profile.match))}% match</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(job.requirements || []).slice(0, 3).map((skill: string) => (
                      <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Applications</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Your status</h2>
              </div>
              <Link href="/applications" className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-300">Manage <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="space-y-3">
              {applications.length ? applications.map((app) => (
                <ApplicationRow key={app.id} position={app.jobId || "Current role"} company={jobs.find((job) => job.id === app.jobId)?.company || "HireLens"} submitted={new Date(app.createdAt).toLocaleDateString()} status={app.status} match={`${app.score}%`} />
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No applications yet. Explore the jobs board to get started.</div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AI analysis</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Resume summary</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{profile.match}% match</div>
            </div>
            <CandidateProfilePanel
              name={profile.name}
              title={profile.title}
              experience={profile.experience}
              match={profile.match}
              strengths={profile.strengths}
              missingSkills={profile.missingSkills}
              suggestions={profile.suggestions}
            />
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resume boost</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">AI recommendations</h3>
              </div>
              <Search className="h-5 w-5 text-sky-500" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {profile.suggestions.map((suggestion) => (
                <li key={suggestion} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">{suggestion}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
