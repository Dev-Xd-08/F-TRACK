import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) for a user ID
 * @param {string} id - The MongoDB user ID
 * @returns {string} - Signed JWT
 */
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_ftrack_ascension_2026';
  
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken;
