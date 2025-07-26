import { SocketEvents } from "@/constants";
import ChatRoom from "@/models/chat.model";
import MessageModel from "@/models/message.model";
import { messageSentSchema } from "@/schemas/socket.schema";
import { validateSocketData } from "@/utils/validateRequest";
import type { Server, Socket } from "socket.io";

interface IMessageSent {
  chatId: string;
  text: string;
}

const messageSocket = (io: Server, socket: Socket) => {
  socket.on(SocketEvents.MESSAGE_SENT, async (data) => {
    validateSocketData(messageSentSchema, data, socket);

    console.log(data);

    const chat = await ChatRoom.findById(data.chatId);

    if (!chat) {
      socket.emit(SocketEvents.INVALID_DATA, {
        error: {
          chat: "Chat not found",
        },
      });
      return;
    }

    const message = await MessageModel.create({
      sender: socket.user._id,
      room: chat._id,
      content: data.text,
      type: "text",
      deliveryStatus: "sent",
    });

    io.to(String(chat._id)).emit(SocketEvents.MESSAGE_SENT, {
      message: message,
    });

    socket.emit(SocketEvents.MESSAGE_SENT, {
      message: message,
    });
  });
};

export { messageSocket };
