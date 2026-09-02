import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
} from '../schemas/user-schema.js';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

/** In-memory profile store for the demo. Keyed by user id. */
const profiles = new Map<string, UserProfile>();

const respondUserNotFound = (res: Response) =>
  res.status(404).json({
    error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
  });

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
   * Replaces an existing user profile's editable fields.
   *
   * @param req - Express request. Body: `{ id, email, displayName }`.
   * @param res - Express response.
   * @returns 200 with the updated profile, 404 when no profile exists.
   * @throws {ZodError} When the body fails schema validation.
   *
   * @example
   *   PUT /users { "id": "9f1c…", "email": "ada@example.com", "displayName": "Ada" }
   *   → 200 { "id": "9f1c…", "email": "ada@example.com", "displayName": "Ada", "createdAt": "…" }
   */
  update: async (req: Request, res: Response) => {
    const { id, email, displayName } = updateUserSchema.parse(req.body);

    const profile = profiles.get(id);
    if (!profile) {
      logger.warn({ userId: id }, 'Profile update missed');
      return respondUserNotFound(res);
    }

    const updatedProfile: UserProfile = { ...profile, email, displayName };
    profiles.set(id, updatedProfile);

    logger.info({ userId: id }, 'User profile updated');
    return res.status(200).json(updatedProfile);
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
      return respondUserNotFound(res);
    }

    return res.status(200).json(profile);
  },

  /**
   * Deletes a user profile by id.
   *
   * @param req - Express request. Params: `{ id }`.
   * @param res - Express response.
   * @returns 204 when deleted, 404 when no profile exists.
   * @throws {ZodError} When `id` is not a UUID.
   */
  deleteById: async (req: Request, res: Response) => {
    const { id } = userIdParamSchema.parse(req.params);

    if (!profiles.delete(id)) {
      logger.warn({ userId: id }, 'Profile deletion missed');
      return respondUserNotFound(res);
    }

    logger.info({ userId: id }, 'User profile deleted');
    return res.status(204).send();
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
