import { Socket, type Server } from "socket.io";
import { SocketEvents } from "@/constants";
import { messagesQueue } from "@/queues/bullmq/messages.queue";
import {
  messageSentSchema,
  type IMessageentBody,
} from "@/schemas/socket.schema";
import { validateSocketData } from "@/utils/validateRequest";
import { redisConnection } from "@/db/redis";
import { generateRedisKeys } from "@/utils";

// Utility: Execute async function safely with error handling
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

// Emit error to socket
function emitSocketError(socket: Socket, message: string) {
  console.error(message);
  socket.emit("socket_error", { message });
}

// Notify all participants in the chat room
async function notifyParticipants(
  chatId: string,
  message: IMessageentBody,
  socket: Socket
) {
  socket.to(chatId).emit(SocketEvents.MESSAGE_RECEIVED, {
    ...message,
    sender: {
      _id: socket.user._id,
      username: socket.user.username,
      avatar: socket.user.avatar,
    },
  });

  const isGroupChat = await redisConnection.hget(
    generateRedisKeys.roomDetails(chatId),
    "isGroup"
  );

  const currentUserId = socket.user._id;

  if (isGroupChat === "false") {
    const getParticipanrs = await redisConnection.hgetall(
      generateRedisKeys.roomParticipants(chatId)
    );
    const otherUserIds = Object.keys(getParticipanrs).filter(
      (id) => id !== currentUserId
    )[0];

    const isReceiverOnline = await redisConnection.get(
      generateRedisKeys.onlineStatus(otherUserIds)
    );

    console.log("isReceiverOnline :>> ", isReceiverOnline);
    console.log("isReceiverOnline :>> ", typeof isReceiverOnline);

    if (isReceiverOnline === "true") {
      console.log("Receiver is online");
      const isReceiverInSameRoom = await redisConnection.get(
        generateRedisKeys.activeRomm(otherUserIds)
      );
      console.log("chatId :>> ", chatId);
      console.log("isReceiverInSameRoom :>> ", isReceiverInSameRoom);
      if (isReceiverInSameRoom === chatId) {
        console.log("Receiver is in same room");
        socket.emit(SocketEvents.MESSAGE_SEEN, {
          _id: message._id,
        });
      }
    } else {
      console.log("Receiver is offline");
      // Send notification
    }
  }
}

// Main handler
async function handleMessageSent(socket: Socket, data: IMessageentBody) {
  if (!validateSocketData(messageSentSchema, data, socket)) return;

  // Queue message for processing
  await safeExec(
    () => messagesQueue.add("messages", { ...data, sender: socket.user._id }),
    socket,
    "Error queuing message"
  );
  // To Current User Messgae sent successfully
  socket.emit(SocketEvents.MESSAGE_SENT, data);

  await notifyParticipants(data.chatId, data, socket);
}

// Socket registration
const messageSocket = (io: Server, socket: Socket) => {
  socket.on(SocketEvents.MESSAGE_SENT, (data: IMessageentBody) => {
    handleMessageSent(socket, data).catch((err) => {
      emitSocketError(socket, `Unexpected error: ${err.message}`);
    });
  });
};

export { messageSocket };
