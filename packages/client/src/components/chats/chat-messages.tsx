import { useCallback, useRef } from "react";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";
import { usePointerSwipe } from "@/hooks/use-draggable-bubble";
import { useChatMessage } from "@/hooks/use-chat-message";
import { InteractionMode } from "@/types/index.type";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function ChatMessages() {
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  const parentRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const { setInteractionMode, setSelectedMessage } = useChatMessage();

  const { messages } = useAppSelector((state) => state.activeChat);

  const onReplyTrigger = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);

      setInteractionMode(InteractionMode.REPLY);
      setSelectedMessage([message!]);
    },
    [messages]
  );

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });

  const items = virtualizer.getVirtualItems();

  usePointerSwipe(onReplyTrigger);

  if (!user) return null;

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          className="chat-container"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              <ChatBubble
                ref={(el: HTMLDivElement | null) => {
                  if (el) bubbleRefs.current[virtualRow.index] = el;
                }}
                messageId={messages[virtualRow.index]._id}
                isSender={messages[virtualRow.index].sender._id === user._id}
                content={messages[virtualRow.index].content}
                deliveryStatus={messages[virtualRow.index].deliveryStatus}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
