import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export default async function handler(
  req,
  res,
) {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = email.split('@')[0];
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      verified: true,
      username,
    },
  });
  res.status(200).json({ message: 'User created successfully,Please verify' });
}
