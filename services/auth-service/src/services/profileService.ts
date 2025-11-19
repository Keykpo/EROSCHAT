import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import type { CreateProfileInput, UpdateProfileInput } from '../models/profileModels';

const prisma = new PrismaClient();

export class ProfileService {
  // ============================================
  // CREATE PROFILE
  // ============================================

  static async createProfile(userId: string, data: CreateProfileInput) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user already has a profile
    if (user.profile) {
      throw new AppError('Profile already exists', 409);
    }

    // Check if username is taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw new AppError('Username already taken', 409);
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId,
        username: data.username,
        gender: data.gender,
        interestedIn: data.interestedIn,
        city: data.city,
        region: data.region,
        interests: data.interests || [],
        minAge: data.preferences?.minAge || 18,
        maxAge: data.preferences?.maxAge || 99,
        maxDistance: data.preferences?.maxDistance || 50,
        lookingFor: data.preferences?.lookingFor || ['BOTH']
      }
    });

    logger.info(`Profile created for user: ${userId}`);

    return this.formatProfile(profile);
  }

  // ============================================
  // GET PROFILE
  // ============================================

  static async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return this.formatProfile(profile);
  }

  // ============================================
  // GET PROFILE BY USERNAME
  // ============================================

  static async getProfileByUsername(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username }
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    return this.formatProfile(profile);
  }

  // ============================================
  // UPDATE PROFILE
  // ============================================

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }

    // If updating username, check if new username is taken
    if (data.username && data.username !== existingProfile.username) {
      const usernameTaken = await prisma.profile.findUnique({
        where: { username: data.username }
      });

      if (usernameTaken) {
        throw new AppError('Username already taken', 409);
      }
    }

    // Prepare update data
    const updateData: any = {
      ...(data.username && { username: data.username }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.region !== undefined && { region: data.region }),
      ...(data.interests !== undefined && { interests: data.interests }),
      ...(data.showOnlineStatus !== undefined && { showOnlineStatus: data.showOnlineStatus }),
      ...(data.showLastSeen !== undefined && { showLastSeen: data.showLastSeen }),
      ...(data.allowLocation !== undefined && { allowLocation: data.allowLocation })
    };

    // Handle preferences
    if (data.preferences) {
      if (data.preferences.minAge !== undefined) {
        updateData.minAge = data.preferences.minAge;
      }
      if (data.preferences.maxAge !== undefined) {
        updateData.maxAge = data.preferences.maxAge;
      }
      if (data.preferences.maxDistance !== undefined) {
        updateData.maxDistance = data.preferences.maxDistance;
      }
      if (data.preferences.lookingFor !== undefined) {
        updateData.lookingFor = data.preferences.lookingFor;
      }
    }

    // Update profile
    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData
    });

    logger.info(`Profile updated for user: ${userId}`);

    return this.formatProfile(profile);
  }

  // ============================================
  // UPLOAD PHOTO
  // ============================================

  static async uploadPhoto(userId: string, photoUrl: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    // Get current photos
    const currentPhotos = (profile.photos as string[]) || [];

    // Check if user has reached the limit (6 photos)
    if (currentPhotos.length >= 6) {
      throw new AppError('Maximum of 6 photos allowed', 400);
    }

    // Add new photo
    const updatedPhotos = [...currentPhotos, photoUrl];

    // Update profile
    await prisma.profile.update({
      where: { userId },
      data: { photos: updatedPhotos }
    });

    logger.info(`Photo uploaded for user: ${userId}`);

    return {
      photoUrl,
      photos: updatedPhotos
    };
  }

  // ============================================
  // DELETE PHOTO
  // ============================================

  static async deletePhoto(userId: string, photoUrl: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    const currentPhotos = (profile.photos as string[]) || [];

    // Check if photo exists
    if (!currentPhotos.includes(photoUrl)) {
      throw new AppError('Photo not found', 404);
    }

    // Remove photo
    const updatedPhotos = currentPhotos.filter(p => p !== photoUrl);

    // Update profile
    await prisma.profile.update({
      where: { userId },
      data: { photos: updatedPhotos }
    });

    logger.info(`Photo deleted for user: ${userId}`);

    return {
      message: 'Photo deleted successfully',
      photos: updatedPhotos
    };
  }

  // ============================================
  // HELPER: Format Profile
  // ============================================

  private static formatProfile(profile: any) {
    return {
      userId: profile.userId,
      username: profile.username,
      gender: profile.gender,
      interestedIn: profile.interestedIn,
      city: profile.city,
      region: profile.region,
      bio: profile.bio,
      interests: profile.interests,
      preferences: {
        minAge: profile.minAge,
        maxAge: profile.maxAge,
        maxDistance: profile.maxDistance,
        lookingFor: profile.lookingFor
      },
      photos: profile.photos || [],
      socialLinks: profile.socialLinks,
      showOnlineStatus: profile.showOnlineStatus,
      showLastSeen: profile.showLastSeen,
      allowLocation: profile.allowLocation,
      updatedAt: profile.updatedAt
    };
  }
}
