import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CheckIcon } from "lucide-react";

export default function AnimatedCheck({ selected }: { selected: boolean }) {
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = iconRef.current;
    if (!svg) return;

    const path = svg.querySelector("path");
    if (!path) return;

    const length = path.getTotalLength();

    // Prepare dash settings
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: selected ? -length : 0, // start offset reversed
      opacity: 1,
      display: "block",
    });

    if (selected) {
      // Animate from left → right visually
      gsap.fromTo(
        path,
        { strokeDashoffset: -length }, // hidden from left
        {
          strokeDashoffset: 0, // fully drawn to right
          duration: 0.6,
          ease: "power2.out",
        }
      );
    } else {
      // Erase from right → left
      gsap.fromTo(
        path,
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: length,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(path, { display: "none" });
          },
        }
      );
    }
  }, [selected]);

  return (
    <CheckIcon ref={iconRef} className="w-4 h-4 text-primary" strokeWidth={3} />
  );
}
