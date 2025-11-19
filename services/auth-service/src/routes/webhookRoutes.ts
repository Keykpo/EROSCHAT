import { Router } from 'express';
import express from 'express';
import WebhookController from '../controllers/webhookController';

const router = Router();

/**
 * @route   POST /api/v1/webhooks/stripe
 * @desc    Handle Stripe webhooks
 * @access  Public (but verified with Stripe signature)
 *
 * IMPORTANT: This route needs raw body for signature verification
 * The express.raw() middleware is applied in the main app
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  WebhookController.handleStripeWebhook
);

export default router;
