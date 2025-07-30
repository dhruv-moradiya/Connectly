import { ActionType, SocketEvents } from "@/lib/constants";
import type { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import type { RootState } from "../index";
import { chatCreatedReducer } from "../chats/user-chats-slice";
import type {
  TChatCreatedEventReceived,
  TMessageReceivedEventReceived,
} from "@/types/middleware.type";

let socket: Socket | null = null;

/**
 * Initializes the socket connection with auth token.
 */
const initializeSocket = (token: string) => {
  if (socket) {
    console.warn("Socket already initialized.");
    return;
  }

  const socketServerUri = import.meta.env.VITE_APP_SOCKET_SERVER_URL;
  if (!socketServerUri) {
    throw new Error("VITE_APP_SOCKET_SERVER_URL is not defined.");
  }

  console.log("🔌 Connecting to socket server...");
  socket = io(socketServerUri, {
    withCredentials: true,
    autoConnect: true,
    auth: { token },
  });

  socket.on("welcome", (data) => {
    console.log("✅ Socket connected:", data);
  });
};

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const state: RootState = store.getState();
  const token = state.auth.user?.accessToken;

  if (
    action &&
    typeof action === "object" &&
    "type" in action &&
    "payload" in action
  ) {
    switch (action.type) {
      case ActionType.CREATE_CONNECTION:
        if (!socket && token) {
          initializeSocket(token);

          socket!.on(
            SocketEvents.CHAT_CREATED,
            (data: TChatCreatedEventReceived) => {
              console.log("📢 Chat created event received.", data);
              store.dispatch(chatCreatedReducer(data.data));
            }
          );

          socket!.on(
            SocketEvents.MESSAGE_RECEIVED,
            (data: TMessageReceivedEventReceived) => {
              console.log("📢 Message received event received.", data);
            }
          );
        } else {
          console.warn("⚠️ Socket already exists or token is missing.");
        }
        break;

      case ActionType.SEND_MESSAGE:
        socket!.emit(SocketEvents.MESSAGE_SENT, action.payload);

        break;

      default:
        break;
    }
  }

  return next(action);
};

export { socketMiddleware, socket };
