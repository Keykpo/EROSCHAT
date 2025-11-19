import { create } from 'zustand';
import { Chat, Message } from '../types';
import ApiClient from '../api/client';
import SocketClient from '../api/socket';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;

  // Actions
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
  loadChats: () => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => void;
  sendMatchRequest: (chatId: string) => void;
  respondToMatchRequest: (chatId: string, accepted: boolean) => void;
  endChat: (chatId: string) => Promise<void>;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isTyping: false,
  isLoading: false,

  setChats: (chats) => set({ chats }),

  setCurrentChat: (chat) => set({ currentChat: chat }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    const { messages } = get();
    const exists = messages.find((m) => m._id === message._id);
    if (!exists) {
      set({ messages: [...messages, message] });
    }
  },

  setIsTyping: (isTyping) => set({ isTyping }),

  loadChats: async () => {
    try {
      set({ isLoading: true });
      const { chats } = await ApiClient.getChats();
      set({ chats, isLoading: false });
    } catch (error) {
      console.error('Load chats error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadChat: async (chatId: string) => {
    try {
      const { chat } = await ApiClient.getChat(chatId);
      set({ currentChat: chat });
    } catch (error) {
      console.error('Load chat error:', error);
      throw error;
    }
  },

  loadMessages: async (chatId: string) => {
    try {
      set({ isLoading: true });
      const { messages } = await ApiClient.getChatMessages(chatId);
      set({ messages: messages.reverse(), isLoading: false });
    } catch (error) {
      console.error('Load messages error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  sendMessage: (chatId: string, content: string) => {
    SocketClient.sendMessage(chatId, content);
  },

  sendMatchRequest: (chatId: string) => {
    SocketClient.sendMatchRequest(chatId);
  },

  respondToMatchRequest: (chatId: string, accepted: boolean) => {
    SocketClient.respondToMatchRequest(chatId, accepted);
  },

  endChat: async (chatId: string) => {
    try {
      await ApiClient.endChat(chatId);
      set({ currentChat: null, messages: [] });
    } catch (error) {
      console.error('End chat error:', error);
      throw error;
    }
  },

  reset: () => {
    set({
      chats: [],
      currentChat: null,
      messages: [],
      isTyping: false,
      isLoading: false,
    });
  },
}));
