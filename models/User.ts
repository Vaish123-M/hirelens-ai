import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: mongoose.Types.ObjectId;
  profile?: {
    title?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    bio?: string;
    skills?: string[];
    experience?: Array<{
      company: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      description?: string;
    }>;
    education?: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
    }>;
  };
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    profile: {
      title: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      bio: { type: String, maxlength: 500 },
      skills: [String],
      experience: [
        {
          company: { type: String, required: true },
          position: { type: String, required: true },
          startDate: { type: Date, required: true },
          endDate: Date,
          current: { type: Boolean, default: false },
          description: String,
        },
      ],
      education: [
        {
          institution: { type: String, required: true },
          degree: { type: String, required: true },
          field: { type: String, required: true },
          startDate: { type: Date, required: true },
          endDate: Date,
          current: { type: Boolean, default: false },
        },
      ],
    },
    avatar: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
