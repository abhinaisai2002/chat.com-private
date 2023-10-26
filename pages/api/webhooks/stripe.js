import { stripe } from '@/lib/pricing/getUserSubscriptionPlan'
import { prisma } from '@/prisma/client'
import Stripe from 'stripe'


export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not allowed' });
    return;
  }
  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  const signature = req.headers['stripe-signature'] ?? ''

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    res.status(400).send(
      `Webhook Error: ${
        err instanceof Error ? err.message : 'Unknown Error'
      }`
    )
    return;
  }

  const session = event.data.object;

  if (!(session?.metadata?.userId)) {
    res.status(400).send('');
    return
  }

  if (event.type === 'checkout.session.completed') {
    const subscription =
      await stripe.subscriptions.retrieve(session.subscription)

    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  if (event.type === 'invoice.payment_succeeded') {
    // Retrieve the subscription details from Stripe.
    const subscription =
      await stripe.subscriptions.retrieve(
        session.subscription
      )

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  res.status(200).send('');
  return;
}