import type { IMessage } from "@/types/api-response.type";
import type { Virtualizer } from "@tanstack/react-virtual";
import React, { useCallback } from "react";

export function useScrollToMessage(
  messages: IMessage[],
  virtualizer: Virtualizer<HTMLDivElement, Element>,
  bubbleRefs: React.RefObject<HTMLDivElement[]>
) {
  return useCallback(
    (messageId: string) => {
      const index = messages.findIndex((m) => m._id === messageId);
      if (index !== -1) {
        virtualizer.scrollToIndex(index, { align: "center" });

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
    [messages, virtualizer, bubbleRefs]
  );
}
