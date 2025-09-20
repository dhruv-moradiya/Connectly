// Import core modules and third-party libraries
import http from "http";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import { Queue } from "bullmq";
import { Server } from "socket.io";

// Load environment variables from .env file
dotenv.config({
  path: ".env",
});

const environment = process.env.NODE_ENV || "development";

// Initialize Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make Socket.IO instance available in the app
app.set("io", io);

// Middleware setup
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Import custom modules and routers
import { initializeSocket } from "./socket";
import { redisConnection } from "./db/redis";

import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import messageRoute from "./routes/message.route";

import { messagesWorker } from "./queues/bullmq/messages.worker";
import { globalErrorHandler } from "./middlewares/globalError.middleware";
import { IChatRoomForCache } from "@monorepo/shared/src/types/chat.types";
import { generateRedisKeys, logger } from "./utils";
import { IUserPreiveForCache } from "@monorepo/shared/src/types/user.types";
import { getAllUserData } from "./controllers/user.controller";
import { getRoomDetails } from "./controllers/chat.controller";

// Register API routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRoute);

// Listen for job completion and failure events from the messages worker
messagesWorker.on("completed", (job) => {
  logger.info({ job: job.id }, "completed successfully");
});

messagesWorker.on("failed", (job, err) => {
  if (job) {
    logger.error({ job: job.id, err }, "Job failed");
  } else {
    logger.error({ err }, "A job failed");
  }
});

// Initialize Socket.IO event handlers
initializeSocket(io);

// Redis connection event handlers
redisConnection.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisConnection.on("error", (err) => {
  logger.error({ err }, "Redis connection error");
});

async function cacheUsers(users: IUserPreiveForCache[]) {
  for (const user of users) {
    await redisConnection.hset(generateRedisKeys.user(user._id.toString()), {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      bio: user.bio,
    });
  }
}

async function cacheRooms(rooms: IChatRoomForCache[]) {
  for (const room of rooms) {
    const { _id, participants, ...roomDetails } = room;

    // Cache room details (optional)
    await redisConnection.hset(
      generateRedisKeys.roomDetails(_id.toString()),
      roomDetails
    );

    // Cache participants with role
    for (const participant of participants) {
      await redisConnection.hset(
        generateRedisKeys.roomParticipants(_id.toString()),
        participant.user.toString(),
        JSON.stringify({ role: participant.role })
      );
    }
  }
}

// Function to reset the BullMQ message queue on server start
const resetQueue = async () => {
  const queue = new Queue("message", { connection: redisConnection });
  await queue.drain(true); // removes all jobs
  await queue.obliterate({ force: true }); // wipes all data
  await redisConnection.flushdb();
  logger.info("Queue reset");
};

// Reset the queue before starting the app
(async () => {
  await resetQueue();
  const users = await getAllUserData();
  const rooms = await getRoomDetails();

  if (users) await cacheUsers(users);
  if (rooms) await cacheRooms(rooms as unknown as IChatRoomForCache[]);
  logger.info("Redis cache initialized with user and room data.");
})();

// Global error handler middleware
app.use(globalErrorHandler);

// Serve static files in production
if (environment === "production") {
  logger.info("Serving static files in production");
  const distPath = path.join(__dirname, "../../client/dist");

  app.use(express.static(distPath));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  logger.info("Serving static files in development");
}

// Export the app and HTTP server for use elsewhere (e.g., server entry point)
export { app, httpServer };
