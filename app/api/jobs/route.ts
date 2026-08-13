import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { Job, jobs } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const newJob: Job = {
    id: `job-${Date.now()}`,
    title: body.title,
    company: body.company,
    location: body.location,
    type: body.type,
    salary: body.salary,
    description: body.description,
    requirements: Array.isArray(body.requirements) ? body.requirements : [],
    status: "Open",
    recruiterId: session.sub,
    createdAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  return NextResponse.json({ job: newJob }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...rest } = await request.json();
  const jobIndex = jobs.findIndex((job) => job.id === id);
  if (jobIndex === -1) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  jobs[jobIndex] = { ...jobs[jobIndex], ...rest };
  return NextResponse.json({ job: jobs[jobIndex] });
}
