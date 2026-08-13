export type UserRole = "candidate" | "recruiter";
export type JobStatus = "Open" | "Closed";
export type ApplicationStatus = "Applied" | "Shortlisted" | "Interview" | "Offer" | "Hired" | "Rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  status: JobStatus;
  recruiterId: string;
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  email: string;
  resumeText: string;
  score: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  status: ApplicationStatus;
  createdAt: string;
};

export const users: User[] = [
  {
    id: "cand-1",
    name: "Ava Rodriguez",
    email: "ava@northstar.ai",
    password: "password123",
    role: "candidate",
  },
  {
    id: "rec-1",
    name: "Olivia Chen",
    email: "olivia@hirelens.ai",
    password: "password123",
    role: "recruiter",
  },
];

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    company: "Northstar Labs",
    location: "Remote • US",
    type: "Full-time",
    salary: "$140k - $170k",
    description:
      "Lead UX strategy for B2B SaaS growth products with a strong focus on research, design systems, and cross-functional product delivery.",
    requirements: ["UX Research", "Figma", "Design Systems", "Product Strategy", "B2B SaaS", "User Interviews"],
    status: "Open",
    recruiterId: "rec-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    title: "Senior Frontend Engineer",
    company: "Runway Cloud",
    location: "New York, NY",
    type: "Full-time",
    salary: "$160k - $195k",
    description:
      "Build modern frontend architecture for AI workflows, performance optimization, and highly scalable interfaces.",
    requirements: ["React", "TypeScript", "Performance", "GraphQL", "Testing", "UI Architecture"],
    status: "Open",
    recruiterId: "rec-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-3",
    title: "Revenue Operations Manager",
    company: "Metric Forge",
    location: "Austin, TX",
    type: "Hybrid",
    salary: "$120k - $148k",
    description:
      "Own forecasting, pipeline reporting, and sales process optimization across the GTM team.",
    requirements: ["Sales Operations", "CRM", "Forecasting", "Excel", "Pipeline Reporting", "Process Design"],
    status: "Open",
    recruiterId: "rec-1",
    createdAt: new Date().toISOString(),
  },
];

export const applications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    candidateId: "cand-1",
    candidateName: "Ava Rodriguez",
    email: "ava@northstar.ai",
    resumeText:
      "Senior Product Designer with 7 years of experience in B2B SaaS, UX research, design systems, product strategy, and user interviews.",
    score: 94,
    strengths: ["UX Research", "Design Systems", "B2B SaaS"],
    missingSkills: ["A/B Experimentation", "Accessibility Audits"],
    suggestions: ["Strengthen quantitative product storytelling.", "Highlight accessibility and experimentation work."],
    status: "Shortlisted",
    createdAt: new Date().toISOString(),
  },
];

export const seedStore = {
  users,
  jobs,
  applications,
};
