import mongoose, { Schema, Document, Model } from 'mongoose';

export type AssessmentStatus = 'Pending' | 'In-progress' | 'Completed' | 'Expired';
export type AssessmentType = 'coding' | 'quiz' | 'personality' | 'take-home' | 'video';

export interface IAssessment extends Document {
  applicationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  type: AssessmentType;
  title: string;
  description: string;
  instructions: string;
  timeLimit?: number; // in minutes
  deadline: Date;
  status: AssessmentStatus;
  score?: number;
  maxScore: number;
  passingScore: number;
  questions?: Array<{
    question: string;
    type: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
  }>;
  answers?: Array<{
    questionId: string;
    answer: string;
    isCorrect?: boolean;
    points: number;
  }>;
  submissionUrl?: string;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
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
      enum: ['coding', 'quiz', 'personality', 'take-home', 'video'],
      required: [true, 'Assessment type is required'],
    },
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    timeLimit: {
      type: Number,
      min: [5, 'Time limit must be at least 5 minutes'],
      max: [1440, 'Time limit cannot exceed 1440 minutes (24 hours)'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In-progress', 'Completed', 'Expired'],
      default: 'Pending',
      required: true,
    },
    score: {
      type: Number,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      default: 100,
      min: [1, 'Max score must be at least 1'],
    },
    passingScore: {
      type: Number,
      required: [true, 'Passing score is required'],
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100'],
    },
    questions: [
      {
        question: { type: String, required: true },
        type: { type: String, required: true },
        options: [String],
        correctAnswer: String,
        points: { type: Number, required: true, min: 0 },
      },
    ],
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
        isCorrect: Boolean,
        points: { type: Number, required: true, min: 0 },
      },
    ],
    submissionUrl: String,
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
AssessmentSchema.index({ applicationId: 1 });
AssessmentSchema.index({ jobId: 1 });
AssessmentSchema.index({ candidateId: 1 });
AssessmentSchema.index({ recruiterId: 1 });
AssessmentSchema.index({ status: 1 });
AssessmentSchema.index({ deadline: 1 });
AssessmentSchema.index({ type: 1 });
AssessmentSchema.index({ createdAt: -1 });

// Check if assessment is expired
AssessmentSchema.pre('save', function (next: any) {
  if (this.status === 'Pending' && new Date() > this.deadline) {
    this.status = 'Expired';
  }
  next();
});

const Assessment: Model<IAssessment> = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
