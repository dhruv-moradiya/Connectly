import { Socket } from "socket.io";
import { SocketEvents } from "../constants";
import { messagesQueue } from "../queues/bullmq/messages.queue";
import { messageSentSchema } from "../schemas/socket.schema";
import { validateSocketData } from "../utils/validateRequest";
import {
  handleGroupChat,
  handlePrivateChat,
  isGroupChat,
} from "../utils/helperFunctions";
import { IMessageSentBody } from "@/types/type";
import { MessageJobEnum } from "@/types/message-queue.type";

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
  message: IMessageSentBody,
  socket: Socket
) {
  const { _id: senderId, username, avatar } = socket.user;

  // Emit message to room (excluding sender)
  socket.to(chatId).emit(SocketEvents.MESSAGE_RECEIVED, {
    ...message,
    sender: { _id: senderId, username, avatar },
  });

  const isGroup = await isGroupChat(chatId);
  if (isGroup) {
    await handleGroupChat(chatId, message, socket);
  } else {
    await handlePrivateChat(chatId, message, socket);
  }
}

// Main handler
async function handleMessageSent(socket: Socket, data: IMessageSentBody) {
  if (!validateSocketData(messageSentSchema, data, socket)) {
    console.log("Invalid message data:", data);
    return;
  }

  // Queue message for processing
  await safeExec(
    () =>
      messagesQueue.add(MessageJobEnum.SAVE_MESSAGE, {
        _id: data._id,
        chatId: data.chatId,
        content: data.content,
        replyTo: data.replyTo,
        sender: socket.user._id,
      }),
    socket,
    "Error queuing message"
  );
  // To Current User Messgae sent successfully
  socket.emit(SocketEvents.MESSAGE_SENT, data);

  // To update last message
  socket.emit(SocketEvents.LAST_MESSAGE, data);

  await notifyParticipants(data.chatId, data, socket);
}

// Socket registration
const messageSocket = (socket: Socket) => {
  socket.on(SocketEvents.MESSAGE_SENT, (data: IMessageSentBody) => {
    handleMessageSent(socket, { ...data, createdAt: new Date() }).catch(
      (err) => {
        emitSocketError(socket, `Unexpected error: ${err.message}`);
      }
    );
  });
};

export { messageSocket };
