import { ActionType, SocketEvents } from "@/lib/constants";
import type { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import type { RootState } from "../index";
import type { IUserPreview } from "@/types/api-response.type";
import { chatCreatedReducer } from "../chats/user-chats-slice";

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

type TChatCreatedAction = {
  data: {
    _id: string;
    name: string;
    isGroup: boolean;
    participants: IUserPreview[];
    unreadCount: [];
  };
  message: string;
};

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const state: RootState = store.getState();
  const token = state.auth.user?.accessToken;

  if (action && typeof action === "object" && "type" in action) {
    switch (action.type) {
      case ActionType.CREATE_CONNECTION:
        if (!socket && token) {
          initializeSocket(token);

          socket!.on(SocketEvents.CHAT_CREATED, (data: TChatCreatedAction) => {
            console.log("📢 Chat created event received.", data);
            store.dispatch(chatCreatedReducer(data.data));
          });
        } else {
          console.warn("⚠️ Socket already exists or token is missing.");
        }
        break;

      default:
        break;
    }
  }

  return next(action);
};

export { socketMiddleware, socket };
