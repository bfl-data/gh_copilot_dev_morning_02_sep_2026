import pino from 'pino';
import { config } from '../config.js';

/**
 * Shared application logger.
 *
 * Every module logs through this instance — never `console.log`.
 * Pass a structured object first, the message second:
 *
 * @example
 *   logger.info({ userId }, 'User created');
 */
export const logger = pino({
  level: config.logLevel,
  redact: ['req.headers.authorization', 'password', 'passwordHash'],
});
