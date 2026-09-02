import { z } from 'zod';

/** Request body for `POST /users`. */
export const createUserSchema = z.object({
  email: z.email(),
  displayName: z.string().trim().min(1).max(80),
});

/** Route params for `GET /users/:id`. */
export const userIdParamSchema = z.object({
  id: z.uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
