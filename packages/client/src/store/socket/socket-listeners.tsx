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
  messageSeenByUserReducer,
  messageSeenSuccess,
  messageSentSuccess,
} from "../active-chat/active-chat-slice";
import { connectionError, reaconnectedConnection } from "./socket.slice";

type SocketListeners = (store: MiddlewareAPI) => Partial<TServerToClientEvents>;

const SOCKET_LISTENERS: SocketListeners = (store) => ({
  // Connection and Disconnection related events
  [SocketEvents.WELCOME]: (data) => {
    console.log("✅ Socket connected:", data);
  },

  [SocketEvents.CONNECT_ERROR]: (data) => {
    console.log("❌ Socket connection error:", data.message);
    store.dispatch(connectionError(data.message));
  },

  [SocketEvents.DISCONNECT]: (reason) => {
    console.log("❌ Socket disconnected:", reason);
    store.dispatch(connectionError(reason));
  },

  [SocketEvents.RECONNECT_ATTEMPT]: (attemptNumber) => {
    console.log(`Reconnection attempt #${attemptNumber}`);
  },

  [SocketEvents.RECONNECT]: (attemptNumber) => {
    console.log(`Successfully reconnected after ${attemptNumber} attempts.`);
    showToast(
      "Reconnected",
      "You have been reconnected to the server.",
      "success"
    );
    store.dispatch(reaconnectedConnection(attemptNumber));
  },

  [SocketEvents.RECONNECT_ERROR]: (err) => {
    console.error("Reconnection error:", err);
  },

  [SocketEvents.RECONNECT_FAILED]: () => {
    console.error("Reconnection failed after all attempts.");
  },

  // Chat related events
  [SocketEvents.CHAT_CREATED]: (data) => {
    store.dispatch(chatCreatedReducer(data.data));
  },

  [SocketEvents.CHAT_MEMBERS_ADDED]: (data) => {
    console.log("data CHAT_MEMBERS_ADDED", data);
  },

  // Messages related events
  [SocketEvents.MESSAGE_RECEIVED]: (data) => {
    store.dispatch(messageReceivedReducer(data));
  },

  [SocketEvents.MESSAGE_SENT]: (data) => {
    store.dispatch(messageSentSuccess(data));
  },

  [SocketEvents.MESSAGE_DELIVERED]: (data) => {
    store.dispatch(messageDeliveredSuccess(data));
  },

  [SocketEvents.MESSAGE_SEEN]: (data) => {
    store.dispatch(messageSeenSuccess(data));
  },

  [SocketEvents.LAST_MESSAGE]: (data) => {
    store.dispatch(updateLastMessageReducer(data));
  },

  [SocketEvents.MESSAGE_SEEN_BY]: (data) => {
    const payload = {
      messageId: data[0].messageId,
      users: data.map(({ messageId, ...rest }) => rest),
    };
    store.dispatch(messageSeenByUserReducer(payload));
  },

  // Rooms related events
  [SocketEvents.JOIN_ROOM_ERROR]: (data) => {
    showToast("Join room error", data.message, "error");
  },

  [SocketEvents.JOIN_ROOM_SUCCESS]: (_data) => {
    // showToast("Join room success", data.message, "success");
  },

  [SocketEvents.LEAVE_ROOM_ERROR]: (data) => {
    showToast("Leave room error", data, "error");
  },

  [SocketEvents.LEAVE_ROOM_SUCCESS]: (data) => {
    showToast("Leave room success", data, "success");
  },
});

function registerSocketListeners(store: MiddlewareAPI, socket: TypedSocket) {
  if (!socket) return;

  const listeners = SOCKET_LISTENERS(store);

  (
    Object.entries(listeners) as {
      [K in keyof TServerToClientEvents]: [K, TServerToClientEvents[K]];
    }[keyof TServerToClientEvents][]
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
