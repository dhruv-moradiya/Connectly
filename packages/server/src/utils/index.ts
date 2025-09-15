import { type Response } from "express";
import { IssueData, z } from "zod";

interface SetAuthCookiesOptions {
  res: Response;
  accessToken: string;
  refreshToken: string;
  isProd?: boolean;
}

type FileOptions = {
  maxSizeMB?: number; // e.g. 10
  allowedMimeTypes?: string[]; // e.g. ["image/png","image/jpeg","application/pdf"]
};

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
  user: (userId: string) => `user:${userId}:details`,
  roomMessages: (roomId: string) => `room:${roomId}:messages`,
  unreadCount: (roomId: string, userId: string) =>
    `room:${roomId}:unread:${userId}`,
  typing: (roomId: string, userId: string) => `room:${roomId}:typing:${userId}`,
  onlineStatus: (userId: string) => `user:${userId}:online`,
  activeRomm: (userId: string) => `user:${userId}:active_room`,
  notifications: (userId: string) => `user:${userId}:notifications`,
  socketMap: (socketId: string) => `socket:${socketId}:user`,
  roomParticipants: (roomId: string) => `room:${roomId}:participants`,
  roomDetails: (roomId: string) => `room:${roomId}:details`,
};

export function getCloudinaryFolder(
  type: "user" | "groupChat" | "message",
  id: string
) {
  switch (type) {
    case "user":
      return `connectly/users/${id}/profile`;
    case "groupChat":
      return `connectly/groupChats/${id}`;
    case "message":
      return `connectly/messages/${id}/attachments`;
    default:
      return "misc";
  }
}

export function handleJobError(
  error: unknown,
  contextMessage: string,
  rethrowMessage = "Job failed"
): never {
  if (error instanceof Error) {
    console.error(`[Job Error] ${contextMessage}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  } else {
    console.error(`[Job Error] ${contextMessage}:`, error);
  }

  throw new Error(rethrowMessage);
}

export function handleError(
  error: unknown,
  contextMessage: string,
  rethrowMessage = "Operation failed"
): never {
  if (error instanceof Error) {
    console.error(`[Error] ${contextMessage}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  } else {
    console.error(`[Error] ${contextMessage}:`, error);
  }

  throw new Error(rethrowMessage);
}

export const fileSchema = ({
  maxSizeMB = 10,
  allowedMimeTypes = [],
}: FileOptions = {}) =>
  z
    .instanceof(File, { message: "Please select a file." })
    .superRefine((file, ctx) => {
      if (file.size === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Empty file." });
      }
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: "array",
          message: `File must be ≤ ${maxSizeMB} MB.`,
        } as IssueData);
      }
      if (allowedMimeTypes.length && !allowedMimeTypes.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unsupported type: ${file.type || "unknown"}.`,
        });
      }
    });
