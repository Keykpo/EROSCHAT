import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface UseWebSocketOptions {
  onMatchFound?: (data: { chatId: string; matchedUserId: string; message: string }) => void;
  onQueueUpdate?: (data: { position?: number; estimatedWaitTime?: number; usersInQueue?: number }) => void;
  onNewMessage?: (data: { chatId: string; message: any }) => void;
  onMatchRevealed?: (data: { chatId: string; profile: any; message: string }) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const connect = useCallback(() => {
    if (!accessToken) {
      console.log('No access token, skipping WebSocket connection');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to WebSocket...');

    const socket = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socket.on('connected', (data) => {
      console.log('WebSocket server confirmed connection:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
    });

    // Match found event
    socket.on('match-found', (data) => {
      console.log('🎉 Match found!', data);
      if (options.onMatchFound) {
        options.onMatchFound(data);
      } else {
        // Default behavior: redirect to chat
        router.push(`/chat/${data.chatId}`);
      }
    });

    // Queue update event
    socket.on('queue-update', (data) => {
      console.log('📊 Queue update:', data);
      if (options.onQueueUpdate) {
        options.onQueueUpdate(data);
      }
    });

    // New message event
    socket.on('new-message', (data) => {
      console.log('💬 New message:', data);
      if (options.onNewMessage) {
        options.onNewMessage(data);
      }
    });

    // Match revealed event
    socket.on('match-revealed', (data) => {
      console.log('❤️ Match revealed!', data);
      if (options.onMatchRevealed) {
        options.onMatchRevealed(data);
      }
    });

    socketRef.current = socket;
  }, [accessToken, router, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('Disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Cannot emit event: WebSocket not connected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    connected: socketRef.current?.connected || false,
    connect,
    disconnect,
    emit,
  };
};
