// Legacy types for backward compatibility
// These are now replaced by Mongoose models in the models/ directory
// Kept here for any remaining frontend references

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

export type CandidateProfile = {
  name: string;
  title: string;
  experience: string;
  match: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  lastUpdated?: string;
};

// Empty arrays for backward compatibility
// Data is now stored in MongoDB
export const users: User[] = [];
export const jobs: Job[] = [];
export const applications: Application[] = [];
export const candidateProfiles: Record<string, CandidateProfile> = {};

export const seedStore = {
  users,
  jobs,
  applications,
  candidateProfiles,
};
