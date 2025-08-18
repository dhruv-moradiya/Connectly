import { type Socket } from "socket.io-client";
import type {
  ILastMessage,
  IUserPreview,
  TMessageSenderDetails,
  TMessageType,
} from "./api-response.type";
import type { ActionType, SocketEvents } from "@/lib/constants";

type TServerToClientEvents = {
  [SocketEvents.WELCOME]: (data: { message: string }) => void;
  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => void;
  [SocketEvents.MESSAGE_RECEIVED]: (
    data: TMessageReceivedEventReceived
  ) => void;
  [SocketEvents.MESSAGE_SENT]: (data: TMessageReceivedEventReceived) => void;
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
    chatId: string;
    content: string;
    _id: string;
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
  data: {
    _id: string;
    name: string;
    isGroup: boolean;
    participants: IUserPreview[];
    unreadCount: [];
    lastMessage: ILastMessage;
  };
  message: string;
};

type TMessageReceivedEventReceived = {
  chatId: string;
  _id: string;
  content: string;
  sender: TMessageSenderDetails;
  type: TMessageType;
};

// socket-action-types.ts

export interface ActionPayloadMap {
  [ActionType.SEND_MESSAGE]: {
    content: string;
    _id: string;
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
};
