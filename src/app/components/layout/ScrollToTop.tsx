import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={scrollUp}
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Scroll to top"
        >
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#4CAF50]/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Second ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#4CAF50]/20"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />

          {/* Main button */}
          <div className="relative w-14 h-14 rounded-full bg-[#4CAF50] shadow-xl shadow-green-500/40 flex items-center justify-center group-hover:bg-[#3d9140] transition-colors duration-300 border-4 border-white">
            {/* Leaf SVG */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                {/* Leaf body */}
                <path
                  d="M12 3C7 3 3 7.5 3 12.5C3 17 6.5 20.5 12 21C17.5 20.5 21 17 21 12.5C21 7.5 17 3 12 3Z"
                  fill="white"
                  opacity="0.95"
                />
                {/* Leaf center vein */}
                <line x1="12" y1="21" x2="12" y2="10" stroke="#0B5D3F" strokeWidth="1.5" strokeLinecap="round" />
                {/* Upward arrow tip */}
                <path d="M9 13L12 10L15 13" stroke="#0B5D3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
