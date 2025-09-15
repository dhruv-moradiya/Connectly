import { cn } from "@/lib/utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useChatMessage } from "@/hooks/use-chat-message";
import { usePointerSwipe } from "@/hooks/use-draggable-bubble";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { useScrollToMessage } from "@/hooks/use-scroll-to-message";
import { useAppSelector } from "@/store/store";
import { InteractionMode } from "@/types/index.type";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";
import ChatHeader from "./chat-header";
import MessageRow from "./message-row";
import ChatInput from "./chat-input/chat-input";
import ChatSidebar from "./chat-sidebar";

export default function ChatMessages({
  isGroupChat,
}: {
  isGroupChat: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  const user = useAppSelector((state) => state.auth.user);
  const {
    interactionMode,
    setInteractionMode,
    setSelectedMessage,
    isSidebarOpen,
  } = useChatMessage();
  const { messages } = useAppSelector((state) => state.activeChat);
  const { groupedMessages } = useGroupMessages({ messages });

  const onReplyTrigger = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);
      setInteractionMode(InteractionMode.REPLY);
      setSelectedMessage([message!]);
    },
    [messages, setInteractionMode, setSelectedMessage]
  );

  const virtualizer = useVirtualizer({
    count: groupedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
  });

  // Custom hooks
  const scrollToMessage = useScrollToMessage(messages, virtualizer, bubbleRefs);
  useAutoScroll(virtualizer, groupedMessages);

  const items = virtualizer.getVirtualItems();
  usePointerSwipe(scrollToMessage, onReplyTrigger);

  if (!user) return null;

  return (
    <div className="grid grid-cols-12 h-[calc(100vh-46px)] w-full overflow-hidden">
      <div
        className={cn(
          "flex flex-col",
          "col-span-12",
          isSidebarOpen ? "md:col-span-9" : "md:col-span-12"
        )}
      >
        <ChatHeader isGroupChat={isGroupChat} />

        <div
          ref={parentRef}
          className={cn(
            "scrollbar h-[calc(100vh-222px)] overflow-x-hidden overflow-y-scroll w-full flex justify-center transition-all duration-500",
            interactionMode === InteractionMode.REPLY
              ? "h-[calc(100vh-222px)]"
              : "h-[calc(100vh-150px)]"
          )}
        >
          <div
            className="relative w-full sm:max-w-2xl lg:max-w-4xl px-2 sm:px-4"
            style={{ height: virtualizer.getTotalSize() }}
          >
            <div
              className="chat-container absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${items[0]?.start ?? 0}px)` }}
            >
              {items.map((virtualRow) => (
                <MessageRow
                  key={virtualRow.key}
                  virtualRow={virtualRow}
                  groupedMessages={groupedMessages}
                  isGroupChat={isGroupChat}
                  bubbleRefs={bubbleRefs}
                  measureElement={virtualizer.measureElement}
                />
              ))}
            </div>

            {/* <ScrollToBottomButton /> */}
          </div>
        </div>

        <ChatInput />
      </div>
      <ChatSidebar />
    </div>
  );
}
