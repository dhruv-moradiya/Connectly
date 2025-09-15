import { type Socket } from "socket.io-client";
import type {
  IChatPreview,
  IMessage,
  IMessageSeenUser,
  IReplyMessage,
  TMessageSenderDetails,
  TMessageType,
} from "./api-response.type";
import type { ActionType, SocketEvents } from "@/lib/constants";

export interface TMessageSeenUsersSocketData extends IMessageSeenUser {
  messageId: string;
}

type TServerToClientEvents = {
  [SocketEvents.WELCOME]: (data: { message: string }) => void;
  [SocketEvents.CONNECT_ERROR]: (data: { message: string }) => void;
  [SocketEvents.DISCONNECT]: (reason: string) => void;

  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => void;

  [SocketEvents.MESSAGE_RECEIVED]: (
    // data: TMessageReceivedEventReceived
    data: IMessage
  ) => void;
  [SocketEvents.MESSAGE_SENT]: (data: TMessageReceivedEventReceived) => void;
  [SocketEvents.MESSAGE_DELIVERED]: (data: { _id: string }) => void;
  [SocketEvents.MESSAGE_SEEN]: (data: { _id: string }) => void;
  [SocketEvents.LAST_MESSAGE]: (
    // data: TMessageReceivedEventReceived
    data: IMessage
  ) => void;
  [SocketEvents.MESSAGE_SEEN_BY]: (data: TMessageSeenUsersSocketData[]) => void;

  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => void;
  [SocketEvents.JOIN_ROOM_SUCCESS]: (data: IJoinRoomSuccess) => void;
  [SocketEvents.LEAVE_ROOM_ERROR]: (data: string) => void;
  [SocketEvents.LEAVE_ROOM_SUCCESS]: (data: string) => void;

  [SocketEvents.RECONNECT_ATTEMPT]: (attemptNumber: number) => void;
  [SocketEvents.RECONNECT]: (attemptNumber: number) => void;
  [SocketEvents.RECONNECT_ERROR]: (err: string) => void;
  [SocketEvents.RECONNECT_FAILED]: (err: string) => void;
};

type TClientToServerEvents = {
  [SocketEvents.MESSAGE_SENT]: (data: {
    _id: string;
    chatId: string;
    content: string;
    replyTo: IReplyMessage | null;
  }) => void;
  [SocketEvents.JOIN_ROOM]: (data: { chatId: string }) => void;
  [SocketEvents.LEAVE_ROOM]: (data: { chatId: string }) => void;
};

type TypedSocket = Socket<TServerToClientEvents, TClientToServerEvents>;
export type ServerToClientEventNames = keyof TServerToClientEvents;
export type ClientToServerEventNames = keyof TClientToServerEvents;

// Socket Response base interface
interface IBaseSocketResponse {
  success: boolean;
  message: string;
}

interface IJoinRoomError extends IBaseSocketResponse {
  data: null;
}

interface IJoinRoomSuccess extends IBaseSocketResponse {
  data: {
    chatId: string;
  };
}

type TChatCreatedEventReceived = {
  data: IChatPreview;
  message: string;
};

type TMessageReceivedEventReceived = {
  _id: string;
  chatId: string;
  content: string;
  sender: TMessageSenderDetails;
  type: TMessageType;
};

type TLastMessage = {
  _id: string;
  content: string;
  chatId: string;
};

// socket-action-types.ts

export interface ActionPayloadMap {
  [ActionType.SEND_MESSAGE]: {
    _id: string;
    content: string;
    replyTo: IReplyMessage | null;
  };
  [ActionType.SET_ACTIVE_CHAT]: string;
  [ActionType.CLEAR_ACTIVE_CHAT]: string;
  [ActionType.CREATE_CONNECTION]: undefined;
  [ActionType.DISCONNET_CONNECTION]: undefined;
}

export type SocketAction = {
  [K in keyof ActionPayloadMap]: ActionPayloadMap[K] extends undefined
    ? { type: K }
    : { type: K; payload: ActionPayloadMap[K] };
}[keyof ActionPayloadMap];

export type {
  TypedSocket,
  TServerToClientEvents,
  TClientToServerEvents,
  IJoinRoomError,
  IJoinRoomSuccess,
  TChatCreatedEventReceived,
  TMessageReceivedEventReceived,
  TLastMessage,
};
