import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class WebSocketService {
  private io: Server;
  private userSocketMap: Map<string, string> = new Map(); // userId -> socketId

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production'
          ? process.env.ALLOWED_ORIGINS?.split(',')
          : '*',
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        socket.userId = decoded.userId;
        next();
      } catch (error) {
        logger.error('WebSocket auth error:', error);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const userId = socket.userId!;

      logger.info(`WebSocket client connected: ${userId}`);

      // Store user's socket ID
      this.userSocketMap.set(userId, socket.id);

      // Notify user they're connected
      socket.emit('connected', {
        message: 'Connected to Ero Chat',
        userId,
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${userId}`);
        this.userSocketMap.delete(userId);
      });

      // Handle user joining matching queue
      socket.on('join-matching-queue', () => {
        logger.info(`User ${userId} joined matching queue`);
        socket.emit('queue-status', {
          inQueue: true,
          message: 'Searching for a match...',
        });
      });

      // Handle user leaving matching queue
      socket.on('leave-matching-queue', () => {
        logger.info(`User ${userId} left matching queue`);
        socket.emit('queue-status', {
          inQueue: false,
          message: 'Search cancelled',
        });
      });

      // ============================================
      // CHAT EVENTS
      // ============================================

      // Join chat room
      socket.on('chat:join', (data: { chatId: string }) => {
        socket.join(data.chatId);
        logger.info(`User ${userId} joined chat room ${data.chatId}`);
        socket.emit('chat:joined', { chatId: data.chatId });
      });

      // Leave chat room
      socket.on('chat:leave', (data: { chatId: string }) => {
        socket.leave(data.chatId);
        logger.info(`User ${userId} left chat room ${data.chatId}`);
      });

      // Typing indicators
      socket.on('typing:start', (data: { chatId: string }) => {
        socket.to(data.chatId).emit('user-typing', { userId });
      });

      socket.on('typing:stop', (data: { chatId: string }) => {
        socket.to(data.chatId).emit('user-stopped-typing', { userId });
      });

      // Message sent notification (real-time broadcast)
      socket.on('message:sent', (data: { chatId: string; message: any }) => {
        socket.to(data.chatId).emit('message:received', data.message);
      });

      // Match request events
      socket.on('match:request', (data: { chatId: string }) => {
        socket.to(data.chatId).emit('match:requested', { userId });
      });

      socket.on('match:respond', (data: { chatId: string; accepted: boolean }) => {
        socket.to(data.chatId).emit('match:response', {
          userId,
          accepted: data.accepted,
        });
      });
    });
  }

  /**
   * Notify a user that a match has been found
   */
  public notifyMatchFound(userId: string, chatId: string, matchedUserId: string) {
    const socketId = this.userSocketMap.get(userId);

    if (socketId) {
      this.io.to(socketId).emit('match-found', {
        chatId,
        matchedUserId,
        message: '¡Match encontrado! Redirigiendo al chat...',
      });

      logger.info(`Sent match notification to user ${userId} for chat ${chatId}`);
    } else {
      logger.warn(`User ${userId} not connected, cannot send match notification`);
    }
  }

  /**
   * Update queue status for a user
   */
  public updateQueueStatus(
    userId: string,
    data: {
      position?: number;
      estimatedWaitTime?: number;
      usersInQueue?: number;
    }
  ) {
    const socketId = this.userSocketMap.get(userId);

    if (socketId) {
      this.io.to(socketId).emit('queue-update', data);
    }
  }

  /**
   * Send a new message notification
   */
  public notifyNewMessage(userId: string, chatId: string, message: any) {
    const socketId = this.userSocketMap.get(userId);

    if (socketId) {
      this.io.to(socketId).emit('new-message', {
        chatId,
        message,
      });
    }
  }

  /**
   * Notify that a match has been revealed (both users liked each other)
   */
  public notifyMatchRevealed(userId: string, chatId: string, revealedProfile: any) {
    const socketId = this.userSocketMap.get(userId);

    if (socketId) {
      this.io.to(socketId).emit('match-revealed', {
        chatId,
        profile: revealedProfile,
        message: '¡Match! Los perfiles han sido revelados',
      });
    }
  }

  /**
   * Broadcast to all connected users (admin use only)
   */
  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  /**
   * Get the Socket.io server instance
   */
  public getIO(): Server {
    return this.io;
  }

  /**
   * Check if a user is connected
   */
  public isUserConnected(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  /**
   * Get number of connected users
   */
  public getConnectedUsersCount(): number {
    return this.userSocketMap.size;
  }
}

// Singleton instance
let websocketService: WebSocketService | null = null;

export const initializeWebSocketService = (httpServer: HttpServer): WebSocketService => {
  if (!websocketService) {
    websocketService = new WebSocketService(httpServer);
    logger.info('✅ WebSocket service initialized');
  }
  return websocketService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return websocketService;
};
