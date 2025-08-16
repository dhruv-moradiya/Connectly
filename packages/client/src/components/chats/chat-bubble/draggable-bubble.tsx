import { useRef, type RefObject } from "react";
import { CornerUpRight } from "lucide-react";

import ChatBubbleMenu from "@/components/chats/chat-bubble/chat-bubble-menu";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/store";
import { useChatMessage } from "@/hooks/use-chat-message";

import { InteractionMode } from "@/types/index.type";

import { useDraggableBubble } from "@/hooks/use-draggable-bubble";

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
  const { setInteractionMode, setSelectedMessage } = useChatMessage();
  const { messages } = useAppSelector((state) => state.activeChat);

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

  return (
    <div
      ref={chatBubbleRef}
      className={cn(
        "chat-bubble relative group w-fit max-w-[80%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-sm p-2 rounded-lg select-none mb-0 flex gap-1 z-10",
        isSender
          ? "ml-auto bg-primary text-white"
          : "mr-auto bg-secondary-foreground/90 text-white",
        "flex items-center"
      )}
    >
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
        <ChatBubbleMenu />
      </div>
    </div>
  );
};

export default DraggableBubble;
