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
import { chatCreatedReducer } from "../chats/user-chats-slice";
import { showToast } from "@/lib/utils";
import {
  messageDeliveredSuccess,
  messageReceivedReducer,
  messageSeenSuccess,
  messageSentSuccess,
} from "../active-chat/active-chat-slice";
import type { IMessage } from "@/types/api-response.type";

const SOCKET_LISTENERS = (store: MiddlewareAPI) => ({
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
    console.log("✅ Message seen:", data);
    store.dispatch(messageSeenSuccess(data));
  },

  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => {
    showToast("Join room error", data.message, "error");
  },

  [SocketEvents.JOIN_ROOM_SUCCESS]: (data: IJoinRoomSuccess) => {
    showToast("Join room success", data.message, "success");
  },

  [SocketEvents.LEAVE_ROOM_ERROR]: (data: string) => {
    showToast("Leave room error", data, "error");
  },

  [SocketEvents.LEAVE_ROOM_SUCCESS]: (data: string) => {
    showToast("Leave room success", data, "success");
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
