import { useRef } from "react";
import { format } from "date-fns";
import { GroupedVirtuoso, type GroupedVirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";

export default function ChatMessages() {
  const { messages } = useAppSelector((state) => state.activeChat);
  const user = useAppSelector((state) => state.auth.user);
  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  if (!user) return null;

  // Group messages by date
  const groups: { date: string; items: typeof messages }[] = [];
  messages.forEach((msg) => {
    const date = format(new Date(msg.createdAt), "dd-MMM-yyyy");
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.date !== date) {
      groups.push({ date, items: [msg] });
    } else {
      lastGroup.items.push(msg);
    }
  });

  const flatMessages = groups.flatMap((g) => g.items);
  const groupCounts = groups.map((g) => g.items.length);

  return (
    <GroupedVirtuoso
      className="overflow-x-hidden"
      ref={virtuosoRef}
      groupCounts={groupCounts}
      data={flatMessages}
      // initialTopMostItemIndex={flatMessages.length - 1}
      // followOutput={(isAtBottom) => {
      //   const lastMsg = flatMessages[flatMessages.length - 1];
      //   return isAtBottom || (lastMsg && lastMsg.sender._id === user._id);
      // }}
      groupContent={(index) => (
        <div className="text-center py-1 sticky top-0 z-10">
          <span className="text-xs border rounded-md p-0.5 shadow-xs">
            {groups[index].date}
          </span>
        </div>
      )}
      itemContent={(_index, _groupIndex, message) => (
        <ChatBubble
          key={message._id}
          messageId={message._id}
          isSender={message.sender._id === user._id}
          content={message.content}
          deliveryStatus={message.deliveryStatus}
        />
      )}
      style={{ height: "100%" }}
    />
  );
}
