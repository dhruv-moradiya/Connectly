import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { httpServer } from "./app";
import connectDB from "./db";
import { getAllUserData } from "./controllers/user.controller";
import { getRoomDetails } from "./controllers/chat.controller";
import { redisConnection } from "./db/redis";
import { generateRedisKeys } from "./utils";
import type { IUserPreiveForCache } from "@shared/types/user.types";
import type { IChatRoomForCache } from "@shared/types/chat.types";

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
        participant.user.toString(), // Use user ID as field
        JSON.stringify({ role: participant.role }) // Store role as JSON
      );
    }
  }
}

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;

    httpServer.listen(PORT, async () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);

      const users = await getAllUserData();
      const rooms = await getRoomDetails();

      if (users) await cacheUsers(users);
      if (rooms) await cacheRooms(rooms as unknown as IChatRoomForCache[]);

      console.log("✅ Redis cache initialized with user and room data.");
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
