import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(hover: none)").matches || window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onHoverIn = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role=button], input, textarea, select, [tabindex]")) {
        setIsHovering(true);
      }
    };
    const onHoverOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role=button], input, textarea, select, [tabindex]")) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onHoverIn);
    document.addEventListener("mouseout", onHoverOut);
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
    };
  }, [isMobile, dotX, dotY, ringX, ringY]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isHovering ? 64 : isClicking ? 32 : 44,
            height: isHovering ? 64 : isClicking ? 32 : 44,
            backgroundColor: isHovering ? "rgba(76, 175, 80, 0.1)" : "rgba(76, 175, 80, 0.25)",
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="rounded-full"
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: isHovering ? 0 : isClicking ? 12 : 8,
            height: isHovering ? 0 : isClicking ? 12 : 8,
            backgroundColor: "#4CAF50",
            opacity: isVisible && !isHovering ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="rounded-full"
        />
      </motion.div>
    </>
  );
}
