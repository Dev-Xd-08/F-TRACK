import { getUserPersonalRecords } from '../utils/recordEngine.js';

/**
 * @desc    Get Personal Record Matrix for authenticated warrior
 * @route   GET /api/records
 * @access  Private
 */
export const getRecords = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await getUserPersonalRecords(userId);

    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    console.error(`[GET_RECORDS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to access personal record matrix.',
    });
  }
};

export default {
  getRecords,
};
