import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for message sending
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'Too many messages sent, please slow down',
});

// ============================================
// CHAT ROUTES
// ============================================

// Get user's active chats
router.get('/active', authenticate, ChatController.getUserActiveChats);

// Get specific chat
router.get('/:chatId', authenticate, ChatController.getChat);

// Get chat messages
router.get('/:chatId/messages', authenticate, ChatController.getChatMessages);

// Send message
router.post(
  '/:chatId/messages',
  authenticate,
  messageLimiter,
  ChatController.sendMessage
);

// Extend chat time
router.post('/:chatId/extend', authenticate, ChatController.extendChatTime);

// Request match
router.post('/:chatId/match/request', authenticate, ChatController.requestMatch);

// Respond to match request
router.post('/:chatId/match/respond', authenticate, ChatController.respondToMatchRequest);

export default router;
