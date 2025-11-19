// Shared types for the mobile app
export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
  interestedIn: ('MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER')[];
  location: string;
  locationCoordinates: {
    lat: number;
    lng: number;
  };
  photos: string[];
  interests: string[];
  maxDistance: number;
  minAge: number;
  maxAge: number;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'ACTIVE' | 'ENDED' | 'MATCHED';
  matchedAt?: string;
  endedAt?: string;
  timerStartedAt: string;
  createdAt: string;
  lastMessage?: Message;
  otherUserId?: string;
  otherUserProfile?: Profile;
  unreadCount?: number;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'MATCH_REQUEST' | 'MATCH_RESPONSE';
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  chatId: string;
  createdAt: string;
  chat?: Chat;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

// Navigation types
export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;

  // Onboarding
  Onboarding: undefined;

  // Main app
  MainTabs: undefined;

  // Individual screens
  Home: undefined;
  Chat: { chatId: string };
  Matches: undefined;
  Profile: undefined;
};
