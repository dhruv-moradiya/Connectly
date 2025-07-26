import { z } from "zod";

const messageSentSchema = z.object({
  chatId: z.string({
    required_error: "Chat ID is required",
    invalid_type_error: "Chat ID must be a string",
  }),
  text: z.string({
    required_error: "Text is required",
    invalid_type_error: "Text must be a string",
  }),
});

export { messageSentSchema };

export type IMessageSentBody = z.infer<typeof messageSentSchema>;
