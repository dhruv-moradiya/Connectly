import type { TUserAuth } from "./auth-type";

interface IBaseType {
  success: boolean;
  message: string;
  statusCode: number;
}

interface IUserPreview {
  _id: string;
  username: string;
  avatar: string;
  role: string;
  email: string;
}

interface IGetCurrentUser extends IBaseType {
  data: TUserAuth;
}

interface IChatPreview {
  _id: string;
  name: string;
  isGroup: boolean;
  unreadCount: [];
  participants: IUserPreview[];
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
};
