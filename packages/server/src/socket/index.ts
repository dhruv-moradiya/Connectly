import mongoose from "mongoose";
import type { Server, Socket } from "socket.io";

import { SocketEvents } from "../constants";
import { generateRedisKeys } from "../utils";
import { redisConnection } from "../db/redis";
import { SocketResponse } from "../utils/apiResponse";
import { messageSocket } from "../socket/message.socket";
import { socketAuthMiddleware } from "../socket/auth.socket";
import MessageModel from "../models/message.model";

const updateMessageStatus = (chatId: string, userId: string) => {
  return MessageModel.updateMany(
    {
      chat: chatId,
      $or: [{ deliveryStatus: "pending" }, { deliveryStatus: "sent" }],
      "seenBy.user": { $ne: userId },
      sender: { $ne: userId },
    },
    {
      $set: { deliveryStatus: "seen" },
      $addToSet: { seenBy: { user: userId, seen_at: new Date() } },
    }
  );
};

const handleSocketJoinRoom = (socket: Socket) => {
  socket.on(SocketEvents.JOIN_ROOM, async ({ chatId }: { chatId: string }) => {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      socket.emit(
        SocketEvents.JOIN_ROOM_ERROR,
        new SocketResponse("Invalid chat ID", false, null)
      );
      return;
    }

    // Already joined? skip
    if (socket.rooms.has(chatId)) {
      return;
    }

    socket.join(chatId);

    socket.emit(
      SocketEvents.JOIN_ROOM_SUCCESS,
      new SocketResponse("Joined room successfully", true, { chatId })
    );

    // Track active rooms in Redis (Set instead of single value)
    await redisConnection.set(
      generateRedisKeys.activeRomm(socket.user._id),
      chatId
    );

    // Update messages
    try {
      await updateMessageStatus(chatId, socket.user._id);
    } catch (err) {
      console.error("Message update failed:", err);
    }
  });
};

const handleSocketLeaveRoom = (socket: Socket) => {
  socket.on(SocketEvents.LEAVE_ROOM, ({ chatId }) => {
    socket.leave(chatId);
    redisConnection.del(generateRedisKeys.activeRomm(socket.user._id));
  });
};

export const initializeSocket = (io: Server) => {
  console.log("🚀 Socket server is running.");
  // Attach auth middleware BEFORE any connections
  io.use(socketAuthMiddleware);

  // Handle authenticated connections
  io.on(SocketEvents.CONNECTION, (socket) => {
    console.log(`⚡ User connected: ${socket.user.username} (${socket.id})`);

    // Register event handlers
    messageSocket(socket);

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
      redisConnection.del(generateRedisKeys.onlineStatus(socket.user._id));
      redisConnection.del(generateRedisKeys.activeRomm(socket.user._id));
      console.log(
        `⚡ User disconnected: ${socket.user.username} (${socket.id})`
      );
    });
  });
};
