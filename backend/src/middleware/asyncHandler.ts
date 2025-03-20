import { Request, Response, NextFunction } from "express";

/**
 * Wrapper function to catch async errors and pass them to Express error handler.
 * @param fn - Async function
 * @returns Express middleware function
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
