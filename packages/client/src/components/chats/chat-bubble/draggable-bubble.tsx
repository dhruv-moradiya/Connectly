import { forwardRef, useRef, useState } from "react";
import { CornerUpRight } from "lucide-react";

import ChatBubbleMenu from "@/components/chats/chat-bubble/chat-bubble-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import type { IMessage } from "@/types/api-response.type";

interface DraggableBubbleProps {
  isSender: boolean;
  message: IMessage;
  scrollToMessage: (messageId: string) => void;
  children: React.ReactNode;
}

const DraggableBubble = forwardRef<HTMLDivElement, DraggableBubbleProps>(
  ({ message, isSender, scrollToMessage, children }, ref) => {
    const arrowRef = useRef<HTMLDivElement>(null);
    const chatBubbleMenuRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_showPopover, setShowPopover] = useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

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

    const ATTACHMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent
            className={cn(
              "w-full max-w-6xl min-h-[85vh] p-0 overflow-hidden flex items-center justify-center transition-all duration-300"
            )}
          >
            <Carousel className="w-full h-full relative flex items-center justify-center">
              <CarouselContent className="h-full">
                {ATTACHMENTS.length > 0 &&
                  ATTACHMENTS.map((_attachment, index) => (
                    <CarouselItem
                      key={index}
                      className="flex items-center justify-center select-none h-full"
                    >
                      <img
                        src="https://static1.polygonimages.com/wordpress/wp-content/uploads/2025/03/Demon-Slayer_-Kimetsu-no-Yaiba-Infinity-Castle-Theatrical-Date-Poster-US.jpg?q=49&fit=crop&w=1140&dpr=2"
                        alt="Preview"
                        className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg animate-fadeIn"
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>

              {/* Floating nav buttons */}
              <CarouselPrevious className="absolute left-2 sm:left-4 rounded-full p-2 sm:p-3 shadow-md transition-all" />
              <CarouselNext className="absolute right-2 sm:right-4 rounded-full p-2 sm:p-3 shadow-md transition-all" />
            </Carousel>
          </DialogContent>
        </Dialog>

        {/* <div className="grid grid-cols-2 gap-1 mb-1">
          {ATTACHMENTS.length > 3 &&
            ATTACHMENTS.slice(0, 3).map((_attachment, index) => (
              <div
                key={index}
                className="w-full min-w-20 h-20 rounded-md cursor-pointer overflow-hidden"
                onClick={() => setIsImageDialogOpen(true)}
              >
                <img
                  src="https://static1.polygonimages.com/wordpress/wp-content/uploads/2025/03/Demon-Slayer_-Kimetsu-no-Yaiba-Infinity-Castle-Theatrical-Date-Poster-US.jpg?q=49&fit=crop&w=1140&dpr=2"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          <div
            className="cursor-pointer w-full h-20 rounded-md flex items-center justify-center bg-black/20 text-white text-sm font-medium"
            onClick={() => setIsImageDialogOpen(true)}
          >
            +{ATTACHMENTS.length - 3}
          </div>
        </div> */}

        {message.replyTo && (
          <div
            className={cn(
              "w-full rounded-md px-2 py-1 cursor-pointer",
              isSender
                ? "bg-orange-900/20 text-white border-l-4 border-orange-700 pl-2"
                : "mr-auto bg-secondary-foreground/90 text-white border-l-4 border-secondary/50 pl-2"
            )}
            onClick={() => {
              console.log("Reply clicked");
              scrollToMessage(message.replyTo ? message.replyTo._id : "");
            }}
          >
            {message.replyTo.content}
          </div>
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

export default DraggableBubble;

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
