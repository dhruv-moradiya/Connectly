// src/sockets/index.ts
import type { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.middleware";
import { messageSocket } from "./message.socket";

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

    // Debug/test emits
    io.emit("test_message", {
      message: "Test broadcast",
      id: socket.id,
    });
  });
};
