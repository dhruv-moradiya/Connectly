import { useDraggableBubble } from "@/hooks/use-draggable-bubble";
import { cn } from "@/lib/utils";
import { CornerUpRight } from "lucide-react";
import { useRef, type RefObject } from "react";
import ChatBubbleMenu from "./chat-bubble-menu";

interface DraggableBubbleProps {
  index: number;
  isSender: boolean;
  children: React.ReactNode;
}

const DraggableBubble = ({
  index,
  isSender,
  children,
}: DraggableBubbleProps) => {
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  console.log("index :>> ", index);

  useDraggableBubble(
    chatBubbleRef as RefObject<HTMLDivElement>,
    arrowRef as RefObject<HTMLDivElement>
  );

  return (
    <div
      ref={chatBubbleRef}
      className={cn(
        "chat-bubble relative group w-fit max-w-xs text-sm p-2 rounded-lg select-none mb-0 flex gap-1 z-10",
        isSender
          ? "ml-auto bg-primary text-white"
          : "mr-auto bg-secondary-foreground/90 text-white",
        "flex items-center my-0.5"
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
