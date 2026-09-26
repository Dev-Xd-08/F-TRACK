import mongoose from 'mongoose';

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    latestBMI: {
      heightCm: Number,
      weightKg: Number,
      bmi: Number,
      category: String,
      categoryColor: String,
      explanation: String,
      calculatedAt: { type: Date, default: Date.now },
    },
    latestCalories: {
      age: Number,
      sex: String,
      heightCm: Number,
      weightKg: Number,
      activityLevel: String,
      activityMultiplier: Number,
      bmr: Number,
      tdee: Number,
      calculatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const HealthProfile = mongoose.model('HealthProfile', healthProfileSchema);

export default HealthProfile;
