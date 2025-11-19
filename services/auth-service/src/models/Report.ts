import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: string;
  reportedUserId: string;
  chatId?: string;
  messageId?: string;
  reason: 'INAPPROPRIATE' | 'SPAM' | 'HARASSMENT' | 'FAKE' | 'UNDERAGE' | 'OTHER';
  description?: string;
  context: any[]; // Last 10 messages for context
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: 'NONE' | 'WARNING' | 'SUSPENSION' | 'BAN';
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    reporterId: {
      type: String,
      required: true,
      index: true,
    },
    reportedUserId: {
      type: String,
      required: true,
      index: true,
    },
    chatId: {
      type: String,
      index: true,
    },
    messageId: {
      type: String,
    },
    reason: {
      type: String,
      enum: ['INAPPROPRIATE', 'SPAM', 'HARASSMENT', 'FAKE', 'UNDERAGE', 'OTHER'],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    context: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: String,
    },
    reviewedAt: {
      type: Date,
    },
    action: {
      type: String,
      enum: ['NONE', 'WARNING', 'SUSPENSION', 'BAN'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding pending reports
ReportSchema.index({ status: 1, createdAt: -1 });

// Index for finding reports by reported user
ReportSchema.index({ reportedUserId: 1, createdAt: -1 });

export default mongoose.model<IReport>('Report', ReportSchema);
