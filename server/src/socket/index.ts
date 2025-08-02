import mongoose from "mongoose";
import type { Server, Socket } from "socket.io";

import { SocketEvents } from "@/constants";
import { generateRedisKeys } from "@/utils";
import { redisConnection } from "@/db/redis";
import { SocketResponse } from "@/utils/apiResponse";
import { messageSocket } from "@/socket/message.socket";
import { socketAuthMiddleware } from "@/socket/auth.socket";

const handleSocketJoinRoom = (socket: Socket) => {
  socket.on(SocketEvents.JOIN_ROOM, ({ chatId }: { chatId: string }) => {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      const data = new SocketResponse(
        "Unable to join room — the provided chat ID is invalid.",
        false,
        null
      );
      socket.emit(SocketEvents.JOIN_ROOM_ERROR, data);
      return;
    } else {
      socket.join(chatId);
      const data = new SocketResponse(
        `Successfully joined the chat room.`,
        true,
        { chatId }
      );
      socket.emit(SocketEvents.JOIN_ROOM_SUCCESS, data);

      redisConnection.set(
        generateRedisKeys.activeRomm(socket.user._id),
        chatId
      );
    }
  });
};

const handleSocketLeaveRoom = (socket: Socket) => {
  socket.on(SocketEvents.LEAVE_ROOM, ({ chatId }) => {
    socket.leave(chatId);
  });
};

export const initializeSocket = (io: Server) => {
  console.log("🚀 Socket server is running.");
  // Attach auth middleware BEFORE any connections
  io.use(socketAuthMiddleware);

  // Handle authenticated connections
  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.user.username} (${socket.id})`);

    // Register event handlers
    messageSocket(io, socket);

    // Optional: send welcome or test event
    socket.emit("welcome", {
      message: `Welcome ${socket.user?.username || "Guest"}!`,
    });

    socket.emit("text", {
      message: "This is a text message",
      id: socket.id,
    });

    handleSocketJoinRoom(socket);

    handleSocketLeaveRoom(socket);

    socket.on(SocketEvents.DISCONNECT, () => {
      socket.disconnect();
      redisConnection.del(`user:${socket.user.id}:online`);
      console.log(
        `⚡ User disconnected: ${socket.user.username} (${socket.id})`
      );
    });
  });
};
