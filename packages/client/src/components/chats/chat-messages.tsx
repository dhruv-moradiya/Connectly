import { useCallback, useRef } from "react";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";
import { usePointerSwipe } from "@/hooks/use-draggable-bubble";
import { useChatMessage } from "@/hooks/use-chat-message";
import { InteractionMode } from "@/types/index.type";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Phone, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ChatMessages() {
  const parentRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  const user = useAppSelector((state) => state.auth.user);
  const { setInteractionMode, setSelectedMessage, setQuery, query } =
    useChatMessage();

  const { messages } = useAppSelector((state) => state.activeChat);

  const { groupedMessages } = useGroupMessages({ messages });

  const onReplyTrigger = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);

      setInteractionMode(InteractionMode.REPLY);
      setSelectedMessage([message!]);
    },
    [messages]
  );

  const virtualizer = useVirtualizer({
    count: groupedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    // rangeExtractor: ({ startIndex, endIndex }) => {
    //   const indices: number[] = [];

    //   for (let i = startIndex; i <= endIndex; i++) {
    //     indices.push(i);
    //   }

    //   if (!indices.includes(0)) {
    //     indices.unshift(0);
    //   }

    //   return indices;
    // },
  });

  const scrollToMessage = useCallback(
    (messageId: string) => {
      const index = messages.findIndex((m) => m._id === messageId);
      if (index !== -1) {
        virtualizer.scrollToIndex(index, {
          align: "center",
        });

        requestAnimationFrame(() => {
          const bubble = bubbleRefs.current[index]?.parentElement;
          if (bubble) {
            bubble.classList.add("bubble-highlight");
            setTimeout(() => {
              bubble.classList.remove("bubble-highlight");
            }, 4000);
          }
        });
      }
    },
    [messages, virtualizer]
  );
  const items = virtualizer.getVirtualItems();

  usePointerSwipe(scrollToMessage, onReplyTrigger);

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between shadow-xs py-1 px-2">
        <div className="flex gap-2 items-center">
          <div className="size-10 rounded-md bg-red-100"></div>
          <div className="text-xs text-muted-foreground flex flex-col">
            <span>Username</span>
            <span>Last seen at 12:40 pm</span>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Input
            id="query"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant={"ghost"} size={"sm"}>
            <Phone />
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            <Search />
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisVertical />
          </Button>
        </div>
      </div>
      <div
        ref={parentRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          <div
            className={cn("chat-container absolute top-0 left-0 w-full")}
            style={{
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="relative"
              >
                {"showDateSeparator" in groupedMessages[virtualRow.index] && (
                  <div className={cn("flex justify-center my-4")}>
                    <div className="bg-primary/5 text-xs px-1 py-0.5 rounded-md border select-none">
                      {
                        (
                          groupedMessages[virtualRow.index] as {
                            dateSeparator: string;
                          }
                        ).dateSeparator
                      }
                    </div>
                  </div>
                )}

                <ChatBubble
                  ref={(el: HTMLDivElement | null) => {
                    if (el) bubbleRefs.current[virtualRow.index] = el;
                  }}
                  message={groupedMessages[virtualRow.index]}
                  scrollToMessage={scrollToMessage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
