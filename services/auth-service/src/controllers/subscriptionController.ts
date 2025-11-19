import { Request, Response } from 'express';
import SubscriptionService from '../services/subscriptionService';
import { AppError } from '../middleware/errorHandler';

// Stripe price IDs - Update these with your actual Stripe price IDs
const PRICE_IDS = {
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly',
  PREMIUM_YEARLY: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
};

export class SubscriptionController {
  /**
   * Create checkout session
   * POST /api/v1/subscriptions/checkout
   */
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { plan = 'monthly' } = req.body; // 'monthly' or 'yearly'

      const user = req.user!;
      const priceId = plan === 'yearly' ? PRICE_IDS.PREMIUM_YEARLY : PRICE_IDS.PREMIUM_MONTHLY;

      // Determine success and cancel URLs based on the origin
      const origin = req.headers.origin || 'http://localhost:3001';
      const successUrl = `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/premium`;

      const session = await SubscriptionService.createCheckoutSession(
        userId,
        user.email,
        priceId,
        successUrl,
        cancelUrl
      );

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to create checkout session', 500);
    }
  }

  /**
   * Get current subscription
   * GET /api/v1/subscriptions/me
   */
  static async getCurrentSubscription(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const subscription = await SubscriptionService.getUserSubscription(userId);

      res.json({
        subscription: subscription || null,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to get subscription', 500);
    }
  }

  /**
   * Cancel subscription
   * POST /api/v1/subscriptions/cancel
   */
  static async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const subscription = await SubscriptionService.cancelSubscription(userId);

      res.json({
        message: 'Subscription canceled successfully. Access will continue until end of billing period.',
        subscription,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to cancel subscription', 500);
    }
  }

  /**
   * Resume subscription
   * POST /api/v1/subscriptions/resume
   */
  static async resumeSubscription(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const subscription = await SubscriptionService.resumeSubscription(userId);

      res.json({
        message: 'Subscription resumed successfully',
        subscription,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to resume subscription', 500);
    }
  }

  /**
   * Create customer portal session
   * POST /api/v1/subscriptions/portal
   */
  static async createPortalSession(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const origin = req.headers.origin || 'http://localhost:3001';
      const returnUrl = `${origin}/premium`;

      const session = await SubscriptionService.createPortalSession(userId, returnUrl);

      res.json({
        url: session.url,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'Failed to create portal session', 500);
    }
  }
}

export default SubscriptionController;
