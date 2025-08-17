import { useRef, useState, type RefObject } from "react";
import { CornerUpRight, Plus } from "lucide-react";

import ChatBubbleMenu from "@/components/chats/chat-bubble/chat-bubble-menu";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/store";
import { useChatMessage } from "@/hooks/use-chat-message";

import { InteractionMode } from "@/types/index.type";

import { useDraggableBubble } from "@/hooks/use-draggable-bubble";
import { Button } from "@/components/ui/button";
import { usePopoverAnimation } from "@/hooks/use-popover-animation";

interface DraggableBubbleProps {
  messageId: string;
  isSender: boolean;
  children: React.ReactNode;
}

const DraggableBubble = ({
  messageId,
  isSender,
  children,
}: DraggableBubbleProps) => {
  const arrowRef = useRef<HTMLDivElement>(null);
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  const chatBubbleMenuRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { messages } = useAppSelector((state) => state.activeChat);
  const [showPopover, setShowPopover] = useState(false);
  const { setInteractionMode, setSelectedMessage } = useChatMessage();

  const onReplyTrigger = () => {
    const message = messages.find((m) => m._id === messageId);

    setInteractionMode(InteractionMode.REPLY);
    setSelectedMessage([message!]);
  };

  useDraggableBubble(
    chatBubbleRef as RefObject<HTMLDivElement>,
    arrowRef as RefObject<HTMLDivElement>,
    onReplyTrigger
  );

  usePopoverAnimation({
    showPopover,
    setShowPopover,
    popoverRef,
    chatBubbleRef,
    chatBubbleMenuRef,
  });

  return (
    <div
      ref={chatBubbleRef}
      className={cn(
        "chat-bubble relative group text-sm p-2 rounded-lg select-none mb-0 flex gap-1 z-10",
        "w-fit max-w-[80%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl",
        "flex items-center relative",
        isSender
          ? "ml-auto bg-primary text-white"
          : "mr-auto bg-secondary-foreground/90 text-white"
      )}
    >
      <div
        ref={popoverRef}
        className={cn(
          "absolute bg-card shadow-lg rounded-md mt-1 px-3 py-1 text-xs whitespace-nowrap flex items-center gap-2",
          isSender ? "right-0 top-full" : "left-0 top-full"
        )}
      >
        {["a", "b", "a", "b", "a"].map((item, index) => (
          <div
            key={index}
            className={cn(
              "popover-item",
              isSender ? "text-right" : "text-left"
            )}
          >
            <Button className="text-red-600" variant={"outline"} size={"sm"}>
              {item}
            </Button>
          </div>
        ))}
        <div
          className={cn("popover-item", isSender ? "text-right" : "text-left")}
        >
          <Button className="text-red-600" variant={"outline"} size={"sm"}>
            <Plus />
          </Button>
        </div>
      </div>
      <div
        ref={arrowRef}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 scale-0"
      >
        <CornerUpRight
          size={14}
          className={cn(
            isSender ? "text-primary" : "text-secondary-foreground"
          )}
        />
      </div>

      {children}

      <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChatBubbleMenu
          chatBubbleMenuRef={chatBubbleMenuRef}
          messageId={messageId}
          setShowPopover={setShowPopover}
        />
      </div>
    </div>
  );
};

export default DraggableBubble;
