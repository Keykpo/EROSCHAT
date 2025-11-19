import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { MatchingController } from '../controllers/matchingController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter
const matchingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many matching requests, please try again later',
});

// All matching routes require authentication
router.use(authenticateToken);
router.use(matchingLimiter);

// POST /api/v1/matching/join-queue - Join matching queue
router.post('/join-queue', MatchingController.joinQueue);

// DELETE /api/v1/matching/leave-queue - Leave matching queue
router.delete('/leave-queue', MatchingController.leaveQueue);

// GET /api/v1/matching/status - Get queue status
router.get('/status', MatchingController.getStatus);

export default router;
