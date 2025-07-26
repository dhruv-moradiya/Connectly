import { type Request, type Response, type NextFunction } from "express";

const asyncHandler = (fun: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { asyncHandler };
