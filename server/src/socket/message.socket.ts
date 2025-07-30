import { Socket, type Server } from "socket.io";

import { SocketEvents } from "@/constants";

import { redisConnection } from "@/db/redis";
import { messagesQueue } from "@/queues/bullmq/messages.queue";

import {
  messageSentSchema,
  type IMessageSentBody,
} from "@/schemas/socket.schema";

import { generateRedisKeys } from "@/utils";
import { getRoomParticipants } from "@/utils/helperFunctions";
import { validateSocketData } from "@/utils/validateRequest";

// * Utility: Execute async function safely with error handling
async function safeExec<T>(
  fn: () => Promise<T>,
  socket: Socket,
  errorMessage: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    emitSocketError(socket, `${errorMessage}: ${err}`);
    return null;
  }
}

// * Emit error to socket
function emitSocketError(socket: Socket, message: string) {
  console.error(message);
  socket.emit("socket_error", { message });
}

// // * Cache message to Redis
// const cacheMessage = (chatId: string, message: IMessageSentBody) => {
//   const redisKey = generateRedisKeys.roomMessages(chatId);
//   return redisConnection.lpush(redisKey, JSON.stringify(message));
// };

// * Notify all participants in the chat room
async function notifyParticipants(
  io: Server,
  chatId: string,
  message: IMessageSentBody,
  socket: Socket
) {
  const participants = await safeExec(
    () => getRoomParticipants(chatId),
    socket,
    "Error fetching room participants"
  );
  if (!participants?.length) return;

  const ids = participants.map((p) => p.user.toString());
  io.to(ids).emit(SocketEvents.MESSAGE_RECEIVED, message);
}

// * Main handler
async function handleMessageSent(
  io: Server,
  socket: Socket,
  data: IMessageSentBody
) {
  if (!validateSocketData(messageSentSchema, data, socket)) return;

  // * Queue message for processing
  await safeExec(
    () => messagesQueue.add("messages", { ...data, sender: socket.user._id }),
    socket,
    "Error queuing message"
  );

  await notifyParticipants(io, data.chatId, data, socket);
}

// * Socket registration
const messageSocket = (io: Server, socket: Socket) => {
  socket.on(SocketEvents.MESSAGE_SENT, (data: IMessageSentBody) => {
    handleMessageSent(io, socket, data).catch((err) => {
      emitSocketError(socket, `Unexpected error: ${err.message}`);
    });
  });
};

export { messageSocket };
