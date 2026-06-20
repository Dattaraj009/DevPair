import jwt from "jsonwebtoken";

/**
 * Sign a short‑lived access token (15 minutes).
 * @param {*} user - user object containing at least _id and role.
 * @returns {string} JWT access token.
 */
export const signAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

/**
 * Sign a long‑lived refresh token (7 days).
 * @param {*} user - user object containing at least _id and role.
 * @returns {string} JWT refresh token.
 */
export const signRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};