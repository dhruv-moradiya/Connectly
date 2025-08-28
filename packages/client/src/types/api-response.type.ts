import type { TUserAuth } from "./auth-type";

// Base type for all the API responses
interface IBaseType {
  success: boolean;
  message: string;
  statusCode: number;
}

type TMessageDeliveryStatus = "pending" | "sent" | "delivered" | "seen";

type TMessageType =
  | "text"
  | "pinned_info"
  | "event_schedule"
  | "call_log"
  | "reply"
  | "system";

interface IReplyMessage {
  _id: string;
  content: string;
}

interface IMessage {
  _id: string;
  content: string;
  createdAt: string;
  deliveryStatus: TMessageDeliveryStatus;
  type: TMessageType;
  sender: TMessageSenderDetails;
  replyTo: IReplyMessage | null;
}

// User preview short details about user
interface IUserPreview {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  email: string;
}

// Chat preview
interface IChatPreview {
  _id: string;
  name: string;
  isGroup: boolean;
  groupIcon: {
    publicId: string;
    url: string;
  } | null;
  unreadCount: [];
  participants: IUserPreview[];
  lastMessage: IMessage;
}

type TMessageSenderDetails = {
  _id: string;
  username: string;
  avatar: string;
};

interface IGetCurrentUser extends IBaseType {
  data: TUserAuth;
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

interface IActiveChatMessages extends IBaseType {
  data: {
    messages: IMessage[];
    totalMessages: number;
    totalPages: number;
  };
}

interface IConnections extends IBaseType {
  data: {
    connections: IUserPreview[];
  };
}

interface IUserLogout extends IBaseType {
  data: {};
}

export {
  type IUserLogout,
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
  type IConnections,
  type IReplyMessage,
};
