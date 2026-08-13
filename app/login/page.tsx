"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleUserRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"candidate" | "recruiter">("candidate");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_35%,_#f8fafc_100%)] px-6 py-12 dark:bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020817_40%,_#020817_100%)]">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_30px_100px_-50px_rgba(15,23,42,0.8)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/40">
        <div className="grid min-h-[760px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between bg-slate-950 p-8 text-white dark:bg-slate-900">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 shadow-lg shadow-cyan-500/25">
                  <BriefcaseBusiness className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold">HireLens AI</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Talent intelligence</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Trusted by 120+ teams</div>
                <h1 className="max-w-md text-4xl font-semibold tracking-tight">Your hiring pipeline, tuned by AI.</h1>
                <p className="max-w-lg text-slate-300">Create roles, compare resume fit, shortlist faster, and move candidates through the interview process without the spreadsheet chaos.</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {[
                "AI-ready role brief + scoring model",
                "Resume parsing with skill gaps and strengths",
                "Pipeline, interview, and offer tracking",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Welcome back</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Sign in to HireLens</h2>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setMode("candidate")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${mode === "candidate" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-300"}`}
                >
                  <CircleUserRound className="h-4 w-4" /> Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setMode("recruiter")}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${mode === "recruiter" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-300"}`}
                >
                  <BriefcaseBusiness className="h-4 w-4" /> Recruiter
                </button>
              </div>

              <form className="space-y-5">
                <label className="block text-sm text-slate-600 dark:text-slate-300">
                  <span className="mb-2 block">Work email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input type="email" defaultValue={mode === "candidate" ? "ava@northstar.ai" : "olivia@hirelens.ai"} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none ring-0 transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </div>
                </label>

                <label className="block text-sm text-slate-600 dark:text-slate-300">
                  <span className="mb-2 block">Password</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input type="password" defaultValue="password123" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none ring-0 transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-sky-600 dark:text-sky-300">Forgot password?</a>
                </div>

                <Link href={mode === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter"} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
                  Continue <ArrowRight className="h-4 w-4" />
                </Link>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No account yet? <Link href="/" className="font-medium text-sky-600 dark:text-sky-300">Book a demo</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
