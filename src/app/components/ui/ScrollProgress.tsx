import { useScroll, motion } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9990] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #0B5D3F, #4CAF50, #D6A95A)",
      }}
    />
  );
}
