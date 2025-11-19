import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/v1/users/me - Get current user
router.get('/me', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/v1/users/me - Update current user
router.patch('/me', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// DELETE /api/v1/users/me - Delete account
router.delete('/me', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
