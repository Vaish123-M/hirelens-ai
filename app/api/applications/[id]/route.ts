import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Application } from "@/models";
import { AuditLog } from "@/models";
import { logger } from "@/lib/logger";
import { isSameOrigin } from "@/lib/config";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    await connectDB();
    const session = getSessionFromRequest(request);
    
    if (!session || session.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, notes } = await request.json();

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Check if recruiter owns this application
    if (application.recruiterId?.toString() !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const oldStatus = application.status;
    application.status = status;
    application.notes = notes;
    
    // Add to status history
    application.statusHistory.push({
      status,
      changedBy: session.sub as any,
      changedAt: new Date(),
      notes,
    });

    await application.save();

    // Create audit log
    await AuditLog.create({
      userId: session.sub,
      action: 'update',
      entity: 'application',
      entityId: application._id,
      details: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        changes: {
          status: { old: oldStatus, new: status },
        },
      },
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('jobId')
      .populate('candidateId', 'name email')
      .populate('recruiterId', 'name email');

    return NextResponse.json({ application: populatedApplication });
  } catch (error) {
    logger.error('Update application error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
