import { Types } from "mongoose";

interface IUserSchema {
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  isEmailVerified: boolean;
  friends: Types.ObjectId[];
  friendRequests: Types.ObjectId[];
  blockedUsers: Types.ObjectId[];
  last_seen: Date;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
}

interface IUserPreiveForCache {
  _id: Types.ObjectId;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  isEmailVerified: boolean;
}

export type { IUserSchema, IUserPreiveForCache };
