import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import {
  isMongoConnected,
  findDevUserByEmail,
  createDevUser,
} from '../utils/devStore.js';

/**
 * @desc    Register a new warrior user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Warrior name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid communication crystal email address.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email format.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters.',
      });
    }

    // 2. Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    let existingUser;
    if (isMongoConnected()) {
      existingUser = await User.findOne({ email: normalizedEmail });
    } else {
      existingUser = await findDevUserByEmail(normalizedEmail);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A warrior with this email crystal already exists in the system.',
      });
    }

    // 3. Create user
    let user;
    if (isMongoConnected()) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
      });
    } else {
      user = await createDevUser({
        name: name.trim(),
        email: normalizedEmail,
        password,
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return safe user data
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error(`[REGISTER ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || 'System error during warrior registration.',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email crystal and access password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user by email
    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = await findDevUserByEmail(normalizedEmail);
    }

    // 3. Check password match securely (timing safe comparison)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Return safe user data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error(`[LOGIN ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || 'System error during warrior authentication.',
    });
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error(`[GET_ME ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'System error retrieving warrior identity.',
    });
  }
};
