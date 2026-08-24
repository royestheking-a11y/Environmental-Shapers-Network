import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Clock, Mail, Globe, ArrowRight } from "lucide-react";
import { useSettings } from "../utils/useSettings";

// Falling leaf animation
function FallingLeaf({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: "-5%" }}
      animate={{ y: ["0vh", "105vh"], x: [0, 40, -20, 30], rotate: [0, 180, 360] }}
      transition={{ duration: 12 + delay, delay, repeat: Infinity, ease: "linear" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2C6 2 2 8 2 14s4 8 10 8 10-6 10-8S18 2 12 2z" fill="#4CAF50" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

export function MaintenancePage() {
  const settings = useSettings();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#0a1a0e]" style={{ cursor: "none" }}>
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Forest"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0e]/95 via-[#0a1a0e]/80 to-[#0B5D3F]/40" />
      </div>

      {/* Falling Leaves */}
      {[1.5, 3, 0, 4.5, 2, 6, 8, 10].map((delay, i) => (
        <FallingLeaf key={i} delay={delay} x={5 + i * 12} />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#4CAF50]/30"
          style={{
            width: 3 + (i % 4),
            height: 3 + (i % 4),
            left: `${(i * 7.5) % 100}%`,
            top: `${(i * 8.3) % 100}%`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 4 + i * 0.5, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl w-full mx-4"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 md:p-14 shadow-2xl overflow-hidden relative">
          
          {/* Subtle glow inside card */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#4CAF50]/30 rounded-full blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#0B5D3F]/40 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Pulsing Icon */}
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#4CAF50]/20 rounded-full blur-xl"
              />
              <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md relative z-10 shadow-xl shadow-green-900/50">
                <Leaf size={36} className="text-[#4CAF50]" />
              </div>
            </div>

            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/20 border border-[#4CAF50]/40 text-[#4CAF50] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              Scheduled Maintenance
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              We're Planting <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
                New Seeds
              </span>
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10">
              {settings.siteName} is currently upgrading its platform to provide a better, faster, and more impactful experience for our global community.
            </p>

            {/* Actions / Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 bg-[#0B5D3F]/50 rounded-full flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[#4CAF50]" />
                </div>
                <div className="text-left">
                  <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">Status</div>
                  <div className="text-white text-sm font-medium">Upgrading Systems</div>
                </div>
              </div>

              <a
                href={`mailto:${settings?.contactEmail || "info@esnglobal.org"}`}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-4 group"
              >
                <div className="w-10 h-10 bg-[#4CAF50]/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-[#4CAF50]" />
                </div>
                <div className="text-left">
                  <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">Contact Support</div>
                  <div className="text-white text-sm font-medium group-hover:text-[#4CAF50] transition-colors">{settings?.contactEmail || "info@esnglobal.org"}</div>
                </div>
              </a>
            </div>

          </div>
        </div>

        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-white/40 text-sm flex items-center justify-center gap-2"
        >
          <Globe size={14} />
          {settings.siteName} will be back shortly. Thank you for your patience.
        </motion.div>
      </motion.div>
    </section>
  );
}
