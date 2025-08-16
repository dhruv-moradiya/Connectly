import { useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";

gsap.registerPlugin(Draggable);

export const useDraggableBubble = (
  chatBubbleRef: React.RefObject<HTMLDivElement>,
  arrowRef: React.RefObject<HTMLDivElement>,
  onReplyTrigger?: () => void
) => {
  useEffect(() => {
    const el = chatBubbleRef.current;
    const arrow = arrowRef.current;

    if (!el || !arrow) return;

    Draggable.create(el, {
      type: "x",
      bounds: { minX: 100, maxX: 0 },
      onDrag: function () {
        arrow.style.opacity = this.x > 20 ? "1" : "0";
        arrow.style.scale = this.x > 20 ? "1.2" : "0";
        arrow.style.transition = "all 0.2s ease-in-out";
      },
      onDragStart: function () {
        gsap.to(el, { scale: 0.95, duration: 0.2, ease: "power1.inOut" });
      },
      onDragEnd: function () {
        gsap.to(el, {
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.8)",
        });

        arrow.style.opacity = "0";
        arrow.style.color = "white";
        arrow.style.filter = "drop-shadow(0 0 2px white)";

        if (this.x > 70) {
          onReplyTrigger?.();
        }
      },
    });
  }, [chatBubbleRef, arrowRef, onReplyTrigger]);
};
