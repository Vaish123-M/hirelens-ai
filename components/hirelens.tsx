'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileText,
  Gauge,
  LayoutGrid,
  MessageSquareText,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

export type NavRole = "candidate" | "recruiter";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 shadow-lg shadow-cyan-500/25">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">HireLens AI</div>
        <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Talent intelligence</div>
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{delta}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">{eyebrow}</div> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const tone =
    label.toLowerCase().includes("shortlist") || label.toLowerCase().includes("offer") || label.toLowerCase().includes("hired")
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      : label.toLowerCase().includes("interview") || label.toLowerCase().includes("review")
        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
        : "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>{label}</span>;
}

export function SidebarNav({ role }: { role: NavRole }) {
  const items: { label: string; href: string; icon: LucideIcon }[] =
    role === "candidate"
      ? [
          { label: "Dashboard", href: "/dashboard/candidate", icon: LayoutGrid },
          { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
          { label: "Applications", href: "/applications", icon: FileText },
          { label: "Resume", href: "/resume", icon: Search },
          { label: "Interviews", href: "/interviews", icon: MessageSquareText },
          { label: "Profile", href: "/profile", icon: CircleUserRound },
        ]
      : [
          { label: "Dashboard", href: "/dashboard/recruiter", icon: LayoutGrid },
          { label: "Jobs", href: "/recruiter/jobs", icon: BriefcaseBusiness },
          { label: "Candidates", href: "/recruiter/candidates", icon: Users },
          { label: "Pipeline", href: "/recruiter/pipeline", icon: Workflow },
          { label: "Interviews", href: "/recruiter/interviews", icon: MessageSquareText },
          { label: "Analytics", href: "/recruiter/analytics", icon: TrendingUp },
        ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-white/80 p-5 backdrop-blur-xl lg:block dark:border-slate-800 dark:bg-slate-950/30">
      <div className="mb-8 pl-2">
        <BrandMark />
      </div>
      <nav className="space-y-2">
        {items.map(({ label, href, icon: Icon }) => {
          const isCurrent = href === "/dashboard/candidate" || href === "/dashboard/recruiter";
          return (
            <Link
              key={label}
              href={href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                isCurrent
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-sky-500/15 dark:text-sky-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-3xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-violet-50 p-4 dark:border-sky-500/20 dark:from-sky-500/10 dark:to-violet-500/10">
        <div className="mb-2 flex items-center gap-2 text-sky-700 dark:text-sky-300">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">AI Match</span>
        </div>
        <div className="text-3xl font-semibold text-slate-900 dark:text-white">94%</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Talent score for your current top candidate.</p>
      </div>
    </aside>
  );
}

export function PageShell({
  role,
  title,
  subtitle,
  children,
  rightAction,
}: {
  role: NavRole;
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightAction?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [workspaceRole, setWorkspaceRole] = useState<NavRole>(role);

  const switchRole = (nextRole: NavRole) => {
    setWorkspaceRole(nextRole);
    const target = nextRole === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter";
    if (pathname !== target) {
      router.push(target);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_35%,_#f8fafc_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020817_40%,_#020817_100%)] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <SidebarNav role={workspaceRole} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/70 p-5 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/40 dark:shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">{workspaceRole === "candidate" ? "Candidate workspace" : "Recruiter workspace"}</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                {(["candidate", "recruiter"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => switchRole(option)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${workspaceRole === option ? "bg-slate-900 text-white dark:bg-sky-500/15 dark:text-sky-100" : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
                  >
                    {option === "candidate" ? "Candidate" : "Recruiter"}
                  </button>
                ))}
              </div>
              {rightAction}
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

export function JobCard({
  role,
  title,
  company,
  location,
  type,
  salary,
  match,
  skills,
  onApply,
}: {
  role: "candidate" | "recruiter";
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match?: number;
  skills: string[];
  onApply?: () => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{company}</div>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {match ? <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{match}% match</div> : null}
      </div>
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span>{location}</span>
        <span>•</span>
        <span>{type}</span>
        <span>•</span>
        <span>{salary}</span>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-slate-200/80 pt-4 dark:border-slate-800">
        <div className="text-sm text-slate-500 dark:text-slate-400">{role === "candidate" ? "8 applicants this week" : "4 interviews scheduled"}</div>
        {onApply ? (
          <button type="button" onClick={onApply} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
            Apply now <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <Link href={role === "candidate" ? "/jobs" : "/recruiter/jobs"} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/20">
            View details <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function ApplicationRow({
  position,
  company,
  submitted,
  status,
  match,
}: {
  position: string;
  company: string;
  submitted: string;
  status: string;
  match: string;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:grid-cols-[1.5fr_1fr_0.8fr_1fr] dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <div className="text-lg font-semibold text-slate-900 dark:text-white">{position}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{company}</div>
      </div>
      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">Submitted {submitted}</div>
      <div className="flex items-center"><StatusBadge label={status} /></div>
      <div className="flex items-center justify-end gap-3 text-sm">
        <span className="font-semibold text-emerald-600 dark:text-emerald-300">{match}</span>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200">View <ArrowRight className="h-3 w-3" /></button>
      </div>
    </div>
  );
}

export function InterviewCard({
  title,
  candidate,
  time,
  format,
  stage,
}: {
  title: string;
  candidate: string;
  time: string;
  format: string;
  stage: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{candidate}</h3>
        </div>
        <StatusBadge label={stage} />
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <div>{time}</div>
        <div>{format}</div>
      </div>
    </div>
  );
}

export function CandidateProfilePanel({
  name = "Ava Rodriguez",
  title = "Senior Product Designer",
  experience = "7 yrs experience",
  match = 94,
  strengths = ["Design systems", "B2B SaaS UX", "Research synthesis"],
  missingSkills = ["A/B experimentation", "Accessibility audits"],
  suggestions = ["Schedule portfolio review and product strategy interview with design leadership."],
}: {
  name?: string;
  title?: string;
  experience?: string;
  match?: number;
  strengths?: string[];
  missingSkills?: string[];
  suggestions?: string[];
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_80px_-60px_rgba(2,6,23,0.8)] dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-400 text-xl font-semibold text-white">{initials}</div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Candidate profile</div>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{name}</h3>
            <div className="text-sm text-slate-500 dark:text-slate-400">{title} • {experience}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">AI match</div>
          <div className="text-4xl font-semibold text-emerald-600 dark:text-emerald-300">{match}%</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Strengths</div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {strengths.map((item) => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Missing skills</div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {missingSkills.length ? missingSkills.map((item) => (
              <li key={item} className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> {item}</li>
            )) : <li className="text-slate-500 dark:text-slate-400">No key gaps detected.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Recommended next step</div>
          <div className="text-sm text-slate-700 dark:text-slate-200">{suggestions[0] || "Continue improving role-specific depth in your portfolio."}</div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Gauge className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

export const fakeStats = [
  { label: "Active jobs", value: "26", delta: "+6%", icon: BriefcaseBusiness },
  { label: "Qualified candidates", value: "1,248", delta: "+18%", icon: Users },
  { label: "AI match accuracy", value: "94.8%", delta: "+4.2%", icon: Gauge },
  { label: "Time to shortlist", value: "4.2d", delta: "-1.8d", icon: TrendingUp },
];

export const landingProof: Array<{ label: string; value: string }> = [
  { label: "AI screening conversations", value: "12k+" },
  { label: "Hiring velocity uplift", value: "2.4x" },
  { label: "Average recruiter time saved", value: "11h/wk" },
];

export const workflowSteps = [
  { title: "Create job", description: "Launch with refined scoring criteria, role context, and team preferences." },
  { title: "Candidates apply", description: "Applicants share profiles, portfolios, and resume docs in one place." },
  { title: "AI review", description: "HireLens compares every application against your job brief and highlights fit." },
  { title: "Shortlist & interview", description: "Recruiters review ranked candidates, collaborate, and move them through the funnel." },
  { title: "Offer & hire", description: "Track decisions, schedule interviews, and close the loop with the hiring team." },
];

export const jobPortfolio = [
  { title: "Senior Product Designer", company: "Northstar Labs", location: "Remote • US", type: "Full-time", salary: "$140k - $170k", match: 94, skills: ["UX Research", "Figma", "Design Systems", "SaaS"] },
  { title: "Senior Frontend Engineer", company: "Runway Cloud", location: "New York, NY", type: "Full-time", salary: "$160k - $195k", match: 92, skills: ["React", "TypeScript", "Performance", "GraphQL"] },
  { title: "Revenue Operations Manager", company: "Metric Forge", location: "Austin, TX", type: "Hybrid", salary: "$120k - $148k", match: 88, skills: ["Sales Ops", "Excel", "Forecasting", "CRM"] },
];

export const candidateApplications = [
  { position: "Senior Product Designer", company: "Northstar Labs", submitted: "2 days ago", status: "Shortlist", match: "94%" },
  { position: "Frontend Engineer", company: "Runway Cloud", submitted: "5 days ago", status: "Interview", match: "91%" },
  { position: "AI Product Analyst", company: "SignalIQ", submitted: "1 week ago", status: "Applied", match: "87%" },
];

export const recruiterCandidates = [
  { name: "Ava Rodriguez", role: "Senior Product Designer", score: "94%", stage: "Shortlist" },
  { name: "Jordan Kim", role: "Frontend Engineer", score: "91%", stage: "Interview" },
  { name: "Nina Patel", role: "Data Analyst", score: "89%", stage: "Assessment" },
];

export const pipelineColumns = [
  { title: "Applied", count: 18, accent: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  { title: "Screening", count: 12, accent: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200" },
  { title: "Interview", count: 8, accent: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200" },
  { title: "Offer", count: 3, accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" },
];

export const interviewSchedule = [
  { title: "Portfolio review", candidate: "Ava Rodriguez", time: "Wed, 10:00 AM", format: "Video interview", stage: "Shortlist" },
  { title: "Engineering panel", candidate: "Jordan Kim", time: "Thu, 2:30 PM", format: "Live coding session", stage: "Interview" },
  { title: "Hiring manager sync", candidate: "Mila Chen", time: "Fri, 9:15 AM", format: "Video interview", stage: "Screening" },
];

export const analyticsCards = [
  { label: "Offer acceptance rate", value: "86%", delta: "+12%" },
  { label: "Avg time to hire", value: "19 days", delta: "-4 days" },
  { label: "Diversity in shortlist", value: "41%", delta: "+9%" },
];

export const homeFeatures = [
  {
    icon: Gauge,
    title: "AI-powered match scoring",
    description: "Every resume is normalized, compared to the job brief, and ranked by role-fit signals that matter." ,
  },
  {
    icon: Workflow,
    title: "Structured hiring workflow",
    description: "Move candidates through a clear funnel from application to offer without losing context.",
  },
  {
    icon: Building2,
    title: "Team alignment",
    description: "Recruiters, hiring managers, and candidates stay in sync with shared notes and interview context.",
  },
];
