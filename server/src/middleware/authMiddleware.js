import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected, findDevUserById } from '../utils/devStore.js';

/**
 * Protect routes by verifying JWT in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'fallback_development_secret_ftrack_ascension_2026';
      const decoded = jwt.verify(token, secret);

      // Fetch user from DB excluding password (with devStore fallback if MongoDB offline)
      let user;
      if (isMongoConnected()) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = await findDevUserById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: Warrior identity not found.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(`[AUTH MIDDLEWARE ERROR] ${error.message}`);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Portal token has expired or is invalid.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No portal authorization token provided.',
    });
  }
};
