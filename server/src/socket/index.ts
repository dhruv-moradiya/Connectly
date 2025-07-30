import type { Server } from "socket.io";

import { messageSocket } from "@/socket/message.socket";
import { socketAuthMiddleware } from "@/socket/auth.socket";
import { SocketEvents } from "@/constants";
import { redisConnection } from "@/db/redis";

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

    socket.on(SocketEvents.DISCONNECT, () => {
      socket.disconnect();
      redisConnection.del(`user:${socket.user.id}:online`);
      console.log(
        `⚡ User disconnected: ${socket.user.username} (${socket.id})`
      );
    });

    // Debug/test emits
    io.emit("test_message", {
      message: "Test broadcast",
      id: socket.id,
    });
  });
};
