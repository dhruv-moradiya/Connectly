import { Worker } from "bullmq";
import { redisConnection } from "@/db/redis";
import MessageModel from "@/models/message.model";

interface IMessageSaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
}

const messagesWorker = new Worker(
  "messages",
  async (job) => {
    const data: IMessageSaveInDBJobType = job.data;
    const messageData = {
      _id: data._id,
      sender: data.sender,
      chat: data.chatId,
      content: data.content,
    };

    // const message = await MessageModel.create(messageData);
    // console.log("message :>> ", message);

    // console.log("messageData :>> ", messageData);
  },
  { connection: redisConnection }
);

export { messagesWorker };
