import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again later'
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
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
