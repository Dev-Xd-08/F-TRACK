import mongoose from 'mongoose';

const UserLifeContextSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    lifeLoad: {
      type: String,
      enum: ['LIGHT', 'NORMAL', 'BUSY', 'VERY_BUSY'],
      default: 'NORMAL',
    },
    todayAvailableMinutes: {
      type: Number,
      enum: [5, 10, 15, 20, 30, 45, 60],
      default: 25,
    },
    lastAvailabilityDate: {
      type: String, // YYYY-MM-DD to reset daily if desired
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserLifeContext || mongoose.model('UserLifeContext', UserLifeContextSchema);
