import { redisConnection } from "@/db/redis";
import { Queue } from "bullmq";

const messageQueue = new Queue("message", {
  connection: redisConnection,
});

export { messageQueue };
