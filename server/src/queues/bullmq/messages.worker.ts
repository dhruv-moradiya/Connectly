import { Worker } from "bullmq";
import { redisConnection } from "@/db/redis";
import MessageModel from "@/models/message.model";

interface IMessageaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
}

const messagesWorker = new Worker(
  "messages",
  async (job) => {
    const data: IMessageaveInDBJobType = job.data;
    const messageData = {
      _id: data._id,
      sender: data.sender,
      chat: data.chatId,
      content: data.content,
    };

    await MessageModel.create(messageData);
  },
  { connection: redisConnection }
);

export { messagesWorker };
