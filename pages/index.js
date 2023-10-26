import Link from 'next/link';
import { ArrowRight, Check, Diamond, DiamondIcon, Gem, HelpCircle, Loader2Icon, LucideDiamond, Minus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import LandingNav from '@/components/app/LandingNav';
import MaxWidthWrapper from '@/components/app/MaxWidthWrapper';
import { Button, buttonVariants } from '@/components/ui/button';
import Head from 'next/head';
import { pricingItems } from '@/lib/pricing/pricing-items';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
  const session = useSession();
  console.log(session);
  if (session.data?.status === 'loggedout') {
    session.status = 'unauthenticated'
  }
  return (
    <div className="h-full">
      <Head>
        <title>Chat.com</title>
      </Head>
      <nav>
        <LandingNav session={session} />
      </nav>
      <MaxWidthWrapper className="mt-56 sm:mt-28 h-2/6 flex flex-col justify-center items-center">
        <div className="flex items-center">
          <Button
            className={buttonVariants({
              variant: 'ghost',
            })}
          >
            Coming soon.
          </Button>
        </div>
        <div className="text-center mt-6">
          <div className="text-7xl">
            <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
              Create your
              {' '}
              <span className="text-blue-600">white boards</span>
              {' '}
              in seconds.
            </h1>
          </div>
        </div>
        <div className="mt-16">
          <p className="text-2xl flex justify-center text-center">
            Chat.com allows you to have your own board.
            Simply draw content on your white boards and download the images instantly.
          </p>
        </div>
        <div className="mt-16">
          <Link
            href="/auth/login"
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
            })}
          >
            Get Started
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </MaxWidthWrapper>
      <div className="mt-64">
        <div className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/board.png"
                    alt="product preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>

        </div>
      </div>
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
              Start drawing in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Creating  your whiteboards files has never been
              easier than with chat.com.
            </p>
          </div>
        </div>
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">
                Step 1
              </span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Start your journey with us by creating up an account.
                {' '}
                <span>
                  <Link
                    href="/auth/signup"
                    className="text-blue-700 underline underline-offset-2"
                  >
                    pro plan
                  </Link>
                  .
                </span>

              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">
                Step 2
              </span>
              <span className="text-xl font-semibold">
                Create your white board
              </span>
              <span className="mt-2 text-zinc-700">
                We will provide you a white board to draw some shapes.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">
                Step 3
              </span>
              <span className="text-xl font-semibold">
                Download your board into an image
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simple. Try out chat.com today -
                it really takes less than a minute.
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div id='pricing' className='mt-56 mx-auto max-w-5xl  sm:mt-48 mb-16'>
        <div className='mb-12 px-6 lg:px-8 text-center'>
          <div className="mx-auto max-w-2xl sm:text-center">
            <h1 className='text-4xl sm:text-5xl font-bold'>Pricing</h1>
            <p className='mt-4 text-lg text-gray-600'>Whether you're just trying out our service or need more, we've got you covered.</p>
          </div>
        </div>
        <TooltipProvider>
          <div className='mx-auto gap-10 md:gap-0 mt-16 grid grid-cols-1 md:grid-cols-2'>
            <div className='px-4 sm:px-12 '>
              <div className='rounded-lg border shadow-md'>
                <div className='py-5'>
                  <div className='text-center p-2 '>
                    <h2 className='text-3xl font-bold'>Free</h2>
                    <p className='text-gray-600 text-lg mt-4'>For less number of boards</p>
                    <h1 className='text-4xl font-bold mt-4'>0/-</h1>
                    <p className='text-gray-600 text-lg mt-4'>Per Month</p>
                  </div>
                </div>
                <div className='w-full border-y-2 py-6 bg-gray-50'>
                  <div className='text-center'>5 boards in this plan included.</div>
                </div>
                <div className='border-b'>
                  <ul className='my-10 space-y-5 px-8'>
                    {pricingItems[0].features.map(({text,footnote,negative }) => {
                      return (
                        <li key={text}  className='flex items-center'>
                          {(negative ? (
                            <Minus className='w-4 h-4' />
                          ) : (
                            <Check className='w-4 h-4' />
                          ))}
                          <p className={cn(
                            'ml-4 text-gray-600',
                            {
                              'text-gray-400':negative
                            }
                          )}>{text}</p>
                          {footnote && <Tooltip
                            delayDuration={300}>
                            <TooltipTrigger className='cursor-default ml-1.5'>
                              <HelpCircle className='h-4 w-4 text-zinc-500' />
                            </TooltipTrigger>
                            <TooltipContent className='w-80 p-2'>
                              {footnote}
                            </TooltipContent>
                          </Tooltip>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className='my-4'>
                  <div className='flex justify-center'>
                    <Button className="flex justify-around  disabled">
                      <Gem className='h-4 w-4 mr-4' />
                      Current plan
                    </Button>
                  </div>
                </div>
              </div>
              
            </div>
            <div className='px-4 sm:px-12'>
              <div className={cn(
                'rounded-lg border shadow-md relative',
                {
                  'border-2 border-black shadow-black':true
                }
              )}>
                <div
                  className='absolute left-[40%] -top-[4%] sm:left-[35%] bg-black text-white py-2 px-6 rounded-3xl'
                >Upgrade</div>
                <div className='py-5'>
                  <div className='text-center p-2 '>
                    <h2 className='text-3xl font-bold'>Premium</h2>
                    <p className='text-gray-600 text-lg mt-4'>For more number of boards</p>
                    <h1 className='text-4xl font-bold mt-4'>100/-</h1>
                    <p className='text-gray-600 text-lg mt-4'>Per Month</p>
                  </div>
                </div>
                <div className='w-full border-y-2 py-6 bg-gray-50'>
                  <div className='text-center'>More than 5 boards in this plan included.</div>
                </div>
                <div className='border-b'>
                  <ul className='my-10 space-y-5 px-8'>
                    {pricingItems[1].features.map(({text,footnote,negative }) => {
                      return (
                        <li key={text} className='flex items-center'>
                          {(negative ? (
                            <Minus className='w-4 h-4' />
                          ) : (
                            <Check className='w-4 h-4' />
                          ))}
                          <p className={cn(
                            'ml-4 text-gray-600',
                            {
                              'text-gray-400':negative
                            }
                          )}>{text}</p>
                          {footnote && <Tooltip
                            delayDuration={300}>
                            <TooltipTrigger className='cursor-default ml-1.5'>
                              <HelpCircle className='h-4 w-4 text-zinc-500' />
                            </TooltipTrigger>
                            <TooltipContent className='w-80 p-2'>
                              {footnote}
                            </TooltipContent>
                          </Tooltip>}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className='my-4'>
                  <div className='flex justify-center'>
                  
                    {session.status !== 'authenticated' ? (
                      <Link
                        href='/auth/login'
                        className={cn(
                        buttonVariants(
                          {
                            variant:'default'
                          }
                        ),
                        "flex justify-around ")}>
                        <Gem className='h-4 w-4 mr-4' />
                        {session.status !== 'authenticated' ? 'Signup' :'Upgrade now.'}
                      </Link>
                    ) : (
                        <UpgradeButton />
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

function UpgradeButton() {
  const router = useRouter();
  const upgradeMutation = useMutation({
    mutationKey: ['user', 'subscription'],
    mutationFn: () => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-session`)
    },
    onSuccess: (data) => {
      console.log(data.data);
      window.open(data.data.url);
    }
  });
  return (
    <Button onClick={() => upgradeMutation.mutate()}>
      {
        upgradeMutation.isPending ? (
          <Loader2Icon className='w-4 h-4 animate-spin' />
        ) : (
          <>
            <Gem className = 'h-4 w-4 mr-4' />
            Upgrade now.
          </>
        )
      }
      
    </Button>
  )
}



export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // // console.log(session);
  if (!session) {
    return {
      props: {
        session: {
          status:"loggedout"
        }
      }
    };
  }

  // console.log(queryClient.getQueryData(['user', 'boards']));

  return {
    props: {
      session,
      
    },
  };
}