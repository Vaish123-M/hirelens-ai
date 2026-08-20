import mongoose, { Schema, Document, Model } from 'mongoose';

export type FeedbackType = 'interview' | 'application' | 'assessment';

export interface IFeedback extends Document {
  applicationId: mongoose.Types.ObjectId;
  interviewId?: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  type: FeedbackType;
  rating: {
    overall: number; // 1-5
    communication?: number;
    technical?: number;
    culture?: number;
    potential?: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  notes?: string;
  isHireRecommended: boolean;
  wouldProceed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application is required'],
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate is required'],
    },
    interviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Interviewer is required'],
    },
    type: {
      type: String,
      enum: ['interview', 'application', 'assessment'],
      required: [true, 'Feedback type is required'],
    },
    rating: {
      overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      communication: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      technical: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      culture: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      potential: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
    },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    isHireRecommended: {
      type: Boolean,
      required: [true, 'Hire recommendation is required'],
    },
    wouldProceed: {
      type: Boolean,
      required: [true, 'Proceed decision is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FeedbackSchema.index({ applicationId: 1 });
FeedbackSchema.index({ interviewId: 1 });
FeedbackSchema.index({ candidateId: 1 });
FeedbackSchema.index({ interviewerId: 1 });
FeedbackSchema.index({ type: 1 });
FeedbackSchema.index({ createdAt: -1 });

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
