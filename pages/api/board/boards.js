import { getServerSession, unstable_getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/prisma/client';

export default async function handler(
  req,
  res,
) {
  // // console.log(req.c)
  if (req.method !== 'GET') {
    res.status(404).json({ message: 'Not allowed' });
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { userId } = session;

  const userBoards = await prisma.board.findMany({
    where: {
      userId,
    },
  });

  res.status(200).json(userBoards);
}
