import { create } from 'zustand';
import { Match } from '../types';
import ApiClient from '../api/client';

interface MatchState {
  matches: Match[];
  isLoading: boolean;

  // Actions
  setMatches: (matches: Match[]) => void;
  loadMatches: () => Promise<void>;
  unmatch: (matchId: string) => Promise<void>;
  reset: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  isLoading: false,

  setMatches: (matches) => set({ matches }),

  loadMatches: async () => {
    try {
      set({ isLoading: true });
      const { matches } = await ApiClient.getMatches();
      set({ matches, isLoading: false });
    } catch (error) {
      console.error('Load matches error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  unmatch: async (matchId: string) => {
    try {
      await ApiClient.unmatch(matchId);
      const { matches } = get();
      set({ matches: matches.filter((m) => m.id !== matchId) });
    } catch (error) {
      console.error('Unmatch error:', error);
      throw error;
    }
  },

  reset: () => {
    set({ matches: [], isLoading: false });
  },
}));
