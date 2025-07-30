import { type Response } from "express";

interface SetAuthCookiesOptions {
  res: Response;
  accessToken: string;
  refreshToken: string;
  isProd?: boolean;
}

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
  isProd = process.env.NODE_ENV === "production",
}: SetAuthCookiesOptions): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export function formatErrorMessages(errors: Record<string, string[]>): string {
  return Object.values(errors)
    .flat() // Flattens arrays like ['OTP is required'], ['Email is required'] into one array
    .join(", "); // Joins all messages into a single string
}

export const generateRedisKeys = {
  user: (userId: string) => `user:${userId}:online`,
  roomMessages: (roomId: string) => `room:${roomId}:messages`,
  unreadCount: (roomId: string, userId: string) =>
    `room:${roomId}:unread:${userId}`,
  typing: (roomId: string, userId: string) => `room:${roomId}:typing:${userId}`,
  onlineStatus: (userId: string) => `user:${userId}:online`,
  notifications: (userId: string) => `user:${userId}:notifications`,
  socketMap: (socketId: string) => `socket:${socketId}:user`,
};
