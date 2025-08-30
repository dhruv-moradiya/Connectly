import { SocketEvents } from "@/lib/constants";
import type {
  ClientToServerEventNames,
  IJoinRoomError,
  IJoinRoomSuccess,
  TChatCreatedEventReceived,
  TClientToServerEvents,
  TServerToClientEvents,
  TypedSocket,
} from "@/types/middleware.type";
import type { MiddlewareAPI } from "@reduxjs/toolkit";
import {
  chatCreatedReducer,
  updateLastMessageReducer,
} from "../chats/user-chats-slice";
import { showToast } from "@/lib/utils";
import {
  messageDeliveredSuccess,
  messageReceivedReducer,
  messageSeenSuccess,
  messageSentSuccess,
} from "../active-chat/active-chat-slice";
import type { IMessage } from "@/types/api-response.type";
import { connectionError, reaconnectedConnection } from "./socket.slice";

const SOCKET_LISTENERS = (store: MiddlewareAPI) => ({
  [SocketEvents.WELCOME]: (data: { message: string }) => {
    console.log("✅ Socket connected:", data);
  },

  [SocketEvents.CONNECT_ERROR]: (data: { message: string }) => {
    console.log("❌ Socket connection error:", data.message);
    store.dispatch(connectionError(data.message));
  },

  [SocketEvents.DISCONNECT]: (reason: string) => {
    console.log("❌ Socket disconnected:", reason);
    store.dispatch(connectionError(reason));
  },

  [SocketEvents.RECONNECT_ATTEMPT]: (attemptNumber: number) => {
    console.log(`Reconnection attempt #${attemptNumber}`);
  },

  [SocketEvents.RECONNECT]: (attemptNumber: number) => {
    console.log(`Successfully reconnected after ${attemptNumber} attempts.`);
    showToast(
      "Reconnected",
      "You have been reconnected to the server.",
      "success"
    );
    store.dispatch(reaconnectedConnection(attemptNumber));
  },

  [SocketEvents.RECONNECT_ERROR]: (err: string) => {
    console.error("Reconnection error:", err);
  },

  [SocketEvents.RECONNECT_FAILED]: () => {
    console.error("Reconnection failed after all attempts.");
  },

  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => {
    store.dispatch(chatCreatedReducer(data.data));
  },

  [SocketEvents.MESSAGE_RECEIVED]: (data: IMessage) => {
    store.dispatch(messageReceivedReducer(data));
  },

  [SocketEvents.MESSAGE_SENT]: (data: { _id: string }) => {
    store.dispatch(messageSentSuccess(data));
  },

  [SocketEvents.MESSAGE_DELIVERED]: (data: { _id: string }) => {
    store.dispatch(messageDeliveredSuccess(data));
  },

  [SocketEvents.MESSAGE_SEEN]: (data: { _id: string }) => {
    store.dispatch(messageSeenSuccess(data));
  },

  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => {
    showToast("Join room error", data.message, "error");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [SocketEvents.JOIN_ROOM_SUCCESS]: (_data: IJoinRoomSuccess) => {
    // showToast("Join room success", data.message, "success");
  },

  [SocketEvents.LEAVE_ROOM_ERROR]: (data: string) => {
    showToast("Leave room error", data, "error");
  },

  [SocketEvents.LEAVE_ROOM_SUCCESS]: (data: string) => {
    showToast("Leave room success", data, "success");
  },

  [SocketEvents.LAST_MESSAGE]: (data: {
    _id: string;
    content: string;
    chatId: string;
  }) => {
    store.dispatch(updateLastMessageReducer(data));
  },

  [SocketEvents.MESSAGE_SEEN_BY]: (data: { _id: string; seetAt: string }[]) => {
    console.log("data MESSAGE_SEEN_BY :>> ", data);
  },

  // Add more events here...
});

function registerSocketListeners(store: MiddlewareAPI, socket: TypedSocket) {
  if (!socket) return;

  const listeners: Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<keyof TServerToClientEvents, (...args: any[]) => void>
  > = SOCKET_LISTENERS(store);

  (
    Object.entries(listeners) as [
      keyof TServerToClientEvents,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => void
    ][]
  ).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

export function emitToServer<Event extends ClientToServerEventNames>(
  socket: TypedSocket,
  event: Event,
  ...args: Parameters<TClientToServerEvents[Event]>
) {
  socket.emit(event, ...args);
}

export { registerSocketListeners };
