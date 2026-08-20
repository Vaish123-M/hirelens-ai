import mongoose, { Schema, Document, Model } from 'mongoose';

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import';
export type AuditEntity = 'user' | 'company' | 'job' | 'application' | 'interview' | 'feedback' | 'assessment' | 'offer' | 'notification' | 'settings';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: mongoose.Types.ObjectId;
  details: {
    ip?: string;
    userAgent?: string;
    changes?: Record<string, { old: any; new: any }>;
    metadata?: Record<string, any>;
  };
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import'],
      required: [true, 'Action is required'],
    },
    entity: {
      type: String,
      enum: ['user', 'company', 'job', 'application', 'interview', 'feedback', 'assessment', 'offer', 'notification', 'settings'],
      required: [true, 'Entity is required'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    details: {
      ip: String,
      userAgent: String,
      changes: {
        type: Map,
        of: {
          old: Schema.Types.Mixed,
          new: Schema.Types.Mixed,
        },
      },
      metadata: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false, // We use custom timestamp field
  }
);

// Indexes
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ entity: 1 });
AuditLogSchema.index({ entityId: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1, action: 1 });

// TTL index - automatically delete logs after 1 year
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
