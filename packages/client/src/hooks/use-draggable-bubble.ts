// import { useEffect } from "react";
// import gsap from "gsap";
// import { Draggable } from "gsap/all";

// gsap.registerPlugin(Draggable);

// export const useDraggableBubble = (
//   chatBubbleRef: React.RefObject<HTMLDivElement>,
//   arrowRef: React.RefObject<HTMLDivElement>,
//   onReplyTrigger?: () => void
// ) => {
//   useEffect(() => {
//     const el = chatBubbleRef.current;
//     const arrow = arrowRef.current;

//     if (!el || !arrow) return;

//     Draggable.create(el, {
//       type: "x",
//       bounds: { minX: 100, maxX: 0 },
//       onDrag: function () {
//         arrow.style.opacity = this.x > 20 ? "1" : "0";
//         arrow.style.scale = this.x > 20 ? "1.2" : "0";
//         arrow.style.transition = "all 0.2s ease-in-out";
//       },
//       onDragStart: function () {
//         gsap.to(el, { scale: 0.95, duration: 0.2, ease: "power1.inOut" });
//       },
//       onDragEnd: function () {
//         gsap.to(el, {
//           x: 0,
//           scale: 1,
//           duration: 0.5,
//           ease: "elastic.out(1, 0.8)",
//         });

//         arrow.style.opacity = "0";
//         arrow.style.color = "white";
//         arrow.style.filter = "drop-shadow(0 0 2px white)";

//         if (this.x > 70) {
//           onReplyTrigger?.();
//         }
//       },
//     });
//   }, [chatBubbleRef, arrowRef, onReplyTrigger]);
// };

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

type ReplyCb = (messageId: string) => void;

export const useDraggableBubble = (
  chatBubbleRefs: React.RefObject<HTMLDivElement[]>,
  messagesLength: number,
  onReplyTrigger?: ReplyCb,
  opts?: {
    direction?: "left" | "right";
    distance?: number;
    threshold?: number;
  }
) => {
  useEffect(() => {
    console.log(
      "chatBubbleRefs.current.length :>> ",
      chatBubbleRefs.current.length
    );
    const elements = (chatBubbleRefs.current || []).filter(
      Boolean
    ) as HTMLDivElement[];

    if (!messagesLength) return;

    const id = requestAnimationFrame(() => {
      // if (elements.length === 0) return;

      const direction = opts?.direction ?? "left";
      const distance = opts?.distance ?? 100;
      const threshold = opts?.threshold ?? 70;

      const bounds =
        direction === "left"
          ? { minX: -distance, maxX: 0 }
          : { minX: 0, maxX: distance };

      const draggables = Draggable.create(elements, {
        type: "x",
        bounds,
        dragResistance: 0.12,
        allowContextMenu: true,
        onDrag: function () {
          const arrow = this.target.querySelector(".chat-bubble-arrow");
          if (arrow) {
            const show = direction === "left" ? this.x < -20 : this.x > 20;
            gsap.to(arrow, {
              opacity: show ? 1 : 0,
              scale: show ? 1.2 : 0,
              duration: 0.15,
              ease: "power2.out",
            });
          }
        },
        onDragStart: function () {
          gsap.to(this.target, {
            scale: 0.95,
            duration: 0.2,
            ease: "power1.inOut",
          });
          (this.target as HTMLElement).style.userSelect = "none";
        },
        onDragEnd: function () {
          const passed =
            direction === "left" ? this.x <= -threshold : this.x >= threshold;

          gsap.to(this.target, {
            x: 0,
            scale: 1,
            duration: 0.45,
            ease: "elastic.out(1, 0.8)",
            onComplete: () => {
              (this.target as HTMLElement).style.userSelect = "";
            },
          });

          const arrow = this.target.querySelector(".chat-bubble-arrow");
          if (arrow) gsap.to(arrow, { opacity: 0, scale: 0, duration: 0.15 });

          if (passed) {
            const messageId = this.target.getAttribute("id");
            onReplyTrigger?.(messageId);
          }
        },
      });

      return () => draggables.forEach((d) => d.kill());
    });

    return () => cancelAnimationFrame(id);
  }, [
    chatBubbleRefs,
    chatBubbleRefs.current.length,
    messagesLength,
    onReplyTrigger,
    opts?.direction,
    opts?.distance,
    opts?.threshold,
  ]);
};

export function usePointerSwipe(
  scrollToMessage: (messageId: string) => void,
  onReplyTrigger: ReplyCb,
  containerSelector = ".chat-container"
) {
  const draggablesRef = useRef<Map<HTMLElement, Draggable>>(new Map());

  useEffect(() => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return;

    function handlePointerDown(e: PointerEvent) {
      const bubble = (e.target as HTMLElement).closest(
        ".chat-bubble"
      ) as HTMLElement;
      if (!bubble) return;

      let moved: boolean;

      if (draggablesRef.current.has(bubble)) return;

      const [draggable] = Draggable.create(bubble, {
        type: "x",
        bounds: { minX: 0, maxX: 100 },
        dragResistance: 0.12,
        allowContextMenu: true,

        onDrag() {
          const arrow = bubble.querySelector(".chat-bubble-arrow");
          if (arrow) {
            const show = this.x > 20;
            gsap.to(arrow, {
              opacity: show ? 1 : 0,
              scale: show ? 1.2 : 0,
              duration: 0.15,
              ease: "power2.out",
            });
          }
        },

        onDragStart() {
          moved = true;
          gsap.to(bubble, { scale: 0.95, duration: 0.2, ease: "power1.inOut" });
          bubble.style.userSelect = "none";
        },

        onDragEnd() {
          const passed = this.x >= 70;
          gsap.to(bubble, {
            x: 0,
            scale: 1,
            duration: 0.45,
            ease: "elastic.out(1, 0.8)",
            onComplete: () => {
              bubble.style.userSelect = "";
            },
          });

          const arrow = bubble.querySelector(".chat-bubble-arrow");
          if (arrow) gsap.to(arrow, { opacity: 0, scale: 0, duration: 0.15 });

          if (moved) {
            if (passed) {
              onReplyTrigger?.(bubble.id);
            } else {
              scrollToMessage(
                bubble.querySelector(".reply-to-message")?.getAttribute("id") ??
                  ""
              );
            }
          }
        },
      });

      draggablesRef.current.set(bubble, draggable);

      draggable.startDrag(e);
    }

    container.addEventListener("pointerdown", handlePointerDown);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      draggablesRef.current.forEach((d) => d.kill());
      draggablesRef.current.clear();
    };
  }, [containerSelector]);
}
