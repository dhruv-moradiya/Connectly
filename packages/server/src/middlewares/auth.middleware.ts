import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { type NextFunction, type Request, type Response } from "express";
import { logger } from "@/utils";

interface DecodedUser {
  _id: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

const verifyToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies.accessToken ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    next(new ApiError("Unauthorized access. Please log in to continue.", 401));
    return;
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    logger.error("JWT_ACCESS_SECRET not defined in environment variables.");
    next(new ApiError("Internal server error, please try again later", 500));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedUser;

    if (!decoded || !decoded._id || !decoded.email || !decoded.username) {
      next(new ApiError("Invalid token payload. Please log in again.", 401));
      return;
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    logger.error({ err: error.message }, "Token verification error");
    next(new ApiError("Invalid token payload. Please log in again.", 401));
    next(error);
  }
};

export default verifyToken;
