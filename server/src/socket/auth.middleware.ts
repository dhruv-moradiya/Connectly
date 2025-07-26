// src/sockets/auth.middleware.ts
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

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
    const token = cookies.accessToken;

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

    socket.join(decoded._id); // Join the socket to a room based on user ID
    socket.user = decoded;
    console.log(`✅ Authenticated user: ${decoded.username}`);
    next();
  } catch (err: any) {
    console.log("❌ JWT verification failed:", err.message);
    next(new Error("Authentication error"));
  }
};
