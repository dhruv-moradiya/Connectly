import { forwardRef, memo, useRef, useState } from "react";
import { CornerUpRight } from "lucide-react";

import ChatBubbleMenu from "@/components/chats/chat-bubble/chat-bubble-menu";

import { cn } from "@/lib/utils";
import type { IMessage } from "@/types/api-response.type";
import ReplyToContent from "./reply-to-content";

interface DraggableBubbleProps {
  isSender: boolean;
  message: IMessage;
  children: React.ReactNode;
}

const DraggableBubble = forwardRef<HTMLDivElement, DraggableBubbleProps>(
  ({ message, isSender, children }, ref) => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const chatBubbleMenuRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_showPopover, setShowPopover] = useState(false);

    // useDraggableBubble(
    //   chatBubbleRef as RefObject<HTMLDivElement>,
    //   arrowRef as RefObject<HTMLDivElement>,
    //   onReplyTrigger
    // );

    // usePopoverAnimation({
    //   showPopover,
    //   setShowPopover,
    //   popoverRef,
    //   chatBubbleRef,
    //   chatBubbleMenuRef,
    // });

    return (
      <div
        ref={ref}
        id={message._id}
        className={cn(
          "chat-bubble relative group text-sm p-2 rounded-lg select-none mb-0 z-10",
          "w-fit max-w-[80%] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl",
          "flex flex-col relative",
          isSender
            ? "ml-auto bg-primary text-white"
            : "mr-auto bg-secondary-foreground/90 text-white"
        )}
      >
        {/* <AttachmentContainer /> */}

        {message.replyTo && (
          <ReplyToContent message={message} isSender={isSender} />
        )}

        <div
          ref={arrowRef}
          className="chat-bubble-arrow absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 scale-0"
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
            messageId={message._id}
            setShowPopover={setShowPopover}
          />
        </div>
      </div>
    );
  }
);

export default memo(DraggableBubble);

{
  /* <div
          ref={popoverRef}
          className={cn(
            "absolute bg-card shadow-lg rounded-md mt-1 px-3 py-1 text-xs whitespace-nowrap flex items-center gap-2 z-50",
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
            className={cn(
              "popover-item",
              isSender ? "text-right" : "text-left"
            )}
          >
            <Button className="text-red-600" variant={"outline"} size={"sm"}>
              <Plus />
            </Button>
          </div>
        </div> */
}
