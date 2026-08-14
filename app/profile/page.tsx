"use client";

import { CheckCircle2, Download, FileText, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { CandidateProfilePanel, PageShell } from "@/components/hirelens";

const defaultProfile = {
  name: "Ava Rodriguez",
  title: "Senior Product Designer",
  experience: "7 yrs experience",
  match: 94,
  strengths: ["Design leadership", "Customer insight", "Execution quality"],
  missingSkills: ["Experimentation fluency", "Accessibility QA coverage"],
  suggestions: ["Deepen experimentation and measurement fluency for high-growth product teams."],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [form, setForm] = useState({
    name: defaultProfile.name,
    title: defaultProfile.title,
    experience: defaultProfile.experience,
    match: String(defaultProfile.match),
    strengths: defaultProfile.strengths.join(", "),
    missingSkills: defaultProfile.missingSkills.join(", "),
    suggestions: defaultProfile.suggestions.join(" | "),
  });
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/profile");
      if (!response.ok) return;
      const data = await response.json();
      if (data.profile) {
        const loadedProfile = data.profile;
        setProfile(loadedProfile);
        setForm({
          name: loadedProfile.name,
          title: loadedProfile.title,
          experience: loadedProfile.experience,
          match: String(loadedProfile.match),
          strengths: (loadedProfile.strengths || []).join(", "),
          missingSkills: (loadedProfile.missingSkills || []).join(", "),
          suggestions: (loadedProfile.suggestions || []).join(" | "),
        });
      }
    }

    loadProfile();
  }, []);

  async function handleSaveChanges() {
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      experience: form.experience.trim(),
      match: Number(form.match) || 0,
      strengths: form.strengths.split(",").map((item) => item.trim()).filter(Boolean),
      missingSkills: form.missingSkills.split(",").map((item) => item.trim()).filter(Boolean),
      suggestions: form.suggestions.split("|").map((item) => item.trim()).filter(Boolean),
    };

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setSaveMessage(data.error || "Unable to save your profile.");
      return;
    }

    const nextProfile = data.profile;
    setProfile(nextProfile);
    setSaveMessage("Profile updated successfully.");
  }

  return (
    <PageShell
      role="candidate"
      title="My profile"
      subtitle="Your public profile, AI analysis, and role fit snapshot for recruiters."
      rightAction={<button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20"><Download className="h-4 w-4" /> Download CV</button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">AI summary</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Profile strengths</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{profile.match}% fit</div>
            </div>
            <div className="space-y-4">
              {profile.strengths.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Gaps to close</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Skill development roadmap</h3>
              </div>
              <Sparkles className="h-5 w-5 text-sky-500" />
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {profile.missingSkills.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50"><Star className="h-4 w-4 text-amber-500" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Edit profile</div>
            <div className="space-y-4">
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Name</span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Title</span>
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-slate-600 dark:text-slate-300">
                  <span className="mb-2 block">Experience</span>
                  <input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </label>
                <label className="block text-sm text-slate-600 dark:text-slate-300">
                  <span className="mb-2 block">AI match %</span>
                  <input type="number" min={0} max={100} value={form.match} onChange={(event) => setForm({ ...form, match: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </label>
              </div>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Strengths</span>
                <textarea value={form.strengths} onChange={(event) => setForm({ ...form, strengths: event.target.value })} className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Missing skills</span>
                <textarea value={form.missingSkills} onChange={(event) => setForm({ ...form, missingSkills: event.target.value })} className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block">Suggestions</span>
                <textarea value={form.suggestions} onChange={(event) => setForm({ ...form, suggestions: event.target.value })} className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>

              {saveMessage ? <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{saveMessage}</div> : null}

              <button type="button" onClick={handleSaveChanges} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-sky-500/15 dark:text-sky-100">Save Changes</button>
            </div>
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
          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Portfolio</div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Recent impact</h3>
              </div>
              <FileText className="h-5 w-5 text-sky-500" />
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {profile.suggestions.map((suggestion) => (
                <div key={suggestion} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/50">{suggestion}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
