import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';

// In-memory user store for the demo. Keyed by email.
const users = new Map<string, { id: string; email: string; passwordHash: string }>();

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    if (users.has(email)) {
      return res.status(409).json({ error: 'email already registered' });
    }

    // Inline password hashing — extract me into a password service
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const id = crypto.randomUUID();
    users.set(email, { id, email, passwordHash });

    logger.info({ email }, 'User registered');
    return res.status(201).json({ id, email });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    // Inline password verification — extract me into a password service
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      logger.warn({ email }, 'Login failed: bad password');
      return res.status(401).json({ error: 'invalid credentials' });
    }

    logger.info({ email }, 'User logged in');
    return res.status(200).json({ id: user.id, email: user.email });
  },
};
