import { ApiError } from "@/utils/apiError";
import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  console.error("Global Error:", {
    message: (error as Error).message,
    stack: (error as Error).stack,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    ...(process.env.NODE_ENV !== "production" && {
      stack: (error as Error).stack,
    }),
  });
};

export { globalErrorHandler };
