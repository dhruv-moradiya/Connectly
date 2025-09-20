import type React from "react";
import type { VirtualItem } from "@tanstack/react-virtual";
import DateSeparator from "./date-separator";
import ChatBubble from "./chat-bubble/chat-bubble";
import type {
  IMessage,
  IReplyMessage,
  TMessageDeliveryStatus,
  TMessageSenderDetails,
  TMessageType,
} from "@/types/api-response.type";

type IGroupedMessages =
  | IMessage[]
  | {
      showDateSeparator: boolean;
      dateSeparator: string;
      _id: string;
      content: string;
      createdAt: string;
      deliveryStatus: TMessageDeliveryStatus;
      type: TMessageType;
      sender: TMessageSenderDetails;
      replyTo: IReplyMessage | null;
    }[];

interface IMessageRowProps {
  virtualRow: VirtualItem;
  groupedMessages: IGroupedMessages;
  isGroupChat: boolean;
  bubbleRefs: React.RefObject<HTMLDivElement[]>;
  measureElement: React.Ref<HTMLDivElement>;
}

const MessageRow = ({
  virtualRow,
  groupedMessages,
  isGroupChat,
  bubbleRefs,
  measureElement,
}: IMessageRowProps) => {
  const msg = groupedMessages[virtualRow.index];
  console.log("msg :>> ", msg);
  return (
    <div
      key={virtualRow.key}
      data-index={virtualRow.index}
      ref={measureElement}
      className="relative"
    >
      {"showDateSeparator" in msg ? (
        <DateSeparator date={msg.dateSeparator} />
      ) : (
        <ChatBubble
          ref={(el: HTMLDivElement | null) => {
            if (el) bubbleRefs.current[virtualRow.index] = el;
          }}
          isGroupChat={isGroupChat}
          message={msg}
        />
      )}
    </div>
  );
};

export default MessageRow;
