import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type UsePopoverAnimationProps = {
  showPopover: boolean;
  setShowPopover: (show: boolean) => void;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  chatBubbleRef?: React.RefObject<HTMLDivElement | null>;
  chatBubbleMenuRef?: React.RefObject<HTMLDivElement | null>;
};

export const usePopoverAnimation = ({
  showPopover,
  setShowPopover,
  popoverRef,
  chatBubbleRef,
  chatBubbleMenuRef,
}: UsePopoverAnimationProps) => {
  const isFirstRender = useRef(true);

  // GSAP animation
  useEffect(() => {
    if (!popoverRef.current) return;

    // 🔹 Skip animations on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(popoverRef.current, { opacity: 0, scale: 0.95, width: 0 });
      return;
    }

    if (showPopover) {
      const tl = gsap.timeline();
      tl.fromTo(
        popoverRef.current,
        { width: 0, opacity: 0, scale: 0.95 },
        {
          width: "auto",
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        }
      );

      tl.fromTo(
        popoverRef.current.querySelectorAll(".popover-item"),
        { y: 10, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          stagger: 0.05,
        },
        "-=0.1"
      );
    } else {
      const tl = gsap.timeline();
      tl.to(popoverRef.current, {
        width: 0,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power3.in",
      });
    }

    return () => {
      if (popoverRef.current) gsap.killTweensOf(popoverRef.current);
    };
  }, [showPopover, popoverRef]);

  // Outside click
  useEffect(() => {
    const handleReactPopoverClose = (e: MouseEvent) => {
      const target = e.target as Node;

      const isInsideChatBubble = chatBubbleRef?.current?.contains(target);
      const isInsidePopover = popoverRef.current?.contains(target);
      const isInsideMenu = chatBubbleMenuRef?.current?.contains(target);

      if (!isInsideChatBubble && !isInsidePopover && !isInsideMenu) {
        setShowPopover(false);
      }
    };

    document.addEventListener("click", handleReactPopoverClose);
    return () => {
      document.removeEventListener("click", handleReactPopoverClose);
    };
  }, [chatBubbleMenuRef, chatBubbleRef, popoverRef, setShowPopover]);
};
