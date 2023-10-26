import { getUserSubscriptionPlan } from '@/lib/pricing/getUserSubscriptionPlan';
import { prisma } from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import BillingForm from '@/components/BillingForm';
import Navbar from '@/components/ui/navbar'
import Head from 'next/head';

export default function Billing(props) {
  const session = useSession();

  return (
    <main>
      <Head>
        <title>Chat.com | Billing</title>
      </Head>
      <nav>
        <Navbar />
      </nav>
      <div>
        <BillingForm subscriptionPlan={props.userSubscriptionPlan} />
      </div>
    </main>
  )
}


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
      },
    };
  }
  
  const { userId } = session;
  const userDetails = await prisma.user.findFirst({
    where: {
      id: userId
    }
  });
  if (!userDetails) {
    return {
      redirect: {
        destination: '/auth/login',
      },
    };
  }

  const userSubscriptionPlan = await getUserSubscriptionPlan(userDetails);  
  const c = userSubscriptionPlan.stripeCurrentPeriodEnd
  userSubscriptionPlan.stripeCurrentPeriodEnd = c.toString()
  return {
    props: {
      session,
      userSubscriptionPlan
    },
  };
}