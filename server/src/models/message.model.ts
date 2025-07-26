import mongoose, { Schema } from "mongoose";

import { type IMessageSchema } from "@shared/types/message.types";

interface IMessageSchemaDocument extends IMessageSchema, Document {
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

const MessageSchema = new Schema<IMessageSchemaDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },

    content: { type: String, default: "" },

    seenBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        seen_at: { type: Date },
      },
    ],

    deliveryStatus: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    type: {
      type: String,
      enum: [
        "text",
        "pinned_info",
        "event_schedule",
        "call_log",
        "reply",
        "system",
      ],
      default: "text",
    },

    callInfo: {
      startedAt: Date,
      endedAt: Date,
      missedAt: Date,
      callType: { type: String, enum: ["audio", "video"] },
    },

    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file", "audio", "other"],
        },
        url: String,
        name: String,
        size: Number,
        thumbnail_url: String,
        metadata: Schema.Types.Mixed,
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],

    reactions: [
      {
        emoji: String,
        user: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],

    replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },

    favoriteBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

    isPinned: { type: Boolean, default: false },
    pinnedAt: { type: Date, default: null },
    pinnedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

MessageSchema.index({ sender: 1, room: 1 });

const MessageModel = mongoose.model<IMessageSchemaDocument>(
  "Message",
  MessageSchema
);

export default MessageModel;
