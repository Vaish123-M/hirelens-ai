import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { applications, candidateProfiles } from "@/lib/store";
import { extractResumeText, generateAIAnalysis } from "@/lib/ai";
import { jobs } from "@/lib/store";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request) ?? {
    sub: "cand-1",
    email: "ava@northstar.ai",
    role: "candidate" as const,
    name: "Ava Rodriguez",
  };

  if (session.role !== "candidate") {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const profile = candidateProfiles[session.sub] || {
    name: session.name,
    title: "Product professional",
    experience: "Professional experience",
    match: 88,
    strengths: ["Role fit", "Communication", "Execution"],
    missingSkills: ["Role-specific depth"],
    suggestions: ["Add more measurable outcomes to your resume."],
  };

  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request) ?? {
    sub: "cand-1",
    email: "ava@northstar.ai",
    role: "candidate" as const,
    name: "Ava Rodriguez",
  };

  if (session.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
  }

  if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
    return NextResponse.json({ error: "Only PDF or DOCX resumes are supported" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Resume must be 10MB or less" }, { status: 400 });
  }

  const resumeText = await extractResumeText(file);
  const targetJob = jobs[0];
  const analysis = targetJob ? await generateAIAnalysis(resumeText, targetJob) : { score: 88, strengths: ["Communication"], missingSkills: ["Role-specific depth"], suggestions: ["Add measurable product outcomes." ] };

  const profile = {
    name: session.name,
    title: "Senior Product Designer",
    experience: "7 yrs experience",
    match: analysis.score,
    strengths: analysis.strengths.slice(0, 3),
    missingSkills: analysis.missingSkills.slice(0, 2),
    suggestions: analysis.suggestions.slice(0, 2),
    lastUpdated: new Date().toISOString(),
  };

  candidateProfiles[session.sub] = profile;

  return NextResponse.json({
    profile,
    applications: applications.filter((item) => item.candidateId === session.sub),
  });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request) ?? {
    sub: "cand-1",
    email: "ava@northstar.ai",
    role: "candidate" as const,
    name: "Ava Rodriguez",
  };

  if (session.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const nextProfile = {
    ...(candidateProfiles[session.sub] || {
      name: session.name,
      title: "Product professional",
      experience: "Professional experience",
      match: 88,
      strengths: ["Communication", "Execution"],
      missingSkills: ["Role-specific depth"],
      suggestions: ["Add measurable business outcomes to your profile."],
    }),
    ...body,
    lastUpdated: new Date().toISOString(),
  };

  candidateProfiles[session.sub] = nextProfile;
  return NextResponse.json({ profile: nextProfile });
}
