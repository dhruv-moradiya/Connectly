import { memo } from "react";
import { cn } from "@/lib/utils";
import type { IMessage } from "@/types/api-response.type";

const ReplyToContent = ({
  message,
  isSender,
}: {
  message: IMessage;
  isSender: boolean;
}) => {
  if (!message.replyTo) return null;
  <div
    id={message.replyTo._id}
    className={cn(
      "reply-to-message",
      "w-full rounded-md px-2 py-1 cursor-pointer",
      isSender
        ? "bg-orange-900/20 text-white border-l-4 border-orange-700 pl-2"
        : "mr-auto bg-secondary-foreground/90 text-white border-l-4 border-secondary/50 pl-2"
    )}
  >
    {message.replyTo.content}
  </div>;
};

export default memo(ReplyToContent);
