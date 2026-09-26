import mongoose from 'mongoose';

/**
 * ⚔️ F-TRACK: Achievement Model (Stage 9)
 * 
 * Represents an individual achievement unlock record for an authenticated warrior.
 * Guarantees single-unlock uniqueness per (user, achievementId).
 */
const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    unlocked: {
      type: Boolean,
      default: false,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    targetValue: {
      type: Number,
      default: 0,
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

// Compound unique index: A warrior has at most one record per achievement
achievementSchema.index(
  { user: 1, achievementId: 1 },
  { unique: true }
);

// Fast chronological unlocked achievement query index
achievementSchema.index(
  { user: 1, unlocked: 1, unlockedAt: -1 }
);

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);

export default Achievement;
