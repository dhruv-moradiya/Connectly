import { Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import MessageModel from "../../models/message.model";
import type { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";
import { updateDeliveryStatus } from "../../utils/helperFunctions";

interface IMessagesaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  deliveryStatus: TMessageDeliveryStatus;
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
    }: IMessagesaveInDBJobType = job.data;

    switch (deliveryStatus) {
      case "sent":
        await MessageModel.create({
          _id,
          sender,
          chat: chatId,
          content,
        });
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
