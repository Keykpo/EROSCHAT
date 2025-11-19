import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const createProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']),

  interestedIn: z.array(z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']))
    .min(1, 'You must select at least one gender you are interested in'),

  city: z.string().optional(),
  region: z.string().optional(),

  interests: z.array(z.string()).optional(),

  preferences: z.object({
    minAge: z.number().min(18).max(99).optional(),
    maxAge: z.number().min(18).max(99).optional(),
    maxDistance: z.number().min(1).max(500).optional(),
    lookingFor: z.array(z.enum(['CHAT', 'DATING', 'BOTH'])).optional()
  }).optional()
});

export const updateProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),

  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),

  city: z.string().optional(),
  region: z.string().optional(),

  interests: z.array(z.string()).optional(),

  preferences: z.object({
    minAge: z.number().min(18).max(99).optional(),
    maxAge: z.number().min(18).max(99).optional(),
    maxDistance: z.number().min(1).max(500).optional(),
    lookingFor: z.array(z.enum(['CHAT', 'DATING', 'BOTH'])).optional()
  }).optional(),

  showOnlineStatus: z.boolean().optional(),
  showLastSeen: z.boolean().optional(),
  allowLocation: z.boolean().optional()
});

// ============================================
// TYPES
// ============================================

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
