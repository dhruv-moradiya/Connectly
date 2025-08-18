import { Check, CheckCheck } from "lucide-react";
import DraggableBubble from "./draggable-bubble";
import type { TMessageDeliveryStatus } from "@/types/api-response.type";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ChatBubbleProps {
  messageId: string;
  isSender: boolean;
  content: string;
  deliveryStatus: TMessageDeliveryStatus;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ messageId, isSender, content, deliveryStatus }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-10 px-3 py-0.5 rounded-md hover:bg-primary/5 duration-200"
        )}
      >
        {/* <Checkbox /> */}
        <DraggableBubble messageId={messageId} isSender={isSender} ref={ref}>
          <div className="text-sm">{content}</div>
          <div className="shrink-0 flex gap-0 items-end">
            <span className="text-[10px] text-muted ml-2 self-end justify-end translate-y-1">
              12:34 PM
            </span>
            {isSender && (
              <ChatBubbleDelevaryStatus deliveryStatus={deliveryStatus} />
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
