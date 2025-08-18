import { useCallback, useRef } from "react";
import { GroupedVirtuoso, type GroupedVirtuosoHandle } from "react-virtuoso";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { useDraggableBubble } from "@/hooks/use-draggable-bubble";
import { useChatMessage } from "@/hooks/use-chat-message";
import { InteractionMode } from "@/types/index.type";

export default function ChatMessages() {
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  const virtuosoRef = useRef<GroupedVirtuosoHandle>(null);

  const user = useAppSelector((state) => state.auth.user);
  const { setInteractionMode, setSelectedMessage } = useChatMessage();

  const { messages } = useAppSelector((state) => state.activeChat);
  const { flatMessages, groupCounts, groups } = useGroupMessages({ messages });

  const onReplyTrigger = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);

      setInteractionMode(InteractionMode.REPLY);
      setSelectedMessage([message!]);
    },
    [messages]
  );

  useDraggableBubble(bubbleRefs, messages.length, onReplyTrigger, {
    direction: "right",
    distance: 100,
    threshold: 70,
  });

  if (!user) return null;

  return (
    <GroupedVirtuoso
      className="overflow-x-hidden"
      ref={virtuosoRef}
      groupCounts={groupCounts}
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
            ref={(el: HTMLDivElement | null) => {
              if (el) bubbleRefs.current[index] = el;
            }}
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
