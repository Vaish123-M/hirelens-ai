"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Sparkles, Star } from "lucide-react";
import { BrandMark, homeFeatures, landingProof, workflowSteps } from "@/components/hirelens";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex dark:text-slate-300">
            <a href="#product" className="transition hover:text-slate-900 dark:hover:text-white">Product</a>
            <a href="#workflow" className="transition hover:text-slate-900 dark:hover:text-white">Workflow</a>
            <a href="#customers" className="transition hover:text-slate-900 dark:hover:text-white">Customers</a>
            <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">Log in</Link>
            <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(168,85,247,0.12),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-20 lg:pt-28">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI hiring platform
                </div>
                <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                  Recruit faster with <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">signal, not guesswork.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
                  HireLens AI helps teams match the right candidates to the right roles, surface blind spots in real time, and move from application to offer with confidence.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
                    Book a demo <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/dashboard/candidate" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Play className="h-4 w-4" />
                    Explore product
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                  {landingProof.map((item) => (
                    <div key={item.label}>
                      <div className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</div>
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                <div className="rounded-[24px] bg-slate-950 p-5 text-white dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Role fit</div>
                      <div className="mt-2 text-4xl font-semibold text-white">94%</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Shortlist ready</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>Product design</span><span>96%</span></div>
                      <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[96%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" /></div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>Research</span><span>92%</span></div>
                      <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" /></div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>Analytics</span><span>87%</span></div>
                      <div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[87%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" /></div>
                    </div>
                  </div>
                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-300"><span>Strengths</span><span>3</span></div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Design systems</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> B2B SaaS workflow</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Research translation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 text-center">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Why teams choose HireLens</div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Built for the entire hiring journey</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {homeFeatures.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.8)] dark:border-slate-800 dark:bg-slate-900/60">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700 dark:from-sky-500/15 dark:to-violet-500/15 dark:text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">Workflow</div>
              <h2 className="text-3xl font-semibold tracking-tight">From job brief to signed offer, in one place</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-5">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-[28px] border border-slate-800 bg-slate-950/60 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold text-white">0{index + 1}</div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="customers" className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.8)] dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Customer story</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">“HireLens cut our shortlisting cycle from 11 days to 4.”</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Star className="h-4 w-4 fill-current" /> 4.9/5 from recruiting teams
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["51%", "drop in time spent screening CVs"],
                ["3.2x", "faster shortlist generation"],
                ["88%", "candidate satisfaction in interviews"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24 pt-8">
          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-violet-50 p-8 text-center dark:border-slate-800 dark:from-sky-500/10 dark:via-slate-900 dark:to-violet-500/10">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">Start today</div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Build a sharper hiring engine for your team.</h2>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">Start free trial <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/dashboard/recruiter" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">See recruiter view</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 py-8 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-600 sm:flex-row dark:text-slate-300">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure hiring workflow</div>
          <div>© 2026 HireLens AI. Built for modern teams.</div>
        </div>
      </footer>
    </div>
  );
}
