import { Socket } from "socket.io";
import { SocketEvents } from "../constants";
import { messagesQueue } from "../queues/bullmq/messages.queue";
import {
  messageSentSchema,
  type IMessageentBody,
} from "../schemas/socket.schema";
import { validateSocketData } from "../utils/validateRequest";
import {
  handleGroupChat,
  handlePrivateChat,
  isGroupChat,
} from "../utils/helperFunctions";

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
  const { _id: senderId, username, avatar } = socket.user;

  // Emit message to room (excluding sender)
  socket.to(chatId).emit(SocketEvents.MESSAGE_RECEIVED, {
    ...message,
    sender: { _id: senderId, username, avatar },
  });

  const isGroup = await isGroupChat(chatId);
  if (isGroup) {
    await handleGroupChat();
  } else {
    await handlePrivateChat(chatId, message, socket);
  }
}

// Main handler
async function handleMessageSent(socket: Socket, data: IMessageentBody) {
  if (!validateSocketData(messageSentSchema, data, socket)) return;

  // Queue message for processing
  await safeExec(
    () =>
      messagesQueue.add("messages", {
        ...data,
        sender: socket.user._id,
        deliveryStatus: "sent",
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
  socket.on(SocketEvents.MESSAGE_SENT, (data: IMessageentBody) => {
    handleMessageSent(socket, data).catch((err) => {
      emitSocketError(socket, `Unexpected error: ${err.message}`);
    });
  });
};

export { messageSocket };
