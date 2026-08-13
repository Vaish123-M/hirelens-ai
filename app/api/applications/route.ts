import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Application, applications, jobs } from "@/lib/store";
import { extractResumeText, generateAIAnalysis } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const jobId = String(formData.get("jobId") || "");
  const resume = formData.get("resume") as File | null;

  if (!jobId || !resume || resume.size === 0) {
    return NextResponse.json({ error: "Job and resume are required" }, { status: 400 });
  }

  if (resume.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Resume must be 10MB or less" }, { status: 400 });
  }

  const selectedJob = jobs.find((job) => job.id === jobId);
  if (!selectedJob) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const resumeText = await extractResumeText(resume);
  const analysis = await generateAIAnalysis(resumeText, selectedJob);

  const newApplication: Application = {
    id: `app-${Date.now()}`,
    jobId,
    candidateId: session.sub,
    candidateName: session.name,
    email: session.email,
    resumeText,
    score: analysis.score,
    strengths: analysis.strengths,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
    status: "Applied",
    createdAt: new Date().toISOString(),
  };

  applications.push(newApplication);

  return NextResponse.json({ application: newApplication }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = session.role === "candidate"
    ? applications.filter((item) => item.candidateId === session.sub)
    : applications;

  return NextResponse.json({ applications: items });
}
