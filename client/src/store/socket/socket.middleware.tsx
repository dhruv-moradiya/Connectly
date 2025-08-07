// src/socket/socket.middleware.ts
import type { Middleware } from "@reduxjs/toolkit";
import { ActionType, SocketEvents } from "@/lib/constants";
import { io } from "socket.io-client";

import { emitToServer, registerSocketListeners } from "./socket-listeners";
import type { SocketAction, TypedSocket } from "@/types/middleware.type";

let socket: TypedSocket | null = null;

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

function isSocketAction(action: unknown): action is SocketAction {
  return action !== null && typeof action === "object" && "type" in action;
}

export const socketMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const state = store.getState() as ReturnType<typeof store.getState>;
    const token = state.auth.user?.accessToken;

    if (isSocketAction(action)) {
      switch (action.type) {
        case ActionType.CREATE_CONNECTION: {
          if (!state.socket.isConnected && token) {
            initializeSocket(token);
            registerSocketListeners(store, socket as TypedSocket);
          }
          break;
        }

        case ActionType.SEND_MESSAGE: {
          if (socket) {
            emitToServer(socket, SocketEvents.MESSAGE_SENT, {
              chatId: state.activeChat.chatId,
              content: action.payload.content,
              _id: action.payload._id,
            });
          }
          break;
        }

        case ActionType.SET_ACTIVE_CHAT: {
          if (socket) {
            emitToServer(socket, SocketEvents.JOIN_ROOM, {
              chatId: action.payload,
            });
          }
          break;
        }

        case ActionType.CLEAR_ACTIVE_CHAT: {
          if (socket) {
            emitToServer(socket, SocketEvents.LEAVE_ROOM, {
              chatId: state.activeChat.chatId,
            });
          }
          break;
        }

        case ActionType.DISCONNET_CONNECTION: {
          if (state.socket.isConnected) {
            socket?.disconnect();
            socket = null;
          }
          break;
        }
      }
    }

    return next(action);
  };
