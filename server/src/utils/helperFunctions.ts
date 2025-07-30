import ChatRoom from "@/models/chat.model";
import mongoose from "mongoose";

const getRoomParticipants = async (roomId: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(roomId);

  if (!isValid) {
    throw new Error("Invalid Room ID");
  }

  const chat = await ChatRoom.findById(roomId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  return chat.participants;
};

export { getRoomParticipants };
