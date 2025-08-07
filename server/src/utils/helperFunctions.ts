import type { IMessageentBody } from "@/schemas/socket.schema";
import { generateRedisKeys } from ".";
import { redisConnection } from "@/db/redis";
import type { Socket } from "socket.io";
import { SocketEvents } from "@/constants";
import MessageModel from "@/models/message.model";
import { messagesQueue } from "@/queues/bullmq/messages.queue";
import type { TMessageDeliveryStatus } from "@shared/types/message.types";

interface IMessagesaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  deliveryStatus: TMessageDeliveryStatus;
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

async function enqueueMessageStatusUpdate(data: IMessagesaveInDBJobType) {
  await messagesQueue.add("messages", data);
}

async function handlePrivateChat(
  chatId: string,
  message: IMessageentBody,
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
  });
}

async function handleGroupChat() {}

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
};
