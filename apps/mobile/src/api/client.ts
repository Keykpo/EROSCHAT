import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens, User, Profile, Chat, Message, Match } from '../types';

// Use your backend URL - update this when deploying
const API_URL = __DEV__
  ? 'http://localhost:3000/api/v1'
  : 'https://api.erochat.com/api/v1'; // Replace with your production URL

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken } = response.data;
              await AsyncStorage.setItem('accessToken', accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(email: string, password: string): Promise<{ user: User }> {
    const response = await this.api.post('/auth/register', { email, password });
    return response.data;
  }

  async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await this.api.post('/auth/login', { email, password });
    // Store tokens
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  }

  async getMe(): Promise<{ user: User }> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  // Profile
  async createProfile(data: {
    name: string;
    birthDate: string;
    gender: string;
    interestedIn: string[];
    location: string;
    locationCoordinates: { lat: number; lng: number };
    interests: string[];
    maxDistance?: number;
    minAge?: number;
    maxAge?: number;
  }): Promise<{ profile: Profile }> {
    const response = await this.api.post('/profiles', data);
    return response.data;
  }

  async updateProfile(data: Partial<Profile>): Promise<{ profile: Profile }> {
    const response = await this.api.patch('/profiles/me', data);
    return response.data;
  }

  async uploadPhoto(photoUri: string): Promise<{ photos: string[] }> {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await this.api.post('/profiles/me/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deletePhoto(photoUrl: string): Promise<{ photos: string[] }> {
    const response = await this.api.delete('/profiles/me/photos', {
      data: { photoUrl },
    });
    return response.data;
  }

  // Matching
  async searchChat(): Promise<{ chat: Chat }> {
    const response = await this.api.post('/matching/search');
    return response.data;
  }

  async leaveQueue(): Promise<void> {
    await this.api.delete('/matching/queue');
  }

  // Chats
  async getChats(): Promise<{ chats: Chat[] }> {
    const response = await this.api.get('/chats');
    return response.data;
  }

  async getChat(chatId: string): Promise<{ chat: Chat }> {
    const response = await this.api.get(`/chats/${chatId}`);
    return response.data;
  }

  async getChatMessages(chatId: string, limit = 50, before?: string): Promise<{ messages: Message[] }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (before) params.append('before', before);

    const response = await this.api.get(`/chats/${chatId}/messages?${params}`);
    return response.data;
  }

  async endChat(chatId: string): Promise<void> {
    await this.api.post(`/chats/${chatId}/end`);
  }

  // Matches
  async getMatches(): Promise<{ matches: Match[] }> {
    const response = await this.api.get('/matches');
    return response.data;
  }

  async getUserMatches(userId: string): Promise<{ matches: any[] }> {
    const response = await this.api.get(`/matches/user/${userId}`);
    return response.data;
  }

  async unmatch(matchId: string): Promise<void> {
    await this.api.delete(`/matches/${matchId}`);
  }

  // Reports
  async createReport(data: {
    reportedUserId: string;
    chatId?: string;
    messageId?: string;
    reason: string;
    description?: string;
  }): Promise<void> {
    await this.api.post('/reports', data);
  }
}

export default new ApiClient();
