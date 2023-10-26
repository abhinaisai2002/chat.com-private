import { getServerSession, unstable_getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { uuid } from 'uuidv4';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/prisma/client';

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

    if (!session || !userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const boards = await prisma.board.findMany({
      where: {
        userId,
      }
    })

    if (boards.length >= 5) {
      res.status(401).json({message:"Cannot have more than boards.Please upgrade."})
      return;
    }

    const newBoard = await prisma.board.create({
      data: {
        name: uuid(),
        userId,
        lines: [],
        squares: [],
        texts: [],
        rhombuses: [],
        circles: [],
        arrows: [],
        strightlines: [],
      },
    });

    res.status(200).json({ message: 'Board was created successfully' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
