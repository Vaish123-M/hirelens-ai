import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  foundedYear?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  settings?: {
    allowPublicJobs?: boolean;
    requireApproval?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Company slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    logo: String,
    industry: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    location: String,
    foundedYear: {
      type: Number,
      min: [1800, 'Founded year must be after 1800'],
      max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    settings: {
      allowPublicJobs: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanySchema.index({ slug: 1 }, { unique: true });
CompanySchema.index({ name: 1 });
CompanySchema.index({ industry: 1 });
CompanySchema.index({ isActive: 1 });
CompanySchema.index({ createdAt: -1 });

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
