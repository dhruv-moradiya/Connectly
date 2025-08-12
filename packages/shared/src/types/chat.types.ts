import { Types } from "mongoose";

type UserRole = "admin" | "member";

type TAuditLogAction =
  | "added_user"
  | "removed_user"
  | "made_admin"
  | "removed_admin"
  | "banned_user"
  | "muted_user"
  | "unbanned_user"
  | "unmuted_user"
  | "renamed_group"
  | "updated_group_description"
  | "changed_icon"
  | "updated_settings"
  | "pinned_message"
  | "unpinned_message"
  | "joined_via_link"
  | "left_group"
  | "created_chat"
  | "created_group_chat";

type AuditLogData =
  | { action: "added_user"; data: { target_user: string; invited_by?: string } }
  | { action: "removed_user"; data: { target_user: string; reason?: string } }
  | { action: "made_admin"; data: { target_user: string } }
  | { action: "removed_admin"; data: { target_user: string } }
  | {
      action: "banned_user";
      data: { target_user: string; reason: string; expires_at: Date };
    }
  | { action: "unbanned_user"; data: { target_user: string } }
  | { action: "muted_user"; data: { target_user: string; expires_at: Date } }
  | { action: "unmuted_user"; data: { target_user: string } }
  | { action: "renamed_group"; data: { old_name: string; new_name: string } }
  | { action: "updated_group_description"; data: { description: string } }
  | { action: "changed_icon"; data: { old_icon?: string; new_icon?: string } }
  | { action: "updated_settings"; data: { changed_keys: string[] } }
  | { action: "pinned_message"; data: { message_id: string } }
  | { action: "unpinned_message"; data: { message_id: string } }
  | { action: "joined_via_link"; data: { user: string } }
  | { action: "left_group"; data: { user: string } }
  | { action: "created_chat"; data: { users: string[] } }
  | {
      action: "created_group_chat";
      data: { group_name: string; participants: string[] };
    };

interface ISettings {
  invitePermission: "everyone" | "admins";
  allowReactions: boolean;
  allowPinning: boolean;
  editGroupInfo: boolean;
  sendNewMessages: boolean;
}

interface IChatRoom {
  name: string;
  description: string;
  groupIcon: string;
  createdBy: Types.ObjectId;
  isGroup: boolean;

  participants: {
    user: Types.ObjectId;
    role: "admin" | "member";
    invitedBy?: string;
  }[];

  isMutedFor: [
    {
      user: Types.ObjectId;
      expiry: Date;
    }
  ];
  isPinnedFor: Types.ObjectId[];

  bannedUsers: Types.ObjectId[];
  mutedUsers: Types.ObjectId[];

  lastMessage?: Types.ObjectId;

  inviteLink?: {
    link: string;
    generatedBy: Types.ObjectId;
    expiry: Date;
  }[];

  unreadCount: {
    user: Types.ObjectId;
    count: number;
  }[];

  settings: ISettings;

  pinnedMessageDetails: {
    message: Types.ObjectId;
    pinnedBy: Types.ObjectId;
    pinnedAt: Date;
  }[];
}

interface IParticipant {
  user: string;
  role: "admin" | "member";
  invitedBy?: string;
}

interface IChatRoomForCache {
  _id: string;
  name: string;
  participants: IParticipant[];
  createdBy: string;
  isGroup: boolean;
}

export type {
  IChatRoom,
  TAuditLogAction,
  AuditLogData,
  UserRole,
  ISettings,
  IChatRoomForCache,
};
