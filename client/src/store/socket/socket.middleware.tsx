import { ActionType, SocketEvents } from "@/lib/constants";
import type { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import type { RootState } from "../index";

import { registerSocketListeners } from "./socket-listeners";

let socket: Socket | null = null;

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

          registerSocketListeners(store, socket as unknown as Socket);
        } else {
          console.warn("⚠️ Socket already exists or token is missing.");
        }
        break;

      case ActionType.SEND_MESSAGE: {
        const data = {
          chatId: state.activeChat.chatId,
          content: action.payload.content,
          _id: action.payload._id,
        };

        socket!.emit(SocketEvents.MESSAGE_SENT, data);
        break;
      }

      case ActionType.SET_ACTIVE_CHAT:
        socket!.emit(SocketEvents.JOIN_ROOM, {
          chatId: action.payload,
        });
        break;

      case ActionType.CLEAR_ACTIVE_CHAT:
        socket!.emit(SocketEvents.LEAVE_ROOM, {
          chatId: action.payload,
        });
        break;

      default:
        break;
    }
  }

  return next(action);
};

export { socketMiddleware, socket };
