import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Profile } from '../types';
import ApiClient from '../api/client';
import SocketClient from '../api/socket';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setProfile: (profile) => set({ profile }),

  login: async (email, password) => {
    try {
      const { user, accessToken, refreshToken } = await ApiClient.login(email, password);
      set({ user, profile: user.profile || null, isAuthenticated: true });

      // Connect socket
      await SocketClient.connect();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email, password) => {
    try {
      const { user } = await ApiClient.register(email, password);
      // Note: User needs to verify email before logging in
      // So we don't set the user as authenticated here
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await ApiClient.logout();
      SocketClient.disconnect();
      set({ user: null, profile: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const { user } = await ApiClient.getMe();
      set({
        user,
        profile: user.profile || null,
        isAuthenticated: true,
        isLoading: false,
      });

      // Connect socket
      await SocketClient.connect();
    } catch (error) {
      console.error('Load user error:', error);
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const { user } = await ApiClient.getMe();
      set({ user, profile: user.profile || null });
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  },
}));
