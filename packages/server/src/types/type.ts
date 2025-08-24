interface IReplyMessage {
  _id: string;
  content: string;
}

interface IAttachment {
  type: "image" | "video" | "file" | "audio" | "other";
  buffer: string;
  name: string;
}

interface IMessageSentBody {
  _id: string;
  chatId: string;
  content: string;
  replyTo: IReplyMessage | null;
  attachments?: IAttachment[];
  createdAt: Date;
}

export { type IMessageSentBody, type IReplyMessage, type IAttachment };
