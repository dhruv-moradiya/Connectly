import { useEffect, useState } from "react";
import { useChatMessage } from "./use-chat-message";
import { InteractionMode } from "@/types/index.type";

type PopoverPosition = {
  top: number;
  left: number;
} | null;

const useBubbleReact = (chatBubbleRef: React.RefObject<HTMLDivElement>) => {
  const { interactionMode } = useChatMessage();

  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const [position, setPosition] = useState<PopoverPosition>(null);

  // Whenever interaction mode changes, update popover
  useEffect(() => {
    if (!chatBubbleRef.current) return;

    if (interactionMode == InteractionMode.REACT) {
      const rect = chatBubbleRef.current.getBoundingClientRect();
      console.log("rect :>> ", rect);

      // Example: show popover above the bubble
      setPosition({
        top: rect.top,
        left: rect.left,
      });
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
      setPosition(null);
    }
  }, [interactionMode, chatBubbleRef]);

  return {
    isPopoverOpen,
    position,
    openPopover: () => setIsPopoverOpen(true),
    closePopover: () => setIsPopoverOpen(false),
  };
};

export { useBubbleReact };
