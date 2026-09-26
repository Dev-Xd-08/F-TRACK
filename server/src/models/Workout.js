import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workout must belong to a warrior user'],
      index: true,
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: [
          'Running',
          'Walking',
          'Cycling',
          'Gym',
          'Swimming',
          'Yoga',
          'HIIT',
          'Sports',
          'Other',
        ],
        message: '{VALUE} is not a recognized training activity',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Workout duration must be at least 1 minute'],
    },
    caloriesBurned: {
      type: Number,
      required: [true, 'Calories burned is required'],
      min: [0, 'Calories burned cannot be negative'],
    },
    workoutDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Workout date is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient newest-first retrieval per user
workoutSchema.index({ user: 1, workoutDate: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
