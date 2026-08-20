import mongoose, { Schema, Document, Model } from 'mongoose';

export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
export type InterviewType = 'Phone' | 'Video' | 'On-site' | 'Technical' | 'Panel';

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  type: InterviewType;
  status: InterviewStatus;
  scheduledDate: Date;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  interviewers: Array<{
    userId: mongoose.Types.ObjectId;
    name: string;
    role: string;
  }>;
  notes?: string;
  feedback?: mongoose.Types.ObjectId; // Reference to Feedback document
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application is required'],
    },
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
    type: {
      type: String,
      enum: ['Phone', 'Video', 'On-site', 'Technical', 'Panel'],
      required: [true, 'Interview type is required'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'],
      default: 'Scheduled',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 480 minutes (8 hours)'],
    },
    location: String,
    meetingLink: String,
    meetingId: String,
    meetingPassword: String,
    interviewers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        role: String,
      },
    ],
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    feedback: {
      type: Schema.Types.ObjectId,
      ref: 'Feedback',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
InterviewSchema.index({ applicationId: 1 });
InterviewSchema.index({ jobId: 1 });
InterviewSchema.index({ candidateId: 1 });
InterviewSchema.index({ recruiterId: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ scheduledDate: 1 });
InterviewSchema.index({ createdAt: -1 });

const Interview: Model<IInterview> = mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);

export default Interview;
