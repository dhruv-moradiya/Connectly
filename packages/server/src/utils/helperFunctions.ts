import { generateRedisKeys } from ".";
import { redisConnection } from "../db/redis";
import type { Socket } from "socket.io";
import { SocketEvents } from "../constants";
import MessageModel from "../models/message.model";
import { messagesQueue } from "../queues/bullmq/messages.queue";
import type { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";
import ChatRoom from "../models/chat.model";
import { IMessageSentBody } from "@/types/type";

interface IMessagesaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  deliveryStatus: TMessageDeliveryStatus;
  seenBy: {
    _id: string;
    date: Date;
  }[];
}

async function isGroupChat(chatId: string): Promise<boolean> {
  const isGroup = await redisConnection.hget(
    generateRedisKeys.roomDetails(chatId),
    "isGroup"
  );
  return isGroup === "true";
}

async function getPrivateReceiverId(
  chatId: string,
  senderId: string
): Promise<string | null> {
  const participants = await redisConnection.hgetall(
    generateRedisKeys.roomParticipants(chatId)
  );
  return Object.keys(participants).find((id) => id !== senderId) || null;
}

async function getGroupReceiversIds(
  chatId: string,
  senderId: string
): Promise<string[] | []> {
  const participants = await redisConnection.hgetall(
    generateRedisKeys.roomParticipants(chatId)
  );
  console.log("participants :>> ", participants);
  if (!participants) return [];

  return Object.keys(participants).filter((id) => id !== senderId);
}

async function enqueueMessageStatusUpdate(data: IMessagesaveInDBJobType) {
  await messagesQueue.add("messages", data);
}

async function saveMessageAsLastMessage(chatId: string, messageId: string) {
  try {
    await ChatRoom.updateOne(
      { _id: chatId },
      { $set: { lastMessage: messageId } }
    );
  } catch (error) {
    console.error("Error saving message as last message: ", error);
    throw new Error("Failed to update last message"); // rethrow with cleaner msg
  }
}

async function handlePrivateChat(
  chatId: string,
  message: IMessageSentBody,
  socket: Socket
) {
  const senderId = socket.user._id;

  const receiverId = await getPrivateReceiverId(chatId, senderId);
  if (!receiverId) return;

  const isOnline = await redisConnection.get(
    generateRedisKeys.onlineStatus(receiverId)
  );

  if (isOnline !== "true") {
    console.log("Private: Receiver offline");
    // TODO: Push notification
    return;
  }

  console.log("Private: Receiver online");
  const activeRoom = await redisConnection.get(
    generateRedisKeys.activeRomm(receiverId)
  );

  const deliveryStatus = activeRoom === chatId ? "seen" : "delivered";
  const event =
    deliveryStatus === "seen"
      ? SocketEvents.MESSAGE_SEEN
      : SocketEvents.MESSAGE_DELIVERED;

  socket.emit(event, { _id: message._id });

  await enqueueMessageStatusUpdate({
    _id: message._id,
    sender: senderId,
    chatId,
    content: message.content,
    deliveryStatus,
    seenBy: [{ _id: receiverId, date: new Date() }],
  });
}

async function handleGroupChat(
  chatId: string,
  message: IMessageSentBody,
  socket: Socket
) {
  const senderId = socket.user._id;
  const receiverIds = await getGroupReceiversIds(chatId, senderId);
  console.log("receiverIds :>> ", receiverIds);
  if (receiverIds.length === 0) return;

  const messageSeenUsers: {
    _id: string;
    date: Date;
  }[] = [];

  for (const id of receiverIds) {
    const isOnline = await redisConnection.get(
      generateRedisKeys.onlineStatus(id)
    );

    if (isOnline !== "true") {
      console.log("Group: Receiver offline");
    } else {
      const activeRoom = await redisConnection.get(
        generateRedisKeys.activeRomm(id)
      );

      console.log("activeRoom :>> ", activeRoom);
      console.log("Receiver ID :>> ", id);

      if (activeRoom === chatId) {
        const deliveryStatus = activeRoom === chatId ? "seen" : "delivered";
        const event =
          deliveryStatus === "seen"
            ? SocketEvents.MESSAGE_SEEN
            : SocketEvents.MESSAGE_DELIVERED;

        const key = generateRedisKeys.user(id);
        console.log("key :>> ", key);

        const receiverDetails = await redisConnection.hgetall(
          generateRedisKeys.user(id)
        );

        console.log("receiverDetails :>> ", receiverDetails);
        console.log("typeof receiverDetails :>> ", typeof receiverDetails);

        if (!receiverDetails) return;

        messageSeenUsers.push({
          _id: id,
          date: new Date(),
        });

        socket.emit(SocketEvents.MESSAGE_SEEN_BY, {
          _id: id,
          avatar: receiverDetails.avatar,
          email: receiverDetails.email,
          username: receiverDetails.username,
        });
      } else {
        console.log("Group: Receiver is in another room");
        // TODO: push notification
      }
    }
  }

  if (messageSeenUsers.length) {
    // TODO: Update in DB 'seenBy' flag.
    console.log("Update in DB 'seenBy' flag.");
  }
}

async function updateDeliveryStatus(
  messageId: string,
  status: "delivered" | "seen"
) {
  await MessageModel.updateOne(
    { _id: messageId },
    { $set: { deliveryStatus: status } }
  );
}

export {
  isGroupChat,
  handlePrivateChat,
  handleGroupChat,
  updateDeliveryStatus,
  saveMessageAsLastMessage,
};
