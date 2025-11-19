import { Request, Response } from 'express';
import Stripe from 'stripe';
import SubscriptionService from '../services/subscriptionService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export class WebhookController {
  /**
   * Handle Stripe webhooks
   * POST /api/v1/webhooks/stripe
   */
  static async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('No signature');
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await SubscriptionService.handleCheckoutComplete(session);
          console.log('Checkout session completed:', session.id);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await SubscriptionService.handleSubscriptionUpdate(subscription);
          console.log('Subscription updated:', subscription.id);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await SubscriptionService.handleSubscriptionDeleted(subscription);
          console.log('Subscription deleted:', subscription.id);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log('Payment succeeded:', invoice.id);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          console.log('Payment failed:', invoice.id);
          // TODO: Send email notification to user
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
}

export default WebhookController;
