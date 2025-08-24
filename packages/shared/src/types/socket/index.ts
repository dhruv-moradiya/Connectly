interface IMessageSentBody {
  _id: string;
  chatId: string;
  content: string;
  replyTo?: string | undefined;
  createdAt: Date;
  attachments?: {
    type: "image" | "video" | "file" | "audio" | "other";
    buffer: string;
    name: string;
  }[];
}

export { type IMessageSentBody };
