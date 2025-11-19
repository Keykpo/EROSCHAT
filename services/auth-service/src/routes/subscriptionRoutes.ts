import { Router } from 'express';
import SubscriptionController from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All subscription routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/subscriptions/checkout
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router.post('/checkout', asyncHandler(SubscriptionController.createCheckoutSession));

/**
 * @route   GET /api/v1/subscriptions/me
 * @desc    Get current user's subscription
 * @access  Private
 */
router.get('/me', asyncHandler(SubscriptionController.getCurrentSubscription));

/**
 * @route   POST /api/v1/subscriptions/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', asyncHandler(SubscriptionController.cancelSubscription));

/**
 * @route   POST /api/v1/subscriptions/resume
 * @desc    Resume canceled subscription
 * @access  Private
 */
router.post('/resume', asyncHandler(SubscriptionController.resumeSubscription));

/**
 * @route   POST /api/v1/subscriptions/portal
 * @desc    Create customer portal session
 * @access  Private
 */
router.post('/portal', asyncHandler(SubscriptionController.createPortalSession));

export default router;
