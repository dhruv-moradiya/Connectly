import { useRef } from "react";
import { GroupedVirtuoso, type GroupedVirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";
import { useGroupMessages } from "@/hooks/use-group-messages";

export default function ChatMessages() {
  const { messages } = useAppSelector((state) => state.activeChat);
  const user = useAppSelector((state) => state.auth.user);
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  const { flatMessages, groupCounts, groups } = useGroupMessages({ messages });

  if (!user) return null;

  return (
    <GroupedVirtuoso
      className="overflow-x-hidden"
      ref={virtuosoRef}
      groupCounts={groupCounts}
      // data={flatMessages}
      // initialTopMostItemIndex={flatMessages.length - 1}
      // followOutput={(isAtBottom) => {
      //   const lastMsg = flatMessages[flatMessages.length - 1];
      //   return isAtBottom || (lastMsg && lastMsg.sender._id === user._id);
      // }}
      groupContent={(index) => (
        <div className="text-center py-1 sticky top-0 z-[100000]">
          <span className="text-xs border rounded-md p-0.5 shadow-xs">
            {groups[index].date}
          </span>
        </div>
      )}
      itemContent={(index) => {
        const message = flatMessages[index];
        return (
          <ChatBubble
            messageId={message._id}
            isSender={message.sender._id === user._id}
            content={message.content}
            deliveryStatus={message.deliveryStatus}
          />
        );
      }}
      style={{ height: "100%" }}
    />
  );
}
