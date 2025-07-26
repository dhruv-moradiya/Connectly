import gsap from "gsap";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Reply,
  Copy,
  Smile,
  Forward,
  Pin,
  Star,
  Trash,
  MoreVertical,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Draggable } from "gsap/all";

gsap.registerPlugin(Draggable);

const ChatBubble = ({ isSender }: { isSender: boolean }) => {
  const check = true;
  const THRESHOLD = -80;
  const chatBubbleRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = chatBubbleRef.current;

    if (!el || !arrowRef.current) return;

    Draggable.create(el, {
      type: "x",
      bounds: {
        minX: -100, // <- Max left drag
        maxX: 0, // <- No right drag
      },
      onDrag: function () {
        if (this.x < -20) {
          if (arrowRef.current) arrowRef.current.style.opacity = "1";
        } else {
          if (arrowRef.current) arrowRef.current.style.opacity = "0";
        }
      },
      onDragStart: function () {
        gsap.to(el, {
          scale: 1.05,
          duration: 0.2,
          ease: "power1.inOut",
        });
      },
      onDragEnd: function () {
        gsap.to(el, {
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.8)",
        });

        if (arrowRef.current) arrowRef.current.style.opacity = "0";

        if (this.x <= THRESHOLD) {
          // onReply?.(message);
        }
      },
    });
  }, []);

  return (
    <div
      ref={chatBubbleRef}
      className={cn(
        "chat-bubble relative group max-w-xs text-sm p-2 rounded-lg bg-primary text-white select-none mb-0 flex gap-1",
        isSender
          ? "ml-auto bg-primary"
          : "mr-auto self-start bg-secondary-foreground/90",
        check ? "flex items-center" : "flex-col"
      )}
    >
      <div
        ref={arrowRef}
        className="absolute left-[-24px] top-1/2 -translate-y-1/2 text-blue-500 opacity-0 transition-opacity"
      >
        ➤
      </div>
      <div className="">This is a chat bubble.</div>

      <span
        className={cn(
          "text-[10px] text-muted",
          check ? "ml-2 self-end" : "text-end"
        )}
      >
        12:34 PM
      </span>

      <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChatBubbleMenu />
      </div>
    </div>
  );
};

export default ChatBubble;

const ChatBubbleMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-white/10 focus:outline-none">
          <MoreVertical size={16} className="text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        className="w-40 rounded-md bg-white dark:bg-muted p-1 animate-in fade-in zoom-in-95"
      >
        <DropdownMenuItem className="gap-2">
          <Reply className="w-4 h-4 text-gray-500" />
          Reply
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Copy className="w-4 h-4 text-gray-500" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Smile className="w-4 h-4 text-gray-500" />
          React
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Forward className="w-4 h-4 text-gray-500" />
          Forward
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Pin className="w-4 h-4 text-gray-500" />
          Pin
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Star className="w-4 h-4 text-gray-500" />
          Star
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash className="w-4 h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
