import Stripe from 'stripe';
import prisma from '../config/database';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export class SubscriptionService {
  /**
   * Create or get Stripe customer for user
   */
  static async getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
    // Check if user already has a Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    return customer.id;
  }

  /**
   * Create subscription checkout session
   */
  static async createCheckoutSession(
    userId: string,
    email: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const customerId = await this.getOrCreateStripeCustomer(userId, email);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session;
  }

  /**
   * Handle successful payment (webhook)
   */
  static async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new Error('No userId in session metadata');
    }

    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId,
        tier: 'PREMIUM',
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: 'ACTIVE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    // Update user to premium
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });

    return subscription;
  }

  /**
   * Handle subscription update (webhook)
   */
  static async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Map Stripe status to our status
    let status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'PAST_DUE' = 'ACTIVE';
    if (subscription.status === 'canceled') status = 'CANCELED';
    else if (subscription.status === 'incomplete_expired') status = 'EXPIRED';
    else if (subscription.status === 'past_due') status = 'PAST_DUE';

    // Update subscription
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    // Update user premium status
    await prisma.user.update({
      where: { id: dbSubscription.userId },
      data: { isPremium: status === 'ACTIVE' },
    });
  }

  /**
   * Handle subscription deletion (webhook)
   */
  static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!dbSubscription) {
      return;
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });

    // Check if user has other active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        userId: dbSubscription.userId,
        status: 'ACTIVE',
      },
    });

    // Remove premium if no active subscriptions
    if (activeSubscriptions === 0) {
      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { isPremium: false },
      });
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // Cancel at period end (don't delete immediately)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return subscription;
  }

  /**
   * Resume canceled subscription
   */
  static async resumeSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        cancelAtPeriodEnd: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No subscription to resume');
    }

    // Remove cancel_at_period_end
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
      },
    });

    return subscription;
  }

  /**
   * Get user's active subscription
   */
  static async getUserSubscription(userId: string) {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create customer portal session
   */
  static async createPortalSession(userId: string, returnUrl: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription?.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return session;
  }
}

export default SubscriptionService;
