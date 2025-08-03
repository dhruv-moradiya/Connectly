import { type Socket } from "socket.io-client";
import type { IUserPreview } from "./api-response.type";
import type { ActionType, SocketEvents } from "@/lib/constants";
import type { Middleware } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/store";

type TServerToClientEvents = {
  welcome: (data: string) => void;
  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => void;
  [SocketEvents.MESSAGE_RECEIVED]: (
    data: TMessageReceivedEventReceived
  ) => void;
  [SocketEvents.MESSAGE_SENT]: (data: TMessageReceivedEventReceived) => void;
  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => void;
  [SocketEvents.JOIN_ROOM_SUCCESS]: (data: IJoinRoomSuccess) => void;
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
  };
  message: string;
};

type TMessageReceivedEventReceived = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  chatId: string;
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
