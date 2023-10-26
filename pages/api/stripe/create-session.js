import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/prisma/client';
import { getUserSubscriptionPlan, stripe } from '@/lib/pricing/getUserSubscriptionPlan';
import { PLANS } from '@/lib/pricing/config/stripe';

export default async function handler(
  req,
  res,
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not allowed' });
    return;
  } 


  try {
    const session = await getServerSession(req, res, authOptions);
    const { userId } = session;
    
    const billingUrl = `${process.env.NEXT_PUBLIC_API_URL}/billing`

    if (!session || !userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const dbUser = await prisma.user.findFirst({
        where: {
          id:userId
      }
    })
    if (!dbUser) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const userSubscriptionPlan = await getUserSubscriptionPlan(dbUser);

    console.log(userSubscriptionPlan);

    if (userSubscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession =
        await stripe.billingPortal.sessions.create({
          customer: dbUser.stripeCustomerId,
          return_url: billingUrl,
        });
      res.status(200).json({
        message: 'Board was created successfully',
        url: stripeSession.url 
      });
      return;
    }

    const stripeSession =
      await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        line_items: [
          {
            price: PLANS.find(
              (plan) => plan.name === 'Pro'
            )?.price.priceIds.test,
            quantity: 1,
          },
        ],
        metadata: {
          userId: userId,
        },
      })

    res.status(200).json({
      message: 'Board was created successfully',
      url:stripeSession.url
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
