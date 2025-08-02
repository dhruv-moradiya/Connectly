import { Document, Types } from "mongoose";

// interface IUserSchema extends Document {
//   username: string;
//   email: string;
//   password: string;
//   avatar: string;
//   bio: string;
//   isEmailVerified: boolean;
//   friends: Types.ObjectId[];
//   friendRequests: Types.ObjectId[];
//   blockedUsers: Types.ObjectId[];
//   last_seen: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   refreshToken: string;
//   comparePassword: (password: string) => Promise<boolean>;
//   generateAccessToken: () => Promise<string>;
//   generateRefreshToken: () => Promise<string>;
// }

interface IOtpSchema extends Document {
  email: string;
  otp: string;
  purpose: "verify_email" | "verify_phone" | "reset_password";
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
  compareOtp: (otp: string) => Promise<boolean>;
}

interface IMessagechema extends Document {
  sender: Types.ObjectId;
  room: Types.ObjectId;
  content: string;
  seen_by: { user: Types.ObjectId; seen_at: Date }[];
  type:
    | "text"
    | "pinned_info"
    | "event_schedule"
    | "call_log"
    | "reply"
    | "system";
  call_info?: {
    started_at?: Date;
    ended_at?: Date;
    missed_at?: Date;
    call_type?: "audio" | "video";
  };
  attachments: {
    type: "image" | "video" | "file" | "audio" | "other";
    url: string;
    name: string;
    size: number;
    thumbnail_url: string;
    metadata: any;
  }[];
  is_deleted: boolean;
  deleted_for: Types.ObjectId[];
  reactions: {
    emoji: string;
    user: Types.ObjectId;
  }[];
  reply_to: Types.ObjectId | null;
  favorite_by: Types.ObjectId[];
  is_pinned: boolean;
  pinned_at: Date | null;
  pinned_by: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;

  // deleteMessage: () => Promise<void>;
  // markAsSeen: (userId: Types.ObjectId) => Promise<void>;
  // addAttachment: (attachment: {
  //   type: "image" | "video" | "file" | "audio" | "other";
  //   url: string;
  //   name: string;
  //   size: number;
  //   thumbnail_url?: string;
  //   metadata?: any;
  // }) => Promise<void>;
  // removeAttachment: (attachmentId: Types.ObjectId) => Promise<void>;
  // addReply: (message: Types.ObjectId) => Promise<void>;
}

type UserRole = "admin" | "member";

interface IRole {
  user: Types.ObjectId;
  role: UserRole;
  invited_by?: Types.ObjectId;
}

interface IUnreadCount {
  user: Types.ObjectId;
  count: number;
}

interface IBanEntry {
  user: Types.ObjectId;
  banned_by: Types.ObjectId;
  reason?: string;
  expires_at?: Date;
}

interface IMuteEntry {
  user: Types.ObjectId;
  muted_by: Types.ObjectId;
  expires_at?: Date;
}

interface BaseAuditLog {
  performed_by: Types.ObjectId;
  timestamp: Date;
}

type IAuditLog =
  | ({
      action: "added_user" | "removed_user" | "made_admin" | "removed_admin";
      target_user: Types.ObjectId;
    } & BaseAuditLog)
  | ({
      action: "banned_user" | "muted_user";
      target_user: Types.ObjectId;
      reason?: string;
      expires_at?: Date;
    } & BaseAuditLog)
  | ({
      action: "unbanned_user" | "unmuted_user";
      target_user: Types.ObjectId;
    } & BaseAuditLog)
  | ({
      action: "renamed_group";
      old_name: string;
      new_name: string;
    } & BaseAuditLog)
  | ({
      action: "changed_icon";
      new_icon?: string;
    } & BaseAuditLog)
  | ({
      action: "updated_settings";
      changed_keys: string[]; // e.g., ['allow_reactions', 'invite_permission']
    } & BaseAuditLog)
  | ({
      action: "pinned_message" | "unpinned_message";
      message_id: Types.ObjectId;
    } & BaseAuditLog)
  | ({
      action: "joined_via_link";
      source: "link";
    } & BaseAuditLog)
  | ({
      action: "left_group";
    } & BaseAuditLog)
  | ({
      action: "created_group";
    } & BaseAuditLog);

interface IChatRoom extends Document {
  name?: string;
  description?: string;
  group_icon?: string;
  invite_link?: string;
  isGroup: boolean;

  // Users
  participants: Types.ObjectId[];
  created_by: Types.ObjectId;
  roles: IRole[];
  is_muted_for: Types.ObjectId[];
  is_pinned_for: Types.ObjectId[];

  // Moderation
  banned_users: IBanEntry[];
  muted_users: IMuteEntry[];

  // Message Info
  last_message?: Types.ObjectId;
  unread_counts: IUnreadCount[];

  // Settings (post_permission removed)
  settings: {
    invite_permission: "everyone" | "admins";
    allow_reactions: boolean;
    notify_on_join_leave: boolean;
    allow_pinning: boolean;
  };

  // Auditing
  audit_logs: IAuditLog[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type {
  // IUserSchema,
  IOtpSchema,
  IMessagechema,
  IChatRoom,
  IRole,
  IUnreadCount,
  IBanEntry,
  IMuteEntry,
  IAuditLog,
};
