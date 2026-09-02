import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { createUserSchema, userIdParamSchema } from '../schemas/user-schema.js';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

/** In-memory profile store for the demo. Keyed by user id. */
const profiles = new Map<string, UserProfile>();

export const userController = {
  /**
   * Creates a user profile.
   *
   * @param req - Express request. Body: `{ email, displayName }`.
   * @param res - Express response.
   * @returns 201 with the created profile.
   * @throws {ZodError} When the body fails schema validation — the global
   *   error handler converts it to a 400.
   *
   * @example
   *   POST /users { "email": "a@b.com", "displayName": "Ada" }
   *   → 201 { "id": "…", "email": "a@b.com", "displayName": "Ada", "createdAt": "…" }
   */
  create: async (req: Request, res: Response) => {
    const { email, displayName } = createUserSchema.parse(req.body);

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      email,
      displayName,
      createdAt: new Date().toISOString(),
    };

    profiles.set(profile.id, profile);

    logger.info({ userId: profile.id }, 'User profile created');
    return res.status(201).json(profile);
  },

  /**
   * Fetches a single user profile by id.
   *
   * @param req - Express request. Params: `{ id }`.
   * @param res - Express response.
   * @returns 200 with the profile, 404 when no profile exists.
   * @throws {ZodError} When `id` is not a UUID.
   *
   * @example
   *   GET /users/9f1c… → 200 { "id": "9f1c…", "email": "a@b.com", … }
   */
  getById: async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);

    const profile = profiles.get(id);
    if (!profile) {
      logger.warn({ userId: id }, 'Profile lookup missed');
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
      });
    }

    return res.status(200).json(profile);
  },

  /**
   * Lists all user profiles.
   *
   * @param _req - Express request. Unused.
   * @param res - Express response.
   * @returns 200 with `{ users: UserProfile[] }`.
   *
   * @example
   *   GET /users → 200 { "users": [ … ] }
   */
  list: async (_req: Request, res: Response) => {
    return res.status(200).json({ users: [...profiles.values()] });
  },
};
