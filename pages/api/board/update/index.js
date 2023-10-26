import { getServerSession } from 'next-auth/next';
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
    const {
      boardId,
      lines,
      squares,
      texts,
      rhombuses,
      circles,
      arrows,
      straightlines,
    } = req.body;

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { userId } = session;

    const board = await prisma.board.update({
      where: {
        id: boardId,
        userId,
      },
      data: {
        lines, squares, texts, rhombuses, circles, arrows, strightlines: straightlines,
      },
    });

    res.status(200).json({ message: 'Board was updated successfully' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
