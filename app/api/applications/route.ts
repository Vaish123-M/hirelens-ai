import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Application, Job, User } from "@/models";
import { extractResumeText, generateAIAnalysis } from "@/lib/ai";
import { AuditLog } from "@/models";
import { randomUUID } from 'crypto';
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromRequest(request);

    if (!session || session.role !== "candidate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const jobId = String(formData.get("jobId") || "");
    const resume = formData.get("resume") as File | null;
    const coverLetter = formData.get("coverLetter") as string | null;

    if (!jobId || !resume || resume.size === 0) {
      return NextResponse.json({ error: "Job and resume are required" }, { status: 400 });
    }

    if (resume.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be 10MB or less" }, { status: 400 });
    }

    const selectedJob = await Job.findById(jobId);
    if (!selectedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const user = await User.findById(session.sub);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resumeText = await extractResumeText(resume);
    const analysis = await generateAIAnalysis(resumeText, selectedJob);

    // Generate unique filename
    const storedName = `${session.sub}_${Date.now()}_${randomUUID().substring(0, 8)}${resume.name.substring(resume.name.lastIndexOf('.'))}`;

    const newApplication = await Application.create({
      jobId,
      candidateId: session.sub,
      recruiterId: selectedJob.recruiterId,
      candidateName: user.name,
      candidateEmail: user.email,
      resume: {
        originalName: resume.name,
        storedName,
        url: `/resumes/${storedName}`,
        size: resume.size,
        mimeType: resume.type,
      },
      resumeText,
      coverLetter: coverLetter || undefined,
      aiAnalysis: {
        score: analysis.score,
        strengths: analysis.strengths,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        analyzedAt: new Date(),
        modelUsed: process.env.OPENAI_API_KEY ? 'gpt-4o-mini' : 'heuristic',
      },
      status: "Applied",
      appliedAt: new Date(),
      statusHistory: [
        {
          status: "Applied",
          changedBy: session.sub,
          changedAt: new Date(),
        },
      ],
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Create audit log
    await AuditLog.create({
      userId: session.sub,
      action: 'create',
      entity: 'application',
      entityId: newApplication._id as any,
      details: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: { jobId },
      },
    });

    const populatedApplication = await Application.findById(newApplication._id as any)
      .populate('jobId')
      .populate('candidateId', 'name email')
      .populate('recruiterId', 'name email');

    return NextResponse.json({ application: populatedApplication }, { status: 201 });
  } catch (error: any) {
    logger.error('Create application error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');

    const query: any = {};
    if (session.role === "candidate") {
      query.candidateId = session.sub;
    } else if (session.role === "recruiter") {
      query.recruiterId = session.sub;
    }
    
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;

    const applications = await Application.find(query)
      .populate('jobId')
      .populate('candidateId', 'name email profile')
      .populate('recruiterId', 'name email')
      .sort({ appliedAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    logger.error('Get applications error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
