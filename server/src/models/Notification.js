import mongoose from 'mongoose';

/**
 * ⚔️ F-TRACK: Notification Model (Stage 11)
 * 
 * Persistent smart in-app notification record for authenticated hunters.
 * Guarantees duplicate safety per (user, dedupKey).
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'WORKOUT_REMINDER',
        'STREAK_REMINDER',
        'QUEST_REMINDER',
        'QUEST_COMPLETED',
        'ACHIEVEMENT_UNLOCKED',
        'RANK_PROGRESS',
        'SYSTEM',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    dedupKey: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast chronological user queries
notificationSchema.index({ user: 1, createdAt: -1 });

// Unique compound index preventing duplicate notifications for the same user & dedupKey
notificationSchema.index({ user: 1, dedupKey: 1 }, { unique: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
