// ============================================
// ENUMS
// ============================================

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER'
}

export enum LookingFor {
  CHAT = 'CHAT',
  DATING = 'DATING',
  BOTH = 'BOTH'
}

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isVerified: boolean;
  credits: number;
  createdAt: string;
  lastActive?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User & {
    hasProfile: boolean;
  };
}

// ============================================
// PROFILE
// ============================================

export interface Profile {
  userId: string;
  username: string;
  gender: Gender;
  interestedIn: Gender[];
  city?: string;
  region?: string;
  bio?: string;
  interests: string[];
  preferences: ProfilePreferences;
  photos: string[];
  socialLinks?: {
    instagram?: string;
    snapchat?: string;
  };
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowLocation: boolean;
}

export interface ProfilePreferences {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  lookingFor: LookingFor[];
}

export interface CreateProfileInput {
  username: string;
  gender: Gender;
  interestedIn: Gender[];
  city?: string;
  region?: string;
  interests?: string[];
  preferences?: Partial<ProfilePreferences>;
}

export interface UpdateProfileInput {
  username?: string;
  bio?: string;
  city?: string;
  region?: string;
  interests?: string[];
  preferences?: Partial<ProfilePreferences>;
  showOnlineStatus?: boolean;
  showLastSeen?: boolean;
  allowLocation?: boolean;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ApiSuccess<T = any> {
  data?: T;
  message?: string;
}
