import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'candidate' | 'recruiter' | 'admin' | 'moderator' | 'superadmin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
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
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  oauthProviders?: {
    google?: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  };
  lastLogin?: Date;
  loginHistory?: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    success: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  isLocked(): boolean;
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
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin', 'moderator', 'superadmin'],
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    oauthProviders: {
      google: {
        id: String,
        email: String,
        name: String,
        avatar: String,
        accessToken: String,
        refreshToken: String,
      },
    },
    lastLogin: Date,
    loginHistory: [
      {
        ip: String,
        userAgent: String,
        timestamp: { type: Date, default: Date.now },
        success: Boolean,
      },
    ],
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
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ 'oauthProviders.google.id': 1 });

// Hash password before saving
UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Increment failed login attempts
UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  // If already locked and lock has expired, reset
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.resetLoginAttempts();
  }
  
  // If already locked, just return
  if (this.lockUntil && this.lockUntil > new Date()) {
    return;
  }
  
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
  }
  
  await this.save();
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Check if account is locked
UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
