import mongoose from 'mongoose';

/**
 * ⚔️ F-TRACK: QuestProgress Model (Stage 8)
 * 
 * Represents a warrior's verified progress on a specific quest instance for a discrete period.
 * Enforces single-instance uniqueness per (user, questId, periodStart).
 */
const questProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questId: {
      type: String,
      required: true,
    },
    periodType: {
      type: String,
      required: true,
      enum: ['DAILY', 'WEEKLY'],
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: A warrior has exactly one progress record per quest per period
questProgressSchema.index(
  { user: 1, questId: 1, periodStart: 1 },
  { unique: true }
);

// Index for rapid quest history retrieval
questProgressSchema.index(
  { user: 1, completed: 1, completedAt: -1 }
);

const QuestProgress = mongoose.models.QuestProgress || mongoose.model('QuestProgress', questProgressSchema);

export default QuestProgress;
