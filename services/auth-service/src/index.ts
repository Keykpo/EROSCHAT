import express, { Application } from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import matchingRoutes from './routes/matchingRoutes';
import chatRoutes from './routes/chatRoutes';
import matchRoutes from './routes/matchRoutes';
import reportRoutes from './routes/reportRoutes';
import { initializeWebSocketService } from './services/websocketService';
import { initializeChatTerminationService } from './services/chatTerminationService';
import { connectMongoDB } from './config/mongodb';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer(app);

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',')
    : '*',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/reports', reportRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// ============================================
// WEBSOCKET INITIALIZATION
// ============================================

// Initialize WebSocket service
initializeWebSocketService(httpServer);

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Initialize chat termination service
    initializeChatTerminationService();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Auth Service running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔌 WebSocket server initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;
