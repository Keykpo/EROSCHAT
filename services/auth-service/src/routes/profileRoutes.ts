import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ProfileController } from '../controllers/profileController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// All profile routes require authentication
router.use(authenticateToken);
router.use(profileLimiter);

// GET /api/v1/profiles/me - Get current user's profile
router.get('/me', ProfileController.getMyProfile);

// POST /api/v1/profiles - Create profile
router.post('/', ProfileController.createProfile);

// PATCH /api/v1/profiles/me - Update profile
router.patch('/me', ProfileController.updateProfile);

// POST /api/v1/profiles/me/photos - Upload photo
router.post('/me/photos', ProfileController.uploadPhoto);

// DELETE /api/v1/profiles/me/photos/:photoUrl - Delete photo
router.delete('/me/photos/:photoUrl', ProfileController.deletePhoto);

// GET /api/v1/profiles/:username - Get profile by username (public)
router.get('/:username', ProfileController.getProfileByUsername);

export default router;
