import { useCallback, useRef } from "react";
import { useAppSelector } from "@/store/store";
import ChatBubble from "./chat-bubble/chat-bubble";
import { usePointerSwipe } from "@/hooks/use-draggable-bubble";
import { useChatMessage } from "@/hooks/use-chat-message";
import { InteractionMode } from "@/types/index.type";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGroupMessages } from "@/hooks/use-group-messages";
import { cn } from "@/lib/utils";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import { Button } from "../ui/button";
import { Image, Info, Users, X } from "lucide-react";

export default function ChatMessages({
  isGroupChat,
}: {
  isGroupChat: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLDivElement[]>([]);

  const user = useAppSelector((state) => state.auth.user);
  const {
    setInteractionMode,
    setSelectedMessage,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useChatMessage();

  const { messages } = useAppSelector((state) => state.activeChat);

  const { groupedMessages } = useGroupMessages({ messages });

  const onReplyTrigger = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m._id === messageId);

      setInteractionMode(InteractionMode.REPLY);
      setSelectedMessage([message!]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="grid grid-cols-12 h-[calc(100vh-46px)] w-full">
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
          className="scrollbar h-[calc(100vh-150px)] overflow-x-hidden overflow-y-scroll w-full flex justify-center"
        >
          <div
            className="relative w-full sm:max-w-2xl lg:max-w-4xl px-2 sm:px-4"
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
                    <div className="flex justify-center my-4">
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
                    isGroupChat={isGroupChat}
                    message={groupedMessages[virtualRow.index]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ChatInput />
      </div>

      <div
        className={cn(
          "border-l bg-background overflow-hidden flex flex-col transition-all duration-200",
          "col-span-12 w-0 p-0",
          isSidebarOpen && "md:col-span-3 md:w-full md:p-4"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Info size={20} /> Contact Info
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X />
          </Button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center gap-2 py-4 border-b">
          <div className="size-28 rounded-full overflow-hidden shadow">
            <img
              src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold">Group Name</h3>
          <p className="text-sm text-muted-foreground text-center px-2">
            This is the group description where users can write about the
            purpose of the group or rules.
          </p>
        </div>

        {/* Participants */}
        <div className="scrollbar py-4 border-b flex-1 overflow-y-auto">
          <h3 className="text-base font-medium flex items-center gap-2 mb-3">
            <Users size={18} /> Participants
          </h3>

          <div className="space-y-2">
            {[1, 2, 3, 4].map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition"
              >
                <div className="size-10 rounded-full overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Username {idx + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    user{idx + 1}@example.com
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="py-4">
          <h3 className="text-base font-medium flex items-center gap-2 mb-2">
            <Image size={18} /> Media
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((_item, index) => (
              <div key={index} className="aspect-square">
                <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition">
                  <img
                    src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
                    alt="Media preview"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
