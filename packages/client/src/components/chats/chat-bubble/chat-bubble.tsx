import { Check, CheckCheck } from "lucide-react";
import DraggableBubble from "./draggable-bubble";
import type {
  IMessage,
  TMessageDeliveryStatus,
} from "@/types/api-response.type";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { useAppSelector } from "@/store/store";
import { useChatMessage } from "@/hooks/use-chat-message";

interface ChatBubbleProps {
  message: IMessage;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ message }, ref) => {
    const { handleQuerySearch } = useChatMessage();
    const user = useAppSelector((state) => state.auth.user);

    const isSender = message.sender._id === user?._id;

    return (
      <div className={cn("flex items-center px-3 rounded-md my-0.5")}>
        {/* <Checkbox /> */}
        <DraggableBubble message={message} isSender={isSender} ref={ref}>
          <p className="text-sm">{handleQuerySearch(message.content)}</p>
          <div className="shrink-0 flex gap-0 justify-end items-end">
            <span
              className={cn(
                "text-[10px] ml-2 self-end justify-end translate-y-1",
                isSender ? "text-white" : "text-muted-foreground"
              )}
            >
              12:34 PM
            </span>
            {isSender && (
              <ChatBubbleDelevaryStatus
                deliveryStatus={message.deliveryStatus}
              />
            )}
          </div>
        </DraggableBubble>
      </div>
    );
  }
);

export default ChatBubble;

const ChatBubbleDelevaryStatus = ({
  deliveryStatus,
}: {
  deliveryStatus: TMessageDeliveryStatus;
}) => {
  switch (deliveryStatus) {
    case "pending":
      return <span />;
    case "sent":
      return (
        <span className="text-[10px] text-muted ml-2 self-end justify-end translate-y-1">
          <Check size={12} />
        </span>
      );
    case "delivered":
      return (
        <span className="text-[10px] text-muted ml-2 self-end justify-end translate-y-1">
          <CheckCheck size={12} />
        </span>
      );
    case "seen":
      return (
        <span className="text-[10px] text-muted ml-2 self-end justify-end translate-y-1">
          <CheckCheck size={12} className="text-blue-300" />
        </span>
      );
  }
};
