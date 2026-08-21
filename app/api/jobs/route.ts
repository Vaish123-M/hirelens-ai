import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Job, Company, User } from "@/models";
import { AuditLog } from "@/models";
import { logger } from "@/lib/logger";
import { isSameOrigin } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const recruiterId = searchParams.get('recruiterId');
    const companyId = searchParams.get('companyId');

    const query: any = {};
    if (status) query.status = status;
    if (recruiterId) query.recruiterId = recruiterId;
    if (companyId) query.companyId = companyId;

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo location')
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ jobs });
  } catch (error) {
    logger.error('Get jobs error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    await connectDB();
    const session = getSessionFromRequest(request);
    
    if (!session || session.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Find or validate company
    let companyId;
    if (body.companyId) {
      companyId = body.companyId;
    } else {
      // Create company if it doesn't exist
      const company = await Company.findOneAndUpdate(
        { name: body.company },
        { 
          name: body.company,
          slug: body.company.toLowerCase().replace(/\s+/g, '-'),
          location: body.location 
        },
        { upsert: true, new: true }
      );
      companyId = company._id;
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newJob = await Job.create({
      title: body.title,
      slug: `${slug}-${Date.now()}`,
      companyId,
      recruiterId: session.sub,
      description: body.description,
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      responsibilities: body.responsibilities || [],
      benefits: body.benefits || [],
      location: body.location,
      type: body.type || 'Full-time',
      workMode: body.workMode || 'On-site',
      salary: {
        display: body.salary,
        currency: 'USD',
        period: 'yearly',
      },
      department: body.department,
      experienceLevel: body.experienceLevel,
      skills: body.skills || body.requirements || [],
      status: "Open",
      publishedAt: new Date(),
      settings: body.settings || {},
    });

    // Create audit log
    await AuditLog.create({
      userId: session.sub,
      action: 'create',
      entity: 'job',
      entityId: newJob._id,
      details: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    const populatedJob = await Job.findById(newJob._id)
      .populate('companyId', 'name logo location')
      .populate('recruiterId', 'name email');

    return NextResponse.json({ job: populatedJob }, { status: 201 });
  } catch (error) {
    logger.error('Create job error:', error);
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
    
    if (!session || session.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;
    
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if user owns this job
    if (job.recruiterId.toString() !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Track changes for audit log
    const changes: Record<string, { old: any; new: any }> = {};
    const editableFields = ['title', 'description', 'requirements', 'responsibilities', 'benefits', 'location', 'type', 'workMode', 'department', 'experienceLevel', 'skills', 'status', 'settings', 'salary'] as const;
    for (const key of editableFields) {
      if (body[key] !== undefined && (job as any)[key] !== body[key]) {
        changes[key] = { old: (job as any)[key], new: body[key] };
        (job as any)[key] = body[key];
      }
    }
    await job.save();

    // Create audit log if there were changes
    if (Object.keys(changes).length > 0) {
      await AuditLog.create({
        userId: session.sub,
        action: 'update',
        entity: 'job',
        entityId: job._id,
        details: {
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          changes,
        },
      });
    }

    const populatedJob = await Job.findById(job._id)
      .populate('companyId', 'name logo location')
      .populate('recruiterId', 'name email');

    return NextResponse.json({ job: populatedJob });
  } catch (error) {
    logger.error('Update job error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
