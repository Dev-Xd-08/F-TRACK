import FitnessPurpose from '../models/FitnessPurpose.js';
import {
  isMongoConnected,
  getDevPurpose,
  createOrUpdateDevPurpose,
  deleteDevPurpose,
} from '../utils/devStore.js';

/**
 * @desc    Get the authenticated user's fitness purpose
 * @route   GET /api/purpose
 * @access  Private
 */
export const getPurpose = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isMongoConnected()) {
      const purpose = await FitnessPurpose.findOne({ user: userId, active: true }).lean();
      return res.status(200).json({
        success: true,
        purpose: purpose || null,
      });
    }

    const devPurpose = await getDevPurpose(userId);
    return res.status(200).json({
      success: true,
      purpose: devPurpose || null,
    });
  } catch (error) {
    console.error(`[GET_PURPOSE ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve personal purpose.',
    });
  }
};

/**
 * @desc    Create or update the user's fitness purpose
 * @route   POST /api/purpose
 * @access  Private
 */
export const savePurpose = async (req, res) => {
  try {
    const userId = req.user._id;
    const { purposeType, customPurpose } = req.body;

    if (!purposeType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid purpose type.',
      });
    }

    if (purposeType === 'CUSTOM' && (!customPurpose || !customPurpose.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Custom purpose cannot be empty.',
      });
    }

    if (customPurpose && customPurpose.trim().length > 280) {
      return res.status(400).json({
        success: false,
        message: 'Custom purpose cannot exceed 280 characters.',
      });
    }

    if (isMongoConnected()) {
      let purpose = await FitnessPurpose.findOne({ user: userId });

      if (purpose) {
        purpose.purposeType = purposeType;
        purpose.customPurpose = customPurpose ? customPurpose.trim() : '';
        purpose.active = true;
        await purpose.save();
      } else {
        purpose = await FitnessPurpose.create({
          user: userId,
          purposeType,
          customPurpose: customPurpose ? customPurpose.trim() : '',
          active: true,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Purpose anchored successfully.',
        purpose,
      });
    }

    const savedDev = await createOrUpdateDevPurpose(userId, {
      purposeType,
      customPurpose: customPurpose ? customPurpose.trim() : '',
      active: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Purpose anchored successfully.',
      purpose: savedDev,
    });
  } catch (error) {
    console.error(`[SAVE_PURPOSE ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to record personal purpose.',
    });
  }
};

/**
 * @desc    Clear or deactivate the user's fitness purpose
 * @route   DELETE /api/purpose
 * @access  Private
 */
export const removePurpose = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isMongoConnected()) {
      await FitnessPurpose.findOneAndDelete({ user: userId });
      return res.status(200).json({
        success: true,
        message: 'Purpose cleared successfully.',
      });
    }

    await deleteDevPurpose(userId);
    return res.status(200).json({
      success: true,
      message: 'Purpose cleared successfully.',
    });
  } catch (error) {
    console.error(`[REMOVE_PURPOSE ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear personal purpose.',
    });
  }
};
