import { Socket, type Server } from "socket.io";

import { SocketEvents } from "@/constants";

import { redisConnection } from "@/db/redis";
import { messagesQueue } from "@/queues/bullmq/messages.queue";

import {
  messageSentSchema,
  type IMessageentBody,
} from "@/schemas/socket.schema";

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

// * Notify all participants in the chat room
async function notifyParticipants(
  chatId: string,
  message: IMessageentBody,
  socket: Socket
) {
  const participants = await safeExec(
    () => getRoomParticipants(chatId),
    socket,
    "Error fetching room participants"
  );
  if (!participants?.length) return;

  socket.to(chatId).emit(SocketEvents.MESSAGE_RECEIVED, {
    ...message,
    sender: {
      _id: socket.user._id,
      username: socket.user.username,
      avatar: socket.user.avatar,
    },
  });
}

// * Main handler
async function handleMessageSent(
  io: Server,
  socket: Socket,
  data: IMessageentBody
) {
  if (!validateSocketData(messageSentSchema, data, socket)) return;

  // * Queue message for processing
  await safeExec(
    () => messagesQueue.add("messages", { ...data, sender: socket.user._id }),
    socket,
    "Error queuing message"
  );

  await notifyParticipants(data.chatId, data, socket);

  // To Current User Messgae sent
  socket.emit(SocketEvents.MESSAGE_SENT, data);
}

// * Socket registration
const messageSocket = (io: Server, socket: Socket) => {
  socket.on(SocketEvents.MESSAGE_SENT, (data: IMessageentBody) => {
    handleMessageSent(io, socket, data).catch((err) => {
      emitSocketError(socket, `Unexpected error: ${err.message}`);
    });
  });
};

export { messageSocket };
