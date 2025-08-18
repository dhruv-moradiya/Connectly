import type { TUserAuth } from "./auth-type";

// Base type for all the API responses
interface IBaseType {
  success: boolean;
  message: string;
  statusCode: number;
}

// User preview short details about user
interface IUserPreview {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  email: string;
}

// User details including token
interface IGetCurrentUser extends IBaseType {
  data: TUserAuth;
}

interface ILastMessage {
  _id: string;
  content: string;
  sender: string;
  createdAt: string;
  deliveryStatus: TMessageDeliveryStatus;
  type: TMessageType;
  isDeleted: boolean;
  deletedFor: string[];
  reactions: string[];
}

// Chat preview
interface IChatPreview {
  _id: string;
  name: string;
  isGroup: boolean;
  unreadCount: [];
  participants: IUserPreview[];
  lastMessage: ILastMessage;
}

interface IUserChats extends IBaseType {
  data: IChatPreview[];
}

interface IGetUsersByUsernameQuery extends IBaseType {
  data: IUserPreview[];
}

interface ICreateNewChat extends IBaseType {
  data: {
    chatId: string;
  };
}

type TMessageDeliveryStatus = "pending" | "sent" | "delivered" | "seen";

type TMessageSenderDetails = {
  _id: string;
  username: string;
  avatar: string;
};

type TMessageType =
  | "text"
  | "pinned_info"
  | "event_schedule"
  | "call_log"
  | "reply"
  | "system";

interface IMessage {
  _id: string;
  content: string;
  createdAt: string;
  deliveryStatus: TMessageDeliveryStatus;
  type: TMessageType;
  sender: TMessageSenderDetails;
}

interface IActiveChatMessages extends IBaseType {
  data: {
    messages: IMessage[];
    totalMessages: number;
    totalPages: number;
  };
}

export {
  type IUserPreview,
  type IGetCurrentUser,
  type IUserChats,
  type IChatPreview,
  type IGetUsersByUsernameQuery,
  type ICreateNewChat,
  type IActiveChatMessages,
  type IMessage,
  type TMessageDeliveryStatus,
  type TMessageSenderDetails,
  type TMessageType,
  type ILastMessage,
};
