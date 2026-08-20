import mongoose, { Schema, Document, Model } from 'mongoose';

export type OfferStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Withdrawn';

export interface IOffer extends Document {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  status: OfferStatus;
  details: {
    title: string;
    startDate: Date;
    salary: {
      amount: number;
      currency: string;
      period: string;
    };
    bonus?: number;
    equity?: {
      amount: number;
      type: string;
      vestingSchedule?: string;
    };
    benefits: string[];
    reportingTo?: string;
    location: string;
    workMode: string;
  };
  terms: {
    probationPeriod?: string;
    noticePeriod?: string;
    workingHours?: string;
  };
  expiryDate: Date;
  sentAt?: Date;
  respondedAt?: Date;
  rejectionReason?: string;
  notes?: string;
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
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
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Withdrawn'],
      default: 'Draft',
      required: true,
    },
    details: {
      title: {
        type: String,
        required: [true, 'Job title is required'],
      },
      startDate: {
        type: Date,
        required: [true, 'Start date is required'],
      },
      salary: {
        amount: {
          type: Number,
          required: [true, 'Salary amount is required'],
          min: [0, 'Salary must be positive'],
        },
        currency: {
          type: String,
          default: 'USD',
        },
        period: {
          type: String,
          enum: ['hourly', 'monthly', 'yearly'],
          default: 'yearly',
        },
      },
      bonus: {
        type: Number,
        min: [0, 'Bonus must be positive'],
      },
      equity: {
        amount: Number,
        type: String,
        vestingSchedule: String,
      },
      benefits: [String],
      reportingTo: String,
      location: {
        type: String,
        required: [true, 'Location is required'],
      },
      workMode: {
        type: String,
        enum: ['Remote', 'On-site', 'Hybrid'],
        required: true,
      },
    },
    terms: {
      probationPeriod: String,
      noticePeriod: String,
      workingHours: String,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    sentAt: Date,
    respondedAt: Date,
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    documentUrl: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
OfferSchema.index({ applicationId: 1 }, { unique: true });
OfferSchema.index({ jobId: 1 });
OfferSchema.index({ candidateId: 1 });
OfferSchema.index({ recruiterId: 1 });
OfferSchema.index({ companyId: 1 });
OfferSchema.index({ status: 1 });
OfferSchema.index({ expiryDate: 1 });
OfferSchema.index({ createdAt: -1 });

// Check if offer is expired
OfferSchema.pre('save', function (next: any) {
  if (this.status === 'Sent' && new Date() > this.expiryDate) {
    this.status = 'Expired';
  }
  next();
});

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);

export default Offer;
