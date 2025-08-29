interface IReplyMessage {
  _id: string;
  content: string;
}

interface IAttachment {
  type: "image" | "video" | "file" | "audio" | "other";
  buffer: string;
  name: string;
}

/**
 * Based on "message_sent" event new message will create send in queue to save in DB as well as used in further process for manage delivery status
 */
interface IMessageSentBody {
  _id: string;
  chatId: string;
  content: string;
  replyTo: IReplyMessage | null;
  attachments?: IAttachment[];
  createdAt: Date;
}

interface ICloudinaryFileMetadata {
  bytes: number;
  publicId: string;
  format: string;
  resource_type: string;
  created_at: string;
  asset_folder: string;
}

interface ICloudinaryFilesUpload {
  files: Express.Multer.File[];
  folderNames: string[];
}

interface IUploadedFile {
  original: string;
  thumbnail: string;
  metaData: ICloudinaryFileMetadata;
}

export {
  type IMessageSentBody,
  type IReplyMessage,
  type IAttachment,
  type ICloudinaryFileMetadata,
  type ICloudinaryFilesUpload,
  type IUploadedFile,
};
