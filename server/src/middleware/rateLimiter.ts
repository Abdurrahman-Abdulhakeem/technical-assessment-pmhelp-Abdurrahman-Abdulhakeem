import rateLimit from 'express-rate-limit';
import { SubscriptionTier } from '../types';

export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Global rate limiter
export const globalLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Auth rate limiter
export const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// Subscription-based appointment limiter
export const createSubscriptionLimiter = (tier: SubscriptionTier) => {
  const limits = {
    [SubscriptionTier.FREE]: { windowMs: 30 * 24 * 60 * 60 * 1000, max: 2 }, // 2 per month
    [SubscriptionTier.BASIC]: { windowMs: 30 * 24 * 60 * 60 * 1000, max: 5 }, // 5 per month
    [SubscriptionTier.PREMIUM]: { windowMs: 60 * 60 * 1000, max: 100 } // Essentially unlimited
  };

  const { windowMs, max } = limits[tier];
  return createRateLimiter(windowMs, max);
};