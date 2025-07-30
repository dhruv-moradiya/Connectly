import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const redisConnection = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST_URL,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  maxRetriesPerRequest: null,
});

export { redisConnection };
