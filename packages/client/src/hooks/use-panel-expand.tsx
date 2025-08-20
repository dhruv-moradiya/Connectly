import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const usePanelExpand = ({
  panelRef,
}: {
  panelRef: React.RefObject<HTMLElement> | null;
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!panelRef?.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(panelRef.current, {
        height: showPanel ? "auto" : 0,
        opacity: showPanel ? 1 : 0,
        y: showPanel ? 0 : 20,
      });
      return;
    }

    if (showPanel) {
      gsap.fromTo(
        panelRef.current,
        { height: 0, opacity: 0, y: 20 },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(panelRef.current, {
        height: 0,
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [showPanel, panelRef]);

  const closePanel = () => setShowPanel(false);
  const openPanel = () => setShowPanel(true);

  return {
    showPanel,
    closePanel,
    openPanel,
  };
};

export { usePanelExpand };
