import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = Router();

// ============================================
// MATCH ROUTES
// ============================================

// Get user's matches
router.get('/', authenticate, MatchController.getUserMatches);

// Get match stats
router.get('/stats', authenticate, MatchController.getMatchStats);

// Get specific match
router.get('/:matchId', authenticate, MatchController.getMatchById);

// Unmatch
router.delete('/:matchId', authenticate, MatchController.unmatch);

export default router;
