import mongoose from 'mongoose';

/**
 * FitnessPurpose Schema (Stage 19)
 * Represents the persistent user purpose: "Why are you training?"
 */
const fitnessPurposeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    purposeType: {
      type: String,
      required: [true, 'Please select a purpose type.'],
      enum: [
        'BUILD_DISCIPLINE',
        'IMPROVE_HEALTH',
        'INCREASE_ENERGY',
        'BUILD_CONFIDENCE',
        'IMPROVE_STRENGTH',
        'IMPROVE_ENDURANCE',
        'PREPARE_SPORT',
        'CHANGE_LIFESTYLE',
        'FEEL_BETTER',
        'SUPPORT_FAMILY',
        'PERSONAL_CHALLENGE',
        'CUSTOM',
      ],
      default: 'BUILD_DISCIPLINE',
    },
    customPurpose: {
      type: String,
      trim: true,
      maxlength: [280, 'Custom purpose cannot exceed 280 characters.'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FitnessPurpose = mongoose.models.FitnessPurpose || mongoose.model('FitnessPurpose', fitnessPurposeSchema);

export default FitnessPurpose;
