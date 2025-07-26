import { redisConnection } from "@/db/redis";
import { Worker } from "bullmq";

const worker = new Worker(
  "message",
  async (job) => {
    console.log("job :>> ", job);
  },
  {
    connection: redisConnection,
  }
);

export { worker };
