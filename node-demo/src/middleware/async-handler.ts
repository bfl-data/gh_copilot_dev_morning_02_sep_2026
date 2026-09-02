import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async route handler so a rejected promise reaches the global error
 * handler instead of becoming an unhandled rejection.
 *
 * Every async controller method is registered through this wrapper — controllers
 * never `try/catch` to swallow errors.
 *
 * @param handler - The async handler to wrap.
 * @returns An Express request handler that forwards rejections to `next`.
 *
 * @example
 *   app.post('/users', asyncHandler(userController.create));
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
