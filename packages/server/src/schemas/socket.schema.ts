import { z } from "zod";

const messageSentSchema = z.object({
  _id: z.string({
    required_error: "Message ID is required",
    invalid_type_error: "Message ID must be a string",
  }),
  chatId: z.string({
    required_error: "Chat ID is required",
    invalid_type_error: "Chat ID must be a string",
  }),
  content: z.string({
    required_error: "Message Content is required",
    invalid_type_error: "Message Content must be a string",
  }),
  replyTo: z.string().optional(),
  attachments: z
    .array(
      z.object({
        type: z.enum(["image", "video", "file", "audio", "other"]),
        buffer: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export { messageSentSchema };

export type IMessageentBody = z.infer<typeof messageSentSchema> & {
  createdAt: Date;
};
