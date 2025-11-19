import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// All user routes require authentication
router.use(authenticateToken);
router.use(userLimiter);

// GET /api/v1/users/me - Get current user
router.get('/me', UserController.getCurrentUser);

// PATCH /api/v1/users/me - Update current user
router.patch('/me', UserController.updateUser);

// DELETE /api/v1/users/me - Delete account
router.delete('/me', UserController.deleteUser);

// GET /api/v1/users/me/stats - Get user stats
router.get('/me/stats', UserController.getUserStats);

export default router;
