import { TMessageJobType } from "../../types/message-queue.type";
import { redisConnection } from "../../db/redis";
import { Queue } from "bullmq";

const messagesQueue = new Queue<TMessageJobType["data"]>("messages", { connection: redisConnection });


export { messagesQueue };
