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

      // Handle typing indicators
      socket.on('typing', (data: { chatId: string }) => {
        socket.to(data.chatId).emit('user-typing', { userId });
      });

      socket.on('stop-typing', (data: { chatId: string }) => {
        socket.to(data.chatId).emit('user-stopped-typing', { userId });
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
