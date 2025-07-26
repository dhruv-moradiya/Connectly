import { Types } from "mongoose";

interface IMessageSchema {
  sender: Types.ObjectId;
  room: Types.ObjectId;
  content: string;

  deliveryStatus: "sent" | "delivered" | "seen";

  seenBy: {
    user: Types.ObjectId;
    seen_at: Date;
  }[];

  type:
    | "text"
    | "pinned_info"
    | "event_schedule"
    | "call_log"
    | "reply"
    | "system";

  callInfo?: {
    startedAt: Date;
    endedAt: Date;
    missedMt: Date;
    callType: "audio" | "video";
  };

  attachments: {
    type: "image" | "video" | "file" | "audio" | "other";
    url: string;
    name: string;
    size: number;
    thumbnailUrl?: string;
    metadata: {
      size: number;
      duration?: number;
    };
  }[];

  isDeleted: boolean;
  deletedFor: Types.ObjectId[];

  reactions: {
    emoji: string;
    user: Types.ObjectId;
  }[];

  replyTo: Types.ObjectId | null;
  favoriteBy: Types.ObjectId[];

  isPinned: boolean;
  pinnedAt: Date | null;
  pinnedBy: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

export type { IMessageSchema };
