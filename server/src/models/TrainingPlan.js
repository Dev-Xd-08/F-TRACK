import mongoose from 'mongoose';

const DayScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    required: true,
  },
  plannedDuration: {
    type: Number,
    default: 25,
  },
  activityType: {
    type: String,
    default: 'General Training',
  },
  isRestDay: {
    type: Boolean,
    default: false,
  },
  isOptional: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    maxlength: 140,
    default: '',
  },
}, { _id: false });

const TrainingPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'Adaptive Weekly Training Plan',
    },
    purposeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FitnessPurpose',
      default: null,
    },
    goalIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FitnessGoal',
      },
    ],
    weeklyTargetSessions: {
      type: Number,
      min: 1,
      max: 7,
      default: 3,
    },
    preferredSessionDuration: {
      type: Number,
      min: 5,
      max: 180,
      default: 25,
    },
    preferredDays: {
      type: [String],
      enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      default: ['MON', 'WED', 'FRI'],
    },
    minimumSessionDuration: {
      type: Number,
      min: 5,
      max: 60,
      default: 15,
    },
    maximumSessionDuration: {
      type: Number,
      min: 15,
      max: 180,
      default: 45,
    },
    focusAreas: {
      type: [String],
      default: ['Discipline', 'General Fitness'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    schedule: [DayScheduleSchema],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TrainingPlan || mongoose.model('TrainingPlan', TrainingPlanSchema);
