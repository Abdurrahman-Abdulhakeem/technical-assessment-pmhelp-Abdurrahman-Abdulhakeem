import { Request, Response, NextFunction } from "express";

type AsyncFunction<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync =
  <T extends Request>(fn: AsyncFunction<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as T, res, next).catch(next);
  };
