import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  resume: {
    originalName: string;
    storedName: string;
    url: string;
    size: number;
    mimeType: string;
  };
  resumeText: string;
  coverLetter?: string;
  aiAnalysis: {
    score: number;
    strengths: string[];
    missingSkills: string[];
    suggestions: string[];
    analyzedAt: Date;
    modelUsed?: string;
  };
  status: ApplicationStatus;
  notes?: string;
  source?: string;
  appliedAt: Date;
  statusHistory: Array<{
    status: ApplicationStatus;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate is required'],
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    candidateName: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: [true, 'Candidate email is required'],
      trim: true,
      lowercase: true,
    },
    resume: {
      originalName: {
        type: String,
        required: [true, 'Original filename is required'],
      },
      storedName: {
        type: String,
        required: [true, 'Stored filename is required'],
      },
      url: {
        type: String,
        required: [true, 'Resume URL is required'],
      },
      size: {
        type: Number,
        required: [true, 'File size is required'],
        min: 0,
      },
      mimeType: {
        type: String,
        required: [true, 'MIME type is required'],
      },
    },
    resumeText: {
      type: String,
      required: [true, 'Resume text is required'],
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    aiAnalysis: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      strengths: [String],
      missingSkills: [String],
      suggestions: [String],
      analyzedAt: {
        type: Date,
        default: Date.now,
      },
      modelUsed: String,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'],
      default: 'Applied',
      required: true,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    source: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'],
          required: true,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ candidateId: 1 });
ApplicationSchema.index({ recruiterId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ 'aiAnalysis.score': -1 });
ApplicationSchema.index({ appliedAt: -1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // Prevent duplicate applications

// Ensure one application per job per candidate
ApplicationSchema.pre('save', async function (next: any) {
  if (this.isNew) {
    const existing = await Application.findOne({
      jobId: this.jobId,
      candidateId: this.candidateId,
    });
    if (existing) {
      const error = new Error('You have already applied to this job');
      next(error);
      return;
    }
  }
  next();
});

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
