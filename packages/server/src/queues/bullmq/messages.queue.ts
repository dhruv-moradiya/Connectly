import { redisConnection } from "../../db/redis";
import { Queue } from "bullmq";

const messagesQueue = new Queue("messages", {
  connection: redisConnection,
});

export { messagesQueue };
