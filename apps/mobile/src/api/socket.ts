import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';

const SOCKET_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.erochat.com'; // Replace with your production URL

class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listeners
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  // Emit events
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  // Chat-specific methods
  joinChat(chatId: string): void {
    this.emit('chat:join', { chatId });
  }

  leaveChat(chatId: string): void {
    this.emit('chat:leave', { chatId });
  }

  sendMessage(chatId: string, content: string, type: 'TEXT' | 'MATCH_REQUEST' | 'MATCH_RESPONSE' = 'TEXT'): void {
    this.emit('chat:message', { chatId, content, type });
  }

  typing(chatId: string, isTyping: boolean): void {
    this.emit('chat:typing', { chatId, isTyping });
  }

  sendMatchRequest(chatId: string): void {
    this.sendMessage(chatId, 'Would you like to match?', 'MATCH_REQUEST');
  }

  respondToMatchRequest(chatId: string, accepted: boolean): void {
    this.sendMessage(chatId, accepted ? 'yes' : 'no', 'MATCH_RESPONSE');
  }

  // Matching-specific methods
  joinQueue(): void {
    this.emit('matching:join');
  }

  leaveQueue(): void {
    this.emit('matching:leave');
  }
}

export default new SocketClient();
