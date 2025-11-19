import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProfileService } from '../services/profileService';
import { createProfileSchema, updateProfileSchema } from '../models/profileModels';

export class ProfileController {
  // ============================================
  // GET /api/v1/profiles/me
  // ============================================

  static async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const profile = await ProfileService.getProfile(userId);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/profiles
  // ============================================

  static async createProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const data = createProfileSchema.parse(req.body);

      const profile = await ProfileService.createProfile(userId, data);

      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // PATCH /api/v1/profiles/me
  // ============================================

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const data = updateProfileSchema.parse(req.body);

      const profile = await ProfileService.updateProfile(userId, data);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // POST /api/v1/profiles/me/photos
  // ============================================

  static async uploadPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;

      // For now, we'll just accept a URL
      // In production, this would handle file upload to S3
      const { photoUrl } = req.body;

      if (!photoUrl) {
        return res.status(400).json({ error: 'Photo URL is required' });
      }

      const result = await ProfileService.uploadPhoto(userId, photoUrl);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // DELETE /api/v1/profiles/me/photos/:photoUrl
  // ============================================

  static async deletePhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const photoUrl = decodeURIComponent(req.params.photoUrl);

      const result = await ProfileService.deletePhoto(userId, photoUrl);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // ============================================
  // GET /api/v1/profiles/:username
  // ============================================

  static async getProfileByUsername(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const profile = await ProfileService.getProfileByUsername(username);

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
}
