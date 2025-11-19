import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  chatId: string; // References PostgreSQL chat ID
  userAId: string;
  userBId: string;
  status: 'ACTIVE' | 'ENDED' | 'MATCHED';
  createdAt: Date;
  endsAt: Date;
  extendedCount: number;
  lastMessageAt?: Date;
  matchRequestedBy?: string; // userId who requested match
  matchStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const ChatSchema: Schema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userAId: {
      type: String,
      required: true,
      index: true,
    },
    userBId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ENDED', 'MATCHED'],
      default: 'ACTIVE',
      index: true,
    },
    endsAt: {
      type: Date,
      required: true,
      index: true,
    },
    extendedCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
    },
    matchRequestedBy: {
      type: String,
    },
    matchStatus: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding active chats by user
ChatSchema.index({ userAId: 1, status: 1 });
ChatSchema.index({ userBId: 1, status: 1 });

// Index for auto-termination job
ChatSchema.index({ endsAt: 1, status: 1 });

export default mongoose.model<IChat>('Chat', ChatSchema);
