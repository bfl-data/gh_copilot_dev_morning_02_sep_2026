import express, { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { config } from './config.js';
import { authController } from './controllers/auth-controller.js';
import { userController } from './controllers/user-controller.js';
import { logger } from './lib/logger.js';
import { asyncHandler } from './middleware/async-handler.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.post('/auth/register', asyncHandler(authController.register));
app.post('/auth/login', asyncHandler(authController.login));

app.post('/users', asyncHandler(userController.create));
app.get('/users', asyncHandler(userController.list));
app.get('/users/:id', asyncHandler(userController.getById));

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

/** Global error handler. Schema failures become 400s; everything else is a 500. */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Request failed validation',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  logger.error({ err }, 'Unhandled request error');
  return res
    .status(500)
    .json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
});

app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, 'Demo service listening');
});
