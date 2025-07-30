import { redisConnection } from "@/db/redis";
import { generateRedisKeys } from "@/utils";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: any;
  }
}

interface DecodedUser {
  _id: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token =
      cookies.accessToken ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcyOGE0Nzc4OGEzNmJiNjJiOTgwYTYiLCJlbWFpbCI6Inl1amlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJZdWppIiwiYXZhdGFyIjoiaHR0cHM6Ly9pLnBpbmltZy5jb20vNzM2eC83OS85My8yYS83OTkzMmE3MjBhZjhiZjg4YjNiMTE5MzllMjBlYzAzYS5qcGciLCJiaW8iOiIiLCJpYXQiOjE3NTM3MTczODgsImV4cCI6MTc1MzgwMzc4OH0.NOg2wF_uz6vZWQMfNOEDN6R4CmwUI6_7tV4NlniX1RM";

    if (!token) {
      console.log("❌ No token found in cookies.");
      return next(new Error("Authentication error"));
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error(
        "JWT_ACCESS_SECRET is not defined in environment variables."
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    ) as DecodedUser;

    socket.join(decoded._id);

    redisConnection.set(generateRedisKeys.onlineStatus(decoded._id), "true");

    socket.user = decoded;
    console.log(`✅ Authenticated user: ${decoded.username}`);
    next();
  } catch (err: any) {
    console.log("❌ JWT verification failed:", err.message);
    next(new Error("Authentication error"));
  }
};
