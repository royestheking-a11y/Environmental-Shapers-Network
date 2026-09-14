import { motion } from "motion/react";

interface PlantSproutLoaderProps {
  fullScreen?: boolean;
  compact?: boolean;
}

export function PlantSproutLoader({
  fullScreen = false,
  compact = false,
}: PlantSproutLoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[100] bg-[#0A1A0E]/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
    : compact
    ? "py-8 flex flex-col items-center justify-center"
    : "min-h-[80vh] w-full flex flex-col items-center justify-center p-6 my-auto";

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Glowing Halo */}
        <motion.div
          animate={{
            scale: [0.85, 1.3, 0.95],
            opacity: [0.3, 0.65, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#4CAF50]/30 to-[#0B5D3F]/20 blur-2xl pointer-events-none"
        />

        {/* Floating Dew & Sparkle Particles */}
        {[
          { x: -28, y: -45, delay: 0.2, size: 4 },
          { x: 32, y: -55, delay: 0.8, size: 5 },
          { x: -15, y: -70, delay: 1.4, size: 3 },
          { x: 22, y: -80, delay: 2.0, size: 4 },
        ].map((p, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              y: [0, p.y],
              x: [0, p.x],
              scale: [0, 1.2, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
            style={{ width: p.size, height: p.size }}
            className="absolute rounded-full bg-gradient-to-r from-[#4CAF50] to-[#D6A95A] shadow-[0_0_8px_#4CAF50] pointer-events-none"
          />
        ))}

        {/* Plant Growth Container (Growing from small to big) */}
        <motion.div
          animate={{
            scale: [0.25, 0.7, 1.15, 1],
            opacity: [0.3, 0.8, 1, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: [0.34, 1.3, 0.64, 1],
          }}
          style={{ transformOrigin: "50% 90%" }}
          className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center drop-shadow-[0_10px_25px_rgba(76,175,80,0.25)]"
        >
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soil / Earth Mound */}
            <ellipse
              cx="60"
              cy="102"
              rx="32"
              ry="7"
              fill="#2D5A27"
              opacity="0.3"
            />
            <path
              d="M32 102 C 45 96, 75 96, 88 102 C 75 106, 45 106, 32 102 Z"
              fill="#1B4332"
            />
            <circle cx="52" cy="101" r="1.5" fill="#40916C" opacity="0.8" />
            <circle cx="68" cy="100" r="1.2" fill="#52B788" opacity="0.9" />
            <circle cx="60" cy="103" r="1.8" fill="#74C69D" opacity="0.8" />

            {/* Sprouting Main Stem */}
            <motion.path
              d="M60 100 C 60 85, 60 65, 60 40"
              stroke="url(#stemGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              initial={{ pathLength: 0.1, opacity: 0.3 }}
              animate={{
                pathLength: [0.2, 1, 1],
                opacity: [0.5, 1, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Left Leaf - Sprouts and Unfurls */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.15, 1],
                opacity: [0, 1, 1],
                rotate: [-20, -5, -10],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.35,
              }}
              style={{ transformOrigin: "60px 65px" }}
            >
              <path
                d="M60 65 C 45 60, 32 48, 36 34 C 48 35, 58 48, 60 65 Z"
                fill="url(#leafLeftGrad)"
                stroke="#1B4332"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M60 65 C 50 54, 42 44, 38 36"
                stroke="#74C69D"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </motion.g>

            {/* Right Leaf - Sprouts higher and blooms */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
                rotate: [20, 5, 12],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              style={{ transformOrigin: "60px 48px" }}
            >
              <path
                d="M60 48 C 76 44, 88 32, 84 18 C 72 20, 62 33, 60 48 Z"
                fill="url(#leafRightGrad)"
                stroke="#1B4332"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M60 48 C 70 38, 78 28, 82 20"
                stroke="#95D5B2"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </motion.g>

            {/* Top Tender Bud / Sprout Apex */}
            <motion.circle
              cx="60"
              cy="38"
              r="3.5"
              fill="#95D5B2"
              animate={{
                scale: [0.6, 1.3, 1],
                opacity: [0.5, 1, 0.8],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="stemGrad" x1="60" y1="100" x2="60" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1B4332" />
                <stop offset="60%" stopColor="#2D6A4F" />
                <stop offset="100%" stopColor="#52B788" />
              </linearGradient>
              <linearGradient id="leafLeftGrad" x1="36" y1="34" x2="60" y2="65" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="50%" stopColor="#2D6A4F" />
                <stop offset="100%" stopColor="#1B4332" />
              </linearGradient>
              <linearGradient id="leafRightGrad" x1="84" y1="18" x2="60" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#74C69D" />
                <stop offset="60%" stopColor="#40916C" />
                <stop offset="100%" stopColor="#1B4332" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
