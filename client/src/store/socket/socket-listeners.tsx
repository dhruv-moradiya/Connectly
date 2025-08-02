import { SocketEvents } from "@/lib/constants";
import type {
  IJoinRoomError,
  IJoinRoomSuccess,
  TChatCreatedEventReceived,
  TMessageReceivedEventReceived,
} from "@/types/middleware.type";
import type { MiddlewareAPI } from "@reduxjs/toolkit";
import { chatCreatedReducer } from "../chats/user-chats-slice";
import type { Socket } from "socket.io-client";
import { showToast } from "@/lib/utils";

const SOCKET_LISTENERS = (store: MiddlewareAPI) => ({
  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => {
    console.log("📢 Chat created:", data);
    store.dispatch(chatCreatedReducer(data.data));
  },

  [SocketEvents.MESSAGE_RECEIVED]: (data: TMessageReceivedEventReceived) => {
    console.log("📨 Message received:", data);
    // store.dispatch(messageReceivedReducer(data));
  },

  [SocketEvents.MESSAGE_SENT]: (data: TMessageReceivedEventReceived) => {
    console.log("✅ Message sent:", data);
  },

  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => {
    showToast("Join room error", data.message, "error");
  },

  [SocketEvents.JOIN_ROOM_SUCCESS]: (data: IJoinRoomSuccess) => {
    showToast("Join room success", data.message, "success");
  },

  // Add more events here...
});

function registerSocketListeners(store: MiddlewareAPI, socket: Socket) {
  if (!socket) return;

  const listeners = SOCKET_LISTENERS(store);

  Object.entries(listeners).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

export { registerSocketListeners };
