import { getServerSession } from 'next-auth/next';
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

    const userDetails = await prisma.user.findFirst({
        where: {
          id:userId
      }
    })
    if (!userDetails) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

   

    res.status(200).json({ message: 'Board was created successfully' });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
