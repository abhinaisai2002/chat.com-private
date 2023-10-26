import * as z from 'zod';

export const loginZod = z.object({
  email: z.coerce.string().email(),
  password: z.string(),
});

export const a = 1;
