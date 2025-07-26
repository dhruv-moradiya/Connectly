import Redis from "ioredis";

const redisConnection = new Redis({
  username: "default",
  password: "Iry0yTIMgPzbbrhRE1WSFIRyh8k8sj18",
  host: "redis-17755.c273.us-east-1-2.ec2.redns.redis-cloud.com",
  port: 17755,
  maxRetriesPerRequest: null,
});

export { redisConnection };
