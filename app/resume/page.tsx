"use client";

import { Download, FileUp, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { CandidateProfilePanel, PageShell } from "@/components/hirelens";

const initialResumeText = `Ava Rodriguez
Senior Product Designer
Summary: Product designer with 7+ years of experience building AI-enabled SaaS experiences, streamlining workflows, and translating customer insight into shipping strategies.
Core strengths: UX research, design systems, roadmap prioritization, stakeholder alignment, B2B SaaS product growth.
Experience: Led discovery programs for enterprise product teams; improved activation and retention metrics through user-centered redesigns and experiment frameworks.
Selected achievements: Reduced onboarding friction by 28%, launched a design system used by 9 product squads, and improved interview-to-offer conversion for design hiring.`;

export default function ResumePage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [resumeName, setResumeName] = useState("Ava_Rodriguez_Resume.pdf");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [feedback, setFeedback] = useState("Resume parsed and ready for export.");

  const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!isValidType) {
      setFeedback("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedback("Resume must be 10MB or less.");
      return;
    }

    setResumeName(file.name || "Ava_Rodriguez_Resume.pdf");
    setFeedback(`Loaded ${file.name}. The file is valid and ready to review.`);
    event.target.value = "";
  };

  const handleExport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <PageShell
      role="candidate"
      title="Resume & profile"
      subtitle="Parse, optimize, and sharpen your application with AI guidance."
      rightAction={
        <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Document parser</div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Uploaded resume</h2>
            </div>
            <button
              type="button"
              aria-label="Upload resume"
              onClick={() => inputRef.current?.click()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition hover:bg-sky-200 dark:bg-sky-500/15 dark:text-sky-300"
            >
              <FileUp className="h-5 w-5" />
            </button>
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFilePick} />
          </div>
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm dark:bg-slate-900 dark:text-sky-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{resumeName}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Last parsed 12 minutes ago · 94% skill coverage</p>
          </div>

          {feedback ? <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">{feedback}</div> : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Core skills", "UX Research, Strategy, Design Systems"],
              ["Experience", "7 years across SaaS and fintech"],
              ["Top matches", "Senior Product Designer, Research Lead"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</div>
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => setPreviewOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Preview</div>
                <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{resumeName}</div>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {previewOpen ? "Hide" : "Show"}
              </span>
            </button>

            {previewOpen ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/80">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <span>PDF preview</span>
                  <span>1 of 2 pages</span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
                  <pre className="whitespace-pre-wrap font-sans">{initialResumeText}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <CandidateProfilePanel />
        </div>
      </div>
    </PageShell>
  );
}
