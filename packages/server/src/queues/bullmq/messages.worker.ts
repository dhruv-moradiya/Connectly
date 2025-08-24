import { Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import MessageModel from "../../models/message.model";
import type { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";
import {
  saveMessageAsLastMessage,
  updateDeliveryStatus,
} from "../../utils/helperFunctions";

interface IMessagesaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  deliveryStatus: TMessageDeliveryStatus;
  replyTo: { _id: string; content: string } | null;
}

const messagesWorker = new Worker(
  "messages",
  async (job) => {
    const {
      _id,
      sender,
      chatId,
      content,
      deliveryStatus,
      replyTo,
    }: IMessagesaveInDBJobType = job.data;

    switch (deliveryStatus) {
      case "sent":
        await MessageModel.create({
          _id,
          sender,
          chat: chatId,
          content,
          ...(replyTo && { replyTo: replyTo._id }),
        });
        await saveMessageAsLastMessage(chatId, _id);

        break;

      case "delivered":
      case "seen":
        await updateDeliveryStatus(_id, deliveryStatus);
        break;

      default:
        console.warn(`Unknown delivery status: ${deliveryStatus}`);
    }
  },
  { connection: redisConnection }
);

export { messagesWorker };
