import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const isDevelopment = process.env.NODE_ENV === 'development';

// Rate limiters (disabled in development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 5, // Unlimited in dev
  message: 'Too many attempts, please try again later'
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 10000 : 100
});

// Public routes
router.post('/register', authLimiter, AuthController.register);
router.post('/verify-email', generalLimiter, AuthController.verifyEmail);
router.post('/login', authLimiter, AuthController.login);
router.post('/refresh-token', generalLimiter, AuthController.refreshToken);
router.post('/forgot-password', authLimiter, AuthController.forgotPassword);
router.post('/reset-password', authLimiter, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);

export default router;
