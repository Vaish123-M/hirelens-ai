import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, Application, Job } from "@/models";
import { extractResumeText, generateAIAnalysis } from "@/lib/ai";
import { isSameOrigin } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = getSessionFromRequest(request);

    if (!session || session.role !== "candidate") {
      return NextResponse.json({ profile: null }, { status: 401 });
    }

    const user = await User.findById(session.sub).select('-password');

    if (!user) {
      return NextResponse.json({ profile: null }, { status: 401 });
    }

    // Get user's applications for match analysis
    const applications = await Application.find({ candidateId: session.sub })
      .populate('jobId')
      .sort({ createdAt: -1 });

    // Calculate average match score from applications
    const avgMatch = applications.length > 0 
      ? Math.round(applications.reduce((sum, app) => sum + app.aiAnalysis.score, 0) / applications.length)
      : 0;

    const profile = {
      name: user.name,
      title: user.profile?.title || "Product professional",
      experience: user.profile?.experience || "Professional experience",
      match: avgMatch || 88,
      strengths: user.profile?.skills || ["Role fit", "Communication", "Execution"],
      missingSkills: [],
      suggestions: ["Add more measurable outcomes to your resume."],
      lastUpdated: user.updatedAt.toISOString(),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ profile: null }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    await connectDB();
    const session = getSessionFromRequest(request);

    if (!session || session.role !== "candidate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    if (!file.name.match(/\.(pdf|docx)$/i)) {
      return NextResponse.json({ error: "Only PDF or DOCX resumes are supported" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be 10MB or less" }, { status: 400 });
    }

    const resumeText = await extractResumeText(file);
    
    // Get the most recent open job for analysis
    const targetJob = await Job.findOne({ status: 'Open' }).sort({ createdAt: -1 });
    
    const analysis = targetJob ? await generateAIAnalysis(resumeText, targetJob) : { 
      score: 88, 
      strengths: ["Communication"], 
      missingSkills: ["Role-specific depth"], 
      suggestions: ["Add measurable product outcomes."] 
    };

    // Update user profile with extracted info
    const user = await User.findById(session.sub);
    if (user) {
      user.profile = {
        ...user.profile,
        skills: analysis.strengths,
      };
      await user.save();
    }

    const profile = {
      name: session.name,
      title: user?.profile?.title || "Senior Product Designer",
      experience: user?.profile?.experience || "7 yrs experience",
      match: analysis.score,
      strengths: analysis.strengths.slice(0, 3),
      missingSkills: analysis.missingSkills.slice(0, 2),
      suggestions: analysis.suggestions.slice(0, 2),
      lastUpdated: new Date().toISOString(),
    };

    const applications = await Application.find({ candidateId: session.sub })
      .populate('jobId')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      profile,
      applications,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    await connectDB();
    const session = getSessionFromRequest(request);

    if (!session || session.role !== "candidate") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const user = await User.findById(session.sub);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.profile = {
      ...user.profile,
      ...body,
    };
    await user.save();

    const profile = {
      name: user.name,
      title: user.profile?.title || "Product professional",
      experience: user.profile?.experience || "Professional experience",
      match: 88,
      strengths: user.profile?.skills || ["Communication", "Execution"],
      missingSkills: [],
      suggestions: ["Add measurable business outcomes to your profile."],
      lastUpdated: user.updatedAt.toISOString(),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
