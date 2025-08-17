import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LongPressPopover() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<HTMLDivElement[]>([]);

  // Animate popover open
  useEffect(() => {
    if (open && popoverRef.current) {
      const tl = gsap.timeline();

      // Popover slide in (left → right)
      tl.fromTo(
        popoverRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );

      // Stagger children inside
      tl.fromTo(
        childRefs.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" },
        "-=0.2" // overlap slightly
      );
    }
  }, [open]);

  // Long press handling
  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, 1500); // 1.5 sec
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="p-10">
      <div
        className="w-40 h-20 bg-blue-500 text-white flex items-center justify-center rounded-lg cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        Hold me (1.5s)
      </div>

      {open && (
        <div
          ref={popoverRef}
          className="absolute top-24 left-10 w-64 p-4 bg-gray-800 text-white rounded-lg shadow-lg"
        >
          {["Option 1", "Option 2", "Option 3"].map((item, i) => (
            <div
              key={i}
              ref={(el) => (childRefs.current[i] = el!)}
              className="p-2 border-b border-gray-600 last:border-none"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
