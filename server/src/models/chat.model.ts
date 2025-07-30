import mongoose, { Schema, Document } from "mongoose";
import { type IChatRoom, type TAuditLogAction } from "@shared/types/chat.types";

const validAuditActions: TAuditLogAction[] = [
  "added_user",
  "removed_user",
  "made_admin",
  "removed_admin",
  "banned_user",
  "muted_user",
  "unbanned_user",
  "unmuted_user",
  "renamed_group",
  "updated_group_description",
  "changed_icon",
  "updated_settings",
  "pinned_message",
  "unpinned_message",
  "joined_via_link",
  "left_group",
  "created_chat",
  "created_group_chat",
];

interface IChatRoomDocument extends IChatRoom, Document {}

const ParticipantSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const ChatRoomSchema = new Schema<IChatRoomDocument>(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    groupIcon: { type: String, trim: true },

    isGroup: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    participants: [ParticipantSchema],

    isMutedFor: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        expiry: { type: Date },
        _id: false,
      },
    ],
    isPinnedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],

    bannedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mutedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },

    inviteLink: [
      {
        link: { type: String },
        generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        expiry: { type: Date },
        _id: false,
      },
    ],

    unreadCount: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        count: { type: Number, default: 0 },
      },
    ],

    settings: {
      invitePermission: {
        type: String,
        enum: ["everyone", "admins"],
        default: "admins",
      },
      allowReactions: { type: Boolean, default: true },
      allowPinning: { type: Boolean, default: true },
    },

    pinnedMessageDetails: [
      {
        message: { type: Schema.Types.ObjectId, ref: "Message" },
        pinnedBy: { type: Schema.Types.ObjectId, ref: "User" },
        pinnedAt: { type: Date, default: Date.now() },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

ChatRoomSchema.index({ name: "text", description: "text" });
ChatRoomSchema.index({ participants: 1, isGroup: 1 });
ChatRoomSchema.index({ createdBy: 1, isGroup: 1 });

ChatRoomSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const ChatRoom = mongoose.model<IChatRoomDocument>("ChatRoom", ChatRoomSchema);
export default ChatRoom;
