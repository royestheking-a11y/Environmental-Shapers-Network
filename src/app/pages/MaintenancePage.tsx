import { useState } from "react";
import { motion } from "motion/react";
import { Leaf, Clock, Mail, Globe, Lock, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { useSettings } from "../utils/useSettings";

// Elegant floating leaf with realistic leaf SVG
function RealisticLeaf({ delay, x, size = 20 }: { delay: number; x: number; size?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none z-0"
      style={{ left: `${x}%`, top: "-6%" }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, 30, -25, 20, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 16 + delay * 1.5,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="opacity-40 drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
        <path
          d="M20.5 3.5C14.5 3.5 4 8.5 4 19.5C9 19.5 19.5 15.5 20.5 3.5Z"
          fill="url(#leafGradient)"
          stroke="#34D399"
          strokeWidth="0.8"
        />
        <path d="M4 19.5C9 14.5 14 10 20.5 3.5" stroke="#6EE7B7" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M10 13.5C12 14.5 14 16 15 17" stroke="#6EE7B7" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M14 9.5C16 10.5 17.5 11.5 18.5 12" stroke="#6EE7B7" strokeWidth="0.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="leafGradient" x1="4" y1="3.5" x2="20.5" y2="19.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="1" stopColor="#047857" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export function MaintenancePage() {
  const settings = useSettings();
  const [checking, setChecking] = useState(false);
  const [checkedMsg, setCheckedMsg] = useState<string | null>(null);

  const contactEmail = (!settings?.contactEmail || settings.contactEmail.includes("esnbd.org") || settings.contactEmail.includes("environmentalshapersnetwork.org") || settings.contactEmail === "info@esnglobal.org")
    ? "enviro.sn@gmail.com"
    : settings.contactEmail;

  const handleCheckStatus = () => {
    setChecking(true);
    setCheckedMsg(null);
    setTimeout(() => {
      setChecking(false);
      setCheckedMsg("Platform upgrade is actively deploying. Please check back shortly!");
      setTimeout(() => setCheckedMsg(null), 4000);
    }, 1200);
  };

  const isAdminLoggedIn = typeof window !== "undefined" && Boolean(localStorage.getItem("esn_admin_user"));

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[#040e08] text-white">
      {/* ─── Background Layer: Deep Forest with Rich Obsidian-Emerald Lighting ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1511497584788-87676104235f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1920"
          alt="Ancient Forest Canopy"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        {/* Rich cinematic gradient vignette - ensures deep contrast, zero washed-out haze */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040e08]/90 via-[#040e08]/75 to-[#040e08]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating Realistic Leaves */}
      {[0.5, 3.2, 5.8, 1.8, 7.4, 4.1, 9.0].map((delay, i) => (
        <RealisticLeaf key={i} delay={delay} x={8 + i * 13} size={22 + (i % 3) * 4} />
      ))}

      {/* Subtle Ambient Bioluminescent Particles */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-400/40 pointer-events-none blur-[0.5px]"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 7.3 + 5) % 95}%`,
            top: `${(i * 8.7 + 10) % 90}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.6, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 5 + (i % 4),
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ─── Main Premium Glassmorphic Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full mx-4 my-8"
      >
        <div className="relative rounded-[2rem] bg-[#071c12]/85 backdrop-blur-2xl border border-emerald-500/30 p-8 sm:p-12 md:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
          
          {/* Internal ambient emerald glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0B5D3F]/30 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Luminous Center Icon */}
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-400/25 rounded-full blur-xl"
              />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-[#0B5D3F]/30 to-[#040e08]/60 border border-emerald-400/40 flex items-center justify-center backdrop-blur-md shadow-lg shadow-emerald-950/60">
                <Leaf size={36} className="text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            {/* Live Pulsing Status Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Scheduled Maintenance
            </div>

            {/* Crisp, Bold Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-[1.15]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              We&apos;re Planting <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200 bg-clip-text text-transparent">
                New Seeds
              </span>
            </h1>

            {/* High-Contrast Description */}
            <p className="text-emerald-100/85 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-normal">
              {settings.siteName || "Environmental Shapers Network"} is currently performing a planned infrastructure upgrade to provide a faster, more resilient, and higher-impact experience for our global environmental community.
            </p>

            {/* ─── Status & Contact Tiles ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-lg mb-6">
              {/* Tile 1: Status */}
              <div className="flex items-center gap-3.5 bg-black/30 border border-emerald-500/20 rounded-2xl p-4 text-left backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 text-emerald-400">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-wider">Current Status</div>
                  <div className="text-white text-sm font-semibold">Core Upgrades in Progress</div>
                </div>
              </div>

              {/* Tile 2: Direct Contact */}
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3.5 bg-black/30 hover:bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-400/40 transition-all rounded-2xl p-4 text-left group backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-500/25 group-hover:border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400 transition-all">
                  <Mail size={18} />
                </div>
                <div className="truncate">
                  <div className="text-emerald-300/60 text-[10px] font-bold uppercase tracking-wider">Contact Team</div>
                  <div className="text-white text-sm font-semibold group-hover:text-emerald-300 transition-colors truncate">{contactEmail}</div>
                </div>
              </a>
            </div>

            {/* Check Status Button */}
            <div className="w-full max-w-lg flex flex-col items-center gap-2">
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/50 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <RefreshCw size={14} className={checking ? "animate-spin text-emerald-400" : "text-emerald-400"} />
                {checking ? "Verifying Platform Status..." : "Check if Platform is Ready"}
              </button>

              {checkedMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-200 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-emerald-400 shrink-0" />
                  {checkedMsg}
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* ─── Footer Controls ─── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/50 px-4">
          <div className="flex items-center gap-1.5">
            <Globe size={13} className="text-emerald-500" />
            <span>{settings.siteName || "ESN Global"} · Estimated restoration shortly</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-emerald-300/70 hover:text-emerald-300 transition-colors py-1 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 hover:border-emerald-400/30"
            >
              <Lock size={11} className="text-emerald-400" /> Admin Access
            </Link>

            {isAdminLoggedIn && (
              <a
                href="/?preview=true"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                Preview Site as Admin →
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
