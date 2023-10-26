import { getServerSession, unstable_getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { uuid } from 'uuidv4';
import { use } from 'react';
import { prisma } from '@/prisma/client';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

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

    const { boardId } = req.body;
    // console.log(req.body);
    // console.log(boardId);

    if (!boardId) {
      res.status(401).json({ message: 'Need a board id' });
      return;
    }

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { userId } = session;

    const deletedBoard = await prisma.board.delete({
      where: {
        userId,
        id: boardId,
      },
    });

    if (!deletedBoard) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Board was deleted successfully' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
