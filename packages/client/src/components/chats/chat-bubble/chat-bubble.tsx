import { Check, CheckCheck } from "lucide-react";
import DraggableBubble from "./draggable-bubble";
import type { TMessageDeliveryStatus } from "@/types/api-response.type";

const ChatBubble = ({
  isSender,
  content,
  deliveryStatus,
}: {
  isSender: boolean;
  content: string;
  deliveryStatus: TMessageDeliveryStatus;
}) => {
  return (
    <DraggableBubble isSender={isSender}>
      <div>{content}</div>
      <div className="flex gap-0 items-end">
        <span className="text-[10px] text-muted ml-2 self-end justify-end translate-y-1">
          12:34 PM
        </span>
        {isSender && (
          <ChatBubbleDelevaryStatus deliveryStatus={deliveryStatus} />
        )}
      </div>
    </DraggableBubble>
  );
};

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
