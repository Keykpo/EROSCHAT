import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  readBy: string[]; // Array of userIds who have read the message
  createdAt: Date;
  moderationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderationFlags?: string[];
}

const MessageSchema: Schema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000, // Max message length
    },
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'SYSTEM'],
      default: 'TEXT',
    },
    readBy: {
      type: [String],
      default: [],
    },
    moderationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
    moderationFlags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient chat message queries
MessageSchema.index({ chatId: 1, createdAt: -1 });

// Index for sender's messages
MessageSchema.index({ senderId: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
