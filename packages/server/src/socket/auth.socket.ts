import { redisConnection } from "../db/redis";
import { generateRedisKeys } from "../utils";
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
    if (!socket.handshake.headers.cookie) {
      console.log("❌ No cookie found in socket handshake headers.");
      return next(
        new Error("Authentication error: Missing cookies in request.")
      );
    }

    const cookies = Object.fromEntries(
      socket.handshake.headers.cookie.split("; ").map((c: string) => {
        const [key, value] = c.split("=");
        return [key, value];
      })
    );
    const token = cookies.accessToken;

    if (!token) {
      console.log("❌ No access token found in cookies.");
      return next(
        new Error("Authentication error: Missing access token in cookies.")
      );
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
    next(new Error(`Authentication error: ${err.message || "Invalid token."}`));
  }
};
