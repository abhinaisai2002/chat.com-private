import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import {
  Ghost, MessageSquare, Plus, Trash,
} from 'lucide-react';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';
import { fetchBoards } from '@/lib/backend-api/fetchBoards';
import { prisma } from '@/prisma/client';

import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '@/components/app/MaxWidthWrapper';
import Navbar from '@/components/ui/navbar';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NewBoardButton from '@/components/app/NewBoardButton';
import BoardCard from '@/components/app/BoardCard';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });


export default function Home(props) {
  const {
    data, isError, isLoading, isFetching,
  } = useQuery({
    queryKey: ['user', 'boards'],
    queryFn: () => fetchBoards(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,

  });

  return (
    <div>
      <Head>
        <title>Chat.com | Boards</title>
      </Head>
      <nav>
        <Navbar />
      </nav>
      <main className="mt-8 md:mt-24">
        <MaxWidthWrapper>
          <div className="mx-auto px-2 flex flex-row justify-between">
            <h1 className="text-3xl">Your boards.</h1>
            <NewBoardButton />
          </div>
          {data.length > 0 && (
          <div className="mx-auto px-2 mt-4">
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((board) => (
                <BoardCard key={board.id} name={board.name} date={board.createdAt} board={board} />
              ))}

            </ul>
          </div>
          )}
          {data.length === 0 && (
          <div className="mx-auto px-2 mt-4 py-24 flex justify-center">
            <div className="flex flex-col justify-center items-center max-w-2xl ">
              <Ghost className="h-8 w-8 text-zinc-800" />
              <h3 className="font-semibold text-xl">
                Pretty empty around here
              </h3>
              <p>Let&apos;s draw your first board.</p>
            </div>
          </div>
          )}
          {isError && (
          <div className="mx-auto px-2 mt-4 py-24 flex justify-center">
            <div className="flex flex-col justify-center items-center max-w-2xl ">
              <Ghost className="h-8 w-8 text-zinc-800" />
              <h3 className="font-semibold text-xl">
                Something went wrong.
              </h3>
              <p>Come back again</p>
            </div>
          </div>
          )}
          {(isLoading) ? <Skeleton height={100} className="my-2" count={3} /> : <></>}
        </MaxWidthWrapper>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // // console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
      },
    };
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['user', 'boards'],
    queryFn: async () => {
      const data = await prisma.board.findMany({
        where: {
          userId: session.userId,
        },
      });
      return data.map((board) => {
        const c = board.createdAt;
        board.createdAt = c.toString();
        return board;
      });
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  // console.log(queryClient.getQueryData(['user', 'boards']));

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
    },
  };
}
