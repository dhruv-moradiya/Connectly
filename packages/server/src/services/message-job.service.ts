import ChatRoom from "@/models/chat.model";
import MessageModel from "@/models/message.model";
import { IMessagesaveInDBJobType, IUpdateDeliveryStatusJob } from "@/types/message-queue.type";
import { handleJobError } from "@/utils";
import { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";


class MessageJobService {
  private async saveMessageAsLastMessage(chatId: string, messageId: string) {
    try {
      await ChatRoom.updateOne(
        { _id: chatId },
        { $set: { lastMessage: messageId } }
      );
    } catch (error) {
      handleJobError(
        error,
        "Error saving message as last message:",
        "Failed to update last message"
      );
    }
  }

  async saveMessageInDB(message: IMessagesaveInDBJobType): Promise<void> {
    try {
      await MessageModel.create({
        _id: message._id,
        sender: message.sender,
        chat: message.chatId,
        content: message.content,
        replyTo: message.replyTo ? message.replyTo._id : null,
      });
      await this.saveMessageAsLastMessage(message.chatId, message._id);
      console.log("Message saved successfully!");
    } catch (error: unknown) {
      handleJobError(
        error,
        "Error saving message",
        "Failed to save message in DB"
      );
    }
  }

  async updateDeliveryStatus({_id, status}:IUpdateDeliveryStatusJob["data"]) {
    try {
      await MessageModel.updateOne(
        { _id: _id },
        { $set: { deliveryStatus: status } }
      );
    } catch (error) {
      handleJobError(
        error,
        "Error updatating delivery status",
        "Failed to update delivery status"
      );
    }
  }
}

const messageJobServiceInstance = new MessageJobService();
export { MessageJobService, messageJobServiceInstance };
