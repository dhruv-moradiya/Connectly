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

export type { IUserSchema };
