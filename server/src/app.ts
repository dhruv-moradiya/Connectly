import http from "http";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config({
  path: ".env",
});

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import messageRoute from "./routes/message.route";
import { ApiError } from "./utils/ApiError";
import { initializeSocket } from "./socket";
import { messageQueue } from "./queues/message.queue";
import { redisConnection } from "./db/redis";
import { worker } from "./queues/worker";
import { Queue } from "bullmq";

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRoute);
app.set("messageWorker", worker);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log("🚀 Socket server is running.");
initializeSocket(io);

// It will auto-connect internally on first command
redisConnection.on("connect", () => {
  console.log("Redis connected successfully");
});

redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const resetQueue = async () => {
  const queue = new Queue("message", { connection: redisConnection });
  await queue.drain(true); // removes all jobs
  await queue.obliterate({ force: true }); // wipes all data
  console.log("🧹 Queue reset");
};

await resetQueue();

// setTimeout(async () => {
//   await messageQueue.add("message", {
//     id: "123",
//     roomId: "123",
//     content: "hello world",
//     timestamp: Date.now(),
//   });
//   console.log("🚀 Job added");
// }, 4000);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  console.error("Global Error:", {
    message: (error as Error).message,
    stack: (error as Error).stack,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    ...(process.env.NODE_ENV !== "production" &&
      {
        // stack: (error as Error).stack,
      }),
  });
});

export { app, httpServer };
