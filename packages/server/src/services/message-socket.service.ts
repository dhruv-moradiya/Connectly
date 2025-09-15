import mongoose from "mongoose";
import MessageModel from "../models/message.model";

import { Socket } from "socket.io";
import { redisConnection } from "../db/redis";
import { IMessageSentBody } from "../types/type";
import { SocketEvents } from "../constants/index";
import { generateRedisKeys, handleError } from "../utils/index";
import { JobQueueService } from "../services/job-queue-service";

// ---------- Helpers (Low-level Redis/Data utilities) ----------
class ParticipantService {
  static async getPrivateReceiverId(
    chatId: string,
    senderId: string
  ): Promise<string | null> {
    try {
      const participants = await redisConnection.hgetall(
        generateRedisKeys.roomParticipants(chatId)
      );
      return Object.keys(participants).find((id) => id !== senderId) || null;
    } catch (error) {
      handleError(error, `Fetching private receiver for chatId=${chatId}`);
    }
  }

  static async getGroupReceiverIds(
    chatId: string,
    senderId: string
  ): Promise<string[]> {
    try {
      const participants = await redisConnection.hgetall(
        generateRedisKeys.roomParticipants(chatId)
      );

      if (!participants) return [];

      return Object.keys(participants).filter((id) => id !== senderId);
    } catch (error) {
      handleError(error, `Fetching group receivers for chatId=${chatId}`);
    }
  }
}

class UserStatusService {
  static async isOnline(userId: string): Promise<boolean> {
    try {
      const value = await redisConnection.get(
        generateRedisKeys.onlineStatus(userId)
      );
      return value === "true";
    } catch (error) {
      handleError(error, `Checking online status for userId=${userId}`);
    }
  }

  static async getActiveRoom(userId: string): Promise<string> {
    try {
      const activeRoom = await redisConnection.get(
        generateRedisKeys.activeRomm(userId)
      );
      return activeRoom ?? "";
    } catch (error) {
      handleError(error, `Fetching active room for userId=${userId}`);
    }
  }

  static async getUserDetails(userId: string) {
    return redisConnection.hgetall(generateRedisKeys.user(userId));
  }
}

// ---------- Private Chat Handler ----------
class PrivateChatHandler {
  static async handle(
    chatId: string,
    message: IMessageSentBody,
    socket: Socket
  ) {
    const senderId = socket.user._id;
    const receiverId = await ParticipantService.getPrivateReceiverId(
      chatId,
      senderId
    );
    if (!receiverId) return;

    const isOnline = await UserStatusService.isOnline(receiverId);
    if (!isOnline) {
      console.log("Private: Receiver offline");
    }

    const activeRoom = await UserStatusService.getActiveRoom(receiverId);
    if (activeRoom !== chatId) {
      console.log("Private: Receiver is in other room");
    }

    const deliveryStatus = activeRoom === chatId ? "seen" : "delivered";
    const event =
      deliveryStatus === "seen"
        ? SocketEvents.MESSAGE_SEEN
        : SocketEvents.MESSAGE_DELIVERED;

    socket.emit(event, { _id: message._id });

    await JobQueueService.enqueueMessageStatusUpdate({
      _id: message._id,
      status: deliveryStatus,
    });
  }
}

// ---------- Group Chat Handler ----------
class GroupChatHandler {
  static async handle(
    chatId: string,
    message: IMessageSentBody,
    socket: Socket
  ) {
    const senderId = socket.user._id;
    const receiverIds = await ParticipantService.getGroupReceiverIds(
      chatId,
      senderId
    );
    console.log("receiverIds :>> ", receiverIds);
    if (receiverIds.length === 0) return;

    const messageSeenUsers: {
      _id: string;
      messageId: string;
      seenAt: Date;
      avatar: string;
      username: string;
      email: string;
    }[] = [];

    for (const id of receiverIds) {
      const isOnline = await UserStatusService.isOnline(id);
      if (!isOnline) {
        console.log("Group: Receiver offline");
        continue;
      }

      const activeRoom = await UserStatusService.getActiveRoom(id);
      if (activeRoom === chatId) {
        const receiverDetails = await UserStatusService.getUserDetails(id);
        if (!receiverDetails) continue;

        messageSeenUsers.push({
          _id: id,
          messageId: message._id,
          seenAt: new Date(),
          avatar: receiverDetails.avatar,
          email: receiverDetails.email,
          username: receiverDetails.username,
        });
      } else {
        console.log("Group: Receiver is in another room");
        // TODO: Push notification + increase unread count
      }
    }

    if (messageSeenUsers.length) {
      socket.emit(SocketEvents.MESSAGE_SEEN_BY, messageSeenUsers);

      try {
        try {
          console.log("messageSeenUsers :>> ", messageSeenUsers);
          console.log(messageSeenUsers.map((u) => u._id));

          await MessageModel.updateOne(
            { _id: message._id },
            {
              $addToSet: {
                seenBy: {
                  $each: messageSeenUsers.map((user) => ({
                    user: user._id, // ✅ keep as string
                    seenAt: new Date(),
                  })),
                },
              },
            }
          );
        } catch (error) {
          console.log("Error while updating seenBy:", error);
        }
      } catch (error) {
        console.log("Error :????", error);
      }

      console.log("Updated DB 'seenBy' flag.");
    }
  }
}

// ---------- Facade Service ----------
class MessageSocketService {
  async handlePrivateChatSocket(
    chatId: string,
    message: IMessageSentBody,
    socket: Socket
  ) {
    return PrivateChatHandler.handle(chatId, message, socket);
  }

  async handleGroupChatSocket(
    chatId: string,
    message: IMessageSentBody,
    socket: Socket
  ) {
    return GroupChatHandler.handle(chatId, message, socket);
  }
}

const messageSocketServiceInstace = new MessageSocketService();

export { messageSocketServiceInstace, MessageSocketService };
