import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HeartHandshake } from "lucide-react";

const rightImages = [
  "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg",
  "/canada journey.jpeg",
];

import { getInitialHeroSlides } from "../../pages/admin/sections/HeroAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";

const defaultSlides = [
  {
    tag: "Global Environmental Action",
    heading: "Taking Small Strides to\nPreserve Our Planet",
    sub: "Ecology, as a field of science, investigates the interconnections between living organisms and their surroundings, encompassing both the physical and chemical aspects.",
  },
  {
    tag: "Nature-Based Solutions",
    heading: "Together We Restore,\nProtect & Innovate",
    sub: "From reforestation to marine conservation, ESN leads science-driven environmental action across 80+ countries, shaping a sustainable future for generations to come.",
  },
  {
    tag: "Youth Climate Leadership",
    heading: "Shaping the Leaders\nof Tomorrow Today",
    sub: "Our youth programs empower the next generation of environmental advocates with the knowledge, tools, and networks to drive meaningful change globally.",
  },
];

// Circular spinning text badge
function SpinningBadge() {
  const text = "Save The Environment • Save The Environment • ";
  const chars = text.split("");
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const charAngle = 360 / chars.length;

  return (
    <div className="w-40 h-40 relative animate-[spin_12s_linear_infinite]">
      <svg viewBox="0 0 130 130" className="w-full h-full absolute inset-0">
        <circle cx="65" cy="65" r={radius} fill="none" />
        {chars.map((char, i) => {
          const angle = i * charAngle - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 65 + radius * Math.cos(rad);
          const y = 65 + radius * Math.sin(rad);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
              fontSize="7.5"
              fontWeight="600"
              fill="white"
              letterSpacing="0.5"
            >
              {char}
            </text>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6 2 2 8 2 14s4 8 10 8 10-6 10-8S18 2 12 2z" fill="white" />
            <line x1="12" y1="22" x2="12" y2="12" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Falling leaf animation
function FallingLeaf({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: "-5%" }}
      animate={{ y: ["0vh", "105vh"], x: [0, 40, -20, 30], rotate: [0, 180, 360] }}
      transition={{ duration: 12 + delay, delay, repeat: Infinity, ease: "linear" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M12 2C6 2 2 8 2 14s4 8 10 8 10-6 10-8S18 2 12 2z" fill="#4CAF50" opacity="0.55" />
      </svg>
    </motion.div>
  );
}

export function HeroSection() {
  const [slides, setSlides, loading] = useFirestoreData<any[]>("esn_hero_admin", getInitialHeroSlides());
  const [slide, setSlide] = useState(0);

  // Interactive click-to-grow plants state
  const [plants, setPlants] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleHeroClick = (e: React.MouseEvent) => {
    // Only capture if they didn't click on a button/link
    if ((e.target as HTMLElement).closest('button, a')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPlant = { id: Date.now(), x, y };
    setPlants(prev => [...prev, newPlant]);
    
    // Automatically remove the plant after 4 seconds to avoid DOM bloat
    setTimeout(() => {
      setPlants(prev => prev.filter(p => p.id !== newPlant.id));
    }, 4000);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(() => {
      setSlide((p) => (p + 1) % slides.length);
    }, 8000);
    return () => clearInterval(t);
  }, [slides]);

  const currentSlide = slides[slide];

  return (
    <section 
      onClick={handleHeroClick}
      className="relative min-h-screen overflow-hidden flex items-center bg-[#0a1a0e] cursor-crosshair"
    >
      {/* Click-spawned interactive plants */}
      <AnimatePresence>
        {plants.map(plant => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute z-[100] pointer-events-none"
            style={{ left: plant.x, top: plant.y, x: "-50%", y: "-100%" }}
          >
            <svg width="110" height="150" viewBox="0 0 80 100" fill="none" className="drop-shadow-[0_0_30px_rgba(76,175,80,0.6)]">
              <defs>
                <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#2E7D32" />
                  <stop offset="100%" stopColor="#81C784" />
                </linearGradient>
                <linearGradient id="leafGradLeft" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#C8E6C9" />
                </linearGradient>
                <linearGradient id="leafGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#388E3C" />
                  <stop offset="100%" stopColor="#A5D6A7" />
                </linearGradient>
              </defs>
              
              {/* Stem */}
              <motion.path 
                d="M40 100 Q35 55 40 10" 
                stroke="url(#stemGrad)" 
                strokeWidth="5" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              {/* Bottom Right Leaf */}
              <motion.g style={{ transformOrigin: "38px 80px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.75, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 350, damping: 15 }}>
                <path d="M38 80 C55 80, 60 65, 55 55 C45 60, 38 70, 38 80 Z" fill="url(#leafGradRight)"/>
                <path d="M38 80 Q45 70 52 58" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              </motion.g>

              {/* Bottom Left Leaf */}
              <motion.g style={{ transformOrigin: "37px 60px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.7, opacity: 1 }} transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 15 }}>
                <path d="M37 60 C20 60, 15 45, 20 35 C30 40, 37 50, 37 60 Z" fill="url(#leafGradLeft)"/>
                <path d="M37 60 Q27 50 23 39" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              </motion.g>
              
              {/* Top Right leaf group */}
              <motion.g style={{ transformOrigin: "40px 40px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 350, damping: 15 }}>
                <path d="M40 40 C60 40, 70 20, 65 10 C50 15, 40 25, 40 40 Z" fill="url(#leafGradRight)" />
                <path d="M40 40 Q55 25 62 14" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </motion.g>

              {/* Top Left leaf group */}
              <motion.g style={{ transformOrigin: "40px 20px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.9, opacity: 1 }} transition={{ delay: 0.65, type: "spring", stiffness: 350, damping: 15 }}>
                <path d="M40 20 C20 20, 10 10, 15 0 C25 5, 40 10, 40 20 Z" fill="url(#leafGradLeft)" />
                <path d="M40 20 Q25 10 17 3" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </motion.g>

              {/* Magical Sparkles */}
              <motion.circle cx="60" cy="15" r="2.5" fill="#A5D6A7" 
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -8 }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              />
              <motion.circle cx="15" cy="30" r="2" fill="#C8E6C9" 
                initial={{ scale: 0, opacity: 0, y: 8 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -12 }}
                transition={{ delay: 0.7, duration: 1.2, ease: "easeInOut" }}
              />
              <motion.circle cx="35" cy="5" r="2.5" fill="#E8F5E9" 
                initial={{ scale: 0, opacity: 0, y: 15 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -15 }}
                transition={{ delay: 0.85, duration: 1.4, ease: "easeInOut" }}
              />
              <motion.circle cx="65" cy="55" r="1.5" fill="#81C784" 
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -10 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Full BG image */}
      <div className="absolute inset-0">
        <img
          src="/Commonwealth Secretariat at COP27.jpeg"
          alt="Forest"
          className="w-full h-full object-cover opacity-50"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a0e]/95 via-[#0a1a0e]/75 to-[#0a1a0e]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0e]/60 via-transparent to-[#0a1a0e]/80" />
      </div>

      {/* Falling Leaves */}
      {[1.5, 3, 0, 4.5, 2, 6].map((delay, i) => (
        <FallingLeaf key={i} delay={delay} x={10 + i * 15} />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 16 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#4CAF50]/40"
          style={{
            width: 3 + (i % 4),
            height: 3 + (i % 4),
            left: `${(i * 6.5) % 100}%`,
            top: `${(i * 7.3) % 100}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4 + i * 0.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* LEFT: Text Column */}
          <div className="flex flex-col justify-center">
            {/* Tag pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${slide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#4CAF50]/20 border border-[#4CAF50]/40 text-[#4CAF50] text-sm font-semibold px-4 py-2 rounded-full mb-7 w-fit"
              >
                <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
                {currentSlide.tag}
              </motion.div>
            </AnimatePresence>

            {/* Main heading */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h-${slide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-white mb-6 leading-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                  fontWeight: 800,
                  whiteSpace: "pre-line",
                }}
              >
                {currentSlide.heading}
              </motion.h1>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`p-${slide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-white/65 leading-relaxed mb-10 max-w-lg"
                style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}
              >
                {currentSlide.sub}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/projects"
                className="flex items-center justify-center h-[52px] gap-2.5 bg-[#4CAF50] hover:bg-[#43a047] border border-transparent text-white px-8 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/40 group"
              >
                Learn More
              </Link>
              <Link
                to="/donate"
                className="flex items-center justify-center h-[52px] gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-8 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 backdrop-blur-md group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <HeartHandshake size={12} className="text-white" />
                </div>
                Donate Now
              </Link>
            </motion.div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 mt-12">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`transition-all duration-400 rounded-full ${i === slide ? "w-8 h-2 bg-[#4CAF50]" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Image collage */}
          <div className="hidden lg:flex relative h-[520px] items-center justify-center">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="absolute top-8 right-0 w-60 h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
              style={{ rotate: -4 }}
            >
              <img
                src="/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg"
                alt="Speaking at CEPCA 2024"
                className="w-full h-full object-cover"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D3F]/30 to-transparent" />
            </motion.div>

            {/* Second image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute bottom-8 left-0 w-56 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <img
                src="/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg"
                alt="Representing Coastal Communities"
                className="w-full h-full object-cover"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B5D3F]/30 to-transparent" />
            </motion.div>

            {/* Center image (larger) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 z-10"
            >
              <img
                src="/meeting time.jpeg"
                alt="Meeting and collaboration"
                className="w-full h-full object-cover"
                decoding="async"
              />
            </motion.div>

            {/* Spinning badge — moved to empty bottom-right area */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute bottom-0 right-0 z-20 w-40 h-40 bg-[#0B5D3F]/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-[#4CAF50]/40 shadow-2xl"
            >
              <SpinningBadge />
            </motion.div>


          </div>
        </div>

        {/* Bottom scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
