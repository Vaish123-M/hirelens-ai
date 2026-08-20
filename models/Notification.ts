import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 'application' | 'interview' | 'offer' | 'assessment' | 'feedback' | 'system';
export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  actionUrl?: string;
  relatedId?: {
    model: string;
    id: mongoose.Types.ObjectId;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  expiresAt?: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: ['application', 'interview', 'offer', 'assessment', 'feedback', 'system'],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
      required: true,
    },
    actionUrl: String,
    relatedId: {
      model: String,
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
      required: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    expiresAt: Date,
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Auto-archive read notifications after 30 days
NotificationSchema.pre('save', function (next: any) {
  if (this.status === 'read' && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
