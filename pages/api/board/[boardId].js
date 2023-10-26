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

  try {
    
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { userId } = session;

      const { boardId } = req.query;

      const boardDetails = await prisma.board.findFirst({
        where: {
          id: boardId,
          userId,
        },
      });

      // console.log(boardDetails);

      if (!boardDetails) {
        res.status(404).json({ message: 'No board available' });
        return;
      }

    res.status(200).json({ boardDetails });
  }
  catch (err) {
    res.status(500).send("Interval Server error");
  }
}
