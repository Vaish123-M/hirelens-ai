import mongoose, { Schema, Document, Model } from 'mongoose';

export type JobStatus = 'Open' | 'Closed' | 'Draft' | 'Paused';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
export type WorkMode = 'Remote' | 'On-site' | 'Hybrid';

export interface IJob extends Document {
  title: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  location: string;
  type: JobType;
  workMode: WorkMode;
  salary: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
    display: string;
  };
  department?: string;
  experienceLevel?: string;
  skills: string[];
  status: JobStatus;
  publishedAt?: Date;
  expiresAt?: Date;
  applicationCount: number;
  viewCount: number;
  settings?: {
    allowRemote?: boolean;
    visaSponsorship?: boolean;
    urgent?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Job slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [50, 'Description must be at least 50 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: [String],
      required: [true, 'Requirements are required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one requirement is required',
      },
    },
    responsibilities: [String],
    benefits: [String],
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time',
      required: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'On-site',
      required: true,
    },
    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'yearly' },
      display: {
        type: String,
        required: [true, 'Salary display is required'],
      },
    },
    department: String,
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'],
    },
    skills: [String],
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft', 'Paused'],
      default: 'Open',
      required: true,
    },
    publishedAt: Date,
    expiresAt: Date,
    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    settings: {
      allowRemote: { type: Boolean, default: false },
      visaSponsorship: { type: Boolean, default: false },
      urgent: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
JobSchema.index({ slug: 1 }, { unique: true });
JobSchema.index({ companyId: 1 });
JobSchema.index({ recruiterId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ type: 1 });
JobSchema.index({ workMode: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ expiresAt: 1 });
JobSchema.index({ location: 'text', title: 'text', description: 'text' });

// Update applicationCount when applications are created/deleted
JobSchema.pre('save', function (next: any) {
  if (this.isModified('status') && this.status === 'Open' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
