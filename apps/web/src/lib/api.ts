const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiClient {
  private static getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = false
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  // ============================================
  // AUTH
  // ============================================

  static async register(data: {
    email: string;
    password: string;
    dateOfBirth: string;
    acceptedTerms: boolean;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async login(email: string, password: string) {
    return this.request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    }, true);
  }

  // ============================================
  // USER
  // ============================================

  static async getCurrentUser() {
    return this.request('/users/me', {}, true);
  }

  static async updateUser(data: { email?: string }) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  static async deleteUser() {
    return this.request('/users/me', {
      method: 'DELETE',
    }, true);
  }

  static async getUserStats() {
    return this.request('/users/me/stats', {}, true);
  }

  // ============================================
  // PROFILE
  // ============================================

  static async getMyProfile() {
    return this.request('/profiles/me', {}, true);
  }

  static async createProfile(data: any) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  static async updateProfile(data: any) {
    return this.request('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  static async uploadPhoto(photoUrl: string) {
    return this.request('/profiles/me/photos', {
      method: 'POST',
      body: JSON.stringify({ photoUrl }),
    }, true);
  }

  static async deletePhoto(photoUrl: string) {
    return this.request(`/profiles/me/photos/${encodeURIComponent(photoUrl)}`, {
      method: 'DELETE',
    }, true);
  }

  // ============================================
  // MATCHING
  // ============================================

  static async joinMatchingQueue() {
    return this.request<{
      matched: boolean;
      chatId?: string;
      queuePosition?: number;
      estimatedWaitTime?: number;
      usersInQueue?: number;
    }>('/matching/join-queue', {
      method: 'POST',
    }, true);
  }

  static async leaveMatchingQueue() {
    return this.request('/matching/leave-queue', {
      method: 'DELETE',
    }, true);
  }

  static async getMatchingStatus() {
    return this.request<{
      inQueue: boolean;
      position?: number;
      estimatedWaitTime?: number;
      usersInQueue?: number;
    }>('/matching/status', {}, true);
  }

  // ============================================
  // CHAT
  // ============================================

  static async getChat(chatId: string) {
    return this.request(`/chats/${chatId}`, {}, true);
  }

  static async getChatMessages(chatId: string, limit?: number, before?: Date) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (before) params.append('before', before.toISOString());

    return this.request<{ messages: any[] }>(
      `/chats/${chatId}/messages${params.toString() ? '?' + params.toString() : ''}`,
      {},
      true
    );
  }

  static async sendMessage(chatId: string, content: string, type: string = 'TEXT') {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    }, true);
  }

  static async extendChatTime(chatId: string, minutes: number = 10) {
    return this.request(`/chats/${chatId}/extend`, {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }, true);
  }

  static async requestMatch(chatId: string) {
    return this.request(`/chats/${chatId}/match/request`, {
      method: 'POST',
    }, true);
  }

  static async respondToMatchRequest(chatId: string, accept: boolean) {
    return this.request(`/chats/${chatId}/match/respond`, {
      method: 'POST',
      body: JSON.stringify({ accept }),
    }, true);
  }

  static async getUserActiveChats() {
    return this.request<{ chats: any[] }>('/chats/active', {}, true);
  }

  // ============================================
  // MATCHES
  // ============================================

  static async getUserMatches() {
    return this.request<{ matches: any[] }>('/matches', {}, true);
  }

  static async getMatchById(matchId: string) {
    return this.request(`/matches/${matchId}`, {}, true);
  }

  static async unmatch(matchId: string) {
    return this.request(`/matches/${matchId}`, {
      method: 'DELETE',
    }, true);
  }

  static async getMatchStats() {
    return this.request('/matches/stats', {}, true);
  }
}
