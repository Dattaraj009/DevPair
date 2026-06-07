import rateLimit from 'express-rate-limit';

// ── General API Rate Limit ────────────────────────────────────────────────
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// ── Auth Routes Rate Limit (stricter) ─────────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many auth attempts. Please wait 15 minutes.',
  },
});

// ── AI Routes Rate Limit ──────────────────────────────────────────────────
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a moment.',
  },
  // Optional: Skip for certain conditions
  skip: (req) => {
    // Example: Skip for admin users
    return req.user?.role === 'admin';
  }
});

export default { apiLimiter, authLimiter, aiLimiter };