import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  Leaf, Target, Globe2, Users, Award, Calendar, ChevronRight,
  TreePine, Heart, Star, Sprout, Shield, Lightbulb, HandHeart,
  ArrowRight, Quote, MapPin, ExternalLink, Check, Zap, BookOpen, Sun,
  X, ArrowUpRight, Sparkles
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { useFirestoreData } from "../../lib/useFirestore";
import { getInitialStats, StatItem } from "./admin/sections/StatsAdminView";
import { getInitialMissionValues, MissionValue } from "./admin/sections/MissionAdminView";
import {
  initialHeroData, initialStoryData, initialMilestones, initialTeamMembers,
  initialVisionMissionData, initialGlobalPresenceData,
  AboutHeroData, AboutStoryData, AboutMilestone, AboutTeamMember,
  AboutVisionMissionData, AboutGlobalPresenceData
} from "./admin/sections/AboutPageAdminView";

export function resolveIcon(name: string) {
  const Icon = (LucideIcons as any)[name];
  return Icon || LucideIcons.HelpCircle;
}



const partners = [
  "United Nations", "WWF Global", "UNDP", "GreenPeace", "IUCN", "World Bank", "C40 Cities", "Bloomberg Philanthropies"
];

const recognitions = [
  { title: "Time 100 Next", year: "2022", desc: "Imran Hossain named among the most influential emerging leaders shaping the future." },
  { title: "UN ECOSOC Status", year: "2019", desc: "Special Consultative Status with the United Nations Economic and Social Council." },
  { title: "Earthshot Prize Finalist", year: "2023", desc: "Shortlisted for Prince William's environmental prize for our Sundarbans restoration." },
  { title: "Fast Company World Changing Ideas", year: "2024", desc: "Recognized for our open-source environmental monitoring platform." },
];

function FallingLeaf({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
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

export default function About() {
  const heroRef = useRef(null);
  
  // Data hooks
  const [heroData] = useFirestoreData<AboutHeroData>("esn_about_hero", initialHeroData);
  const [storyData] = useFirestoreData<AboutStoryData>("esn_about_story", initialStoryData);
  const [milestonesData] = useFirestoreData<AboutMilestone[]>("esn_about_milestones", initialMilestones);
  const [teamData] = useFirestoreData<AboutTeamMember[]>("esn_about_team", initialTeamMembers);
  const [valuesData] = useFirestoreData<MissionValue[]>("esn_mission_admin", getInitialMissionValues());
  const [statsData] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
  const [visionMissionData] = useFirestoreData<AboutVisionMissionData>("esn_about_vision_mission", initialVisionMissionData);
  const [presenceData] = useFirestoreData<AboutGlobalPresenceData>("esn_about_global_presence", initialGlobalPresenceData);

  // Filter team
  const founderTeam = teamData.filter(t => t.category === "Founder");
  const bdTeamList = teamData.filter(t => t.category === "BD");
  const globalTeamList = teamData.filter(t => t.category === "Global");
  const advisorTeamList = teamData.filter(t => t.category === "Advisor");
  const [selectedMember, setSelectedMember] = useState<AboutTeamMember | null>(null);

  // Interactive click-to-grow plants state
  const [plants, setPlants] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleHeroClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPlant = { id: Date.now(), x, y };
    setPlants(prev => [...prev, newPlant]);
    setTimeout(() => {
      setPlants(prev => prev.filter(p => p.id !== newPlant.id));
    }, 4000);
  };

  return (
    <div className="pt-20 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section 
        onClick={handleHeroClick}
        className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#071a0f] via-[#0B5D3F] to-[#173B63] overflow-hidden cursor-crosshair"
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
                  <linearGradient id="stemGradAbout" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#2E7D32" />
                    <stop offset="100%" stopColor="#81C784" />
                  </linearGradient>
                  <linearGradient id="leafGradLeftAbout" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#4CAF50" />
                    <stop offset="100%" stopColor="#C8E6C9" />
                  </linearGradient>
                  <linearGradient id="leafGradRightAbout" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#388E3C" />
                    <stop offset="100%" stopColor="#A5D6A7" />
                  </linearGradient>
                </defs>
                <motion.path d="M40 100 Q35 55 40 10" stroke="url(#stemGradAbout)" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} />
                <motion.g style={{ transformOrigin: "38px 80px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.75, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 350, damping: 15 }}>
                  <path d="M38 80 C55 80, 60 65, 55 55 C45 60, 38 70, 38 80 Z" fill="url(#leafGradRightAbout)"/>
                  <path d="M38 80 Q45 70 52 58" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </motion.g>
                <motion.g style={{ transformOrigin: "37px 60px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.7, opacity: 1 }} transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 15 }}>
                  <path d="M37 60 C20 60, 15 45, 20 35 C30 40, 37 50, 37 60 Z" fill="url(#leafGradLeftAbout)"/>
                  <path d="M37 60 Q27 50 23 39" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </motion.g>
                <motion.g style={{ transformOrigin: "40px 40px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 350, damping: 15 }}>
                  <path d="M40 40 C60 40, 70 20, 65 10 C50 15, 40 25, 40 40 Z" fill="url(#leafGradRightAbout)" />
                  <path d="M40 40 Q55 25 62 14" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                </motion.g>
                <motion.g style={{ transformOrigin: "40px 20px" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 0.9, opacity: 1 }} transition={{ delay: 0.65, type: "spring", stiffness: 350, damping: 15 }}>
                  <path d="M40 20 C20 20, 10 10, 15 0 C25 5, 40 10, 40 20 Z" fill="url(#leafGradLeftAbout)" />
                  <path d="M40 20 Q25 10 17 3" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                </motion.g>
                <motion.circle cx="60" cy="15" r="2.5" fill="#A5D6A7" initial={{ scale: 0, opacity: 0, y: 10 }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -8 }} transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }} />
                <motion.circle cx="15" cy="30" r="2" fill="#C8E6C9" initial={{ scale: 0, opacity: 0, y: 8 }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -12 }} transition={{ delay: 0.7, duration: 1.2, ease: "easeInOut" }} />
                <motion.circle cx="35" cy="5" r="2.5" fill="#E8F5E9" initial={{ scale: 0, opacity: 0, y: 15 }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -15 }} transition={{ delay: 0.85, duration: 1.4, ease: "easeInOut" }} />
                <motion.circle cx="65" cy="55" r="1.5" fill="#81C784" initial={{ scale: 0, opacity: 0, y: 10 }} animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], y: -10 }} transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }} />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B5D3F]/40 to-[#071a0f]/80" />
        </div>

        {/* Falling Leaves */}
        {[1.5, 3, 0, 4.5, 2, 6].map((delay, i) => (
          <FallingLeaf key={i} delay={delay} x={10 + i * 15} />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 16 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#4CAF50]/40 z-10"
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

        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D6A95A]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#173B63]/20 rounded-full blur-3xl" />

        <div className="relative w-full max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
                <Leaf size={12} className="text-[#4CAF50]" /> {heroData?.foundedText || "Founded 2019 · Dhaka, Bangladesh"}
              </div>
              <h1 className="text-white mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {heroData?.title1 || "Shaping the World's"}<br />
                <span className="text-[#4CAF50]">{heroData?.title2 || "Environmental Future"}</span>
              </h1>
              <p className="text-white/75 text-xl leading-relaxed mb-8 max-w-lg">
                {heroData?.description || "We are a global movement of scientists, advocates, and community leaders united by one conviction: a healthy planet is not a privilege — it is the foundation of human dignity."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/projects" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105 shadow-lg shadow-[#4CAF50]/30">
                  See Our Work <ArrowRight size={16} />
                </Link>
                <Link to="/donate" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all">
                  Support the Mission
                </Link>
              </div>
            </motion.div>

            {/* Right — stat cards grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-2 gap-4">
              {[
                { v: "80+", l: "Countries", icon: Globe2 },
                { v: "1.2M+", l: "Trees Planted", icon: TreePine },
                { v: "12K+", l: "Local Chapters", icon: Users },
                { v: "7 Yrs", l: "Of Impact", icon: Calendar },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/10 border border-white/15 backdrop-blur-md rounded-3xl p-6 text-center hover:bg-white/15 transition-all"
                >
                  <div className="w-12 h-12 bg-[#4CAF50]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <s.icon size={22} className="text-[#4CAF50]" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.v}</div>
                  <div className="text-white/60 text-sm font-medium">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-5 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Who We Are ─────────────────────────────────────────────────────── */}
      <section className="py-0 bg-white overflow-hidden">
        {/* Top editorial strip */}
        <div className="bg-[#F6FBF8] border-b border-[#4CAF50]/15 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="text-[#4CAF50] text-xs font-black uppercase tracking-[0.3em]">Who We Are</span>
            <div className="flex-1 h-px bg-[#4CAF50]/20" />
            <span className="text-gray-400 text-xs font-medium">Est. 2019 · Dhaka, Bangladesh</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* === MAIN SPLIT LAYOUT === */}
          <div className="grid lg:grid-cols-[1fr_480px] gap-0 lg:gap-16 py-16 lg:py-24 items-start">

            {/* LEFT — Story + Quote */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              {/* Large editorial headline */}
              <h2 className="text-[#0B5D3F] leading-[1.1] mb-8 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900 }}>
                {storyData?.headline1 || "Born from Urgency,"}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F]">{storyData?.headline2 || "Sustained by Purpose"}</span>
              </h2>

              {/* Founding Quote Card — glassmorphic */}
              <div className="relative bg-gradient-to-br from-[#0B5D3F] to-[#0a4d33] rounded-2xl p-7 mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D6A95A]/10 rounded-full blur-2xl" />
                <div className="relative">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="mb-4 opacity-60">
                    <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.2 6.4 6.4 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0l1.6 2.4C30.4 3.6 27.2 6.4 26.4 10.4H32V24H20z" fill="#4CAF50"/>
                  </svg>
                  <p className="text-white/90 text-lg leading-relaxed font-medium italic mb-4">
                    {storyData?.quoteText || "\"When the floods came and scientists confirmed climate change as the cause, we realized that hope without action was just a comfortable lie. We had to build something real.\""}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-[#4CAF50]" />
                    <span className="text-[#A5D6A7] text-sm font-bold">{storyData?.quoteAuthor || "Imran Hossain & Abu Hanif · Co-Founders"}</span>
                  </div>
                </div>
              </div>

              {/* Story paragraphs */}
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>{storyData?.paragraph1 || ""}</p>
                <p>{storyData?.paragraph2 || ""}</p>
                <p dangerouslySetInnerHTML={{ __html: storyData?.paragraph3 || "" }} />
              </div>

              {/* Proof points */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Science-informed, community-owned model" },
                  { label: "70%+ of leadership from Global South" },
                  { label: "Open-source data & transparent finances" },
                ].map((t, i) => (
                  <motion.div
                    key={t.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-2.5 bg-[#F6FBF8] rounded-xl p-4 border border-[#4CAF50]/15"
                  >
                    <div className="w-5 h-5 bg-[#4CAF50] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 leading-snug">{t.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Image Stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="order-1 lg:order-2 relative"
            >
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#0B5D3F]/15 h-[320px] sm:h-[400px] lg:h-[520px] relative">
                <ImageWithFallback
                  src="/canada conference.jpeg"
                  alt="ESN conference"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay with stat */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a0f]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { v: "80+", l: "Countries" },
                      { v: "1.2M+", l: "Trees Planted" },
                      { v: "7 Yrs", l: "Of Impact" },
                    ].map((s) => (
                      <div key={s.l} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-center">
                        <div className="text-white font-black text-lg leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.v}</div>
                        <div className="text-white/70 text-[10px] font-semibold mt-0.5 uppercase tracking-wider">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating secondary image */}
              <div className="absolute -bottom-6 -right-3 lg:-right-8 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-10">
                <ImageWithFallback
                  src="/represent bangladesh.jpeg"
                  alt="ESN Bangladesh team"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating award badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-3 lg:-left-6 bg-white rounded-2xl p-4 shadow-2xl border border-[#D6A95A]/20 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#D6A95A]/20 to-[#D6A95A]/5 rounded-xl flex items-center justify-center shrink-0">
                    <Award size={20} className="text-[#D6A95A]" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm whitespace-nowrap">UN Recognized</div>
                    <div className="text-[11px] text-gray-500 whitespace-nowrap">ECOSOC Special Status</div>
                  </div>
                </div>
              </motion.div>

              {/* Margin bottom on mobile for floating elements */}
              <div className="h-8 lg:h-0" />
            </motion.div>
          </div>
        </div>

        {/* Bottom accent bar — Key pillars */}
        <div className="border-t border-gray-100 bg-[#F6FBF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {valuesData.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0B5D3F] transition-colors">
                    {(() => {
                      const Icon = resolveIcon(p.iconName || "");
                      return <Icon size={18} className="text-[#0B5D3F] group-hover:text-white transition-colors" />;
                    })()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{p.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{p.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ── Premium Vision & Mission ──────────────────────────────────────────────────────── */}
      <section className="relative py-32 bg-[#071a0f] overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4CAF50]/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D6A95A]/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8cGF0aCBkPSJNNjAgNTl2MWgtNjB2LTFoNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 text-xs font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-widest shadow-[0_0_15px_rgba(76,175,80,0.2)]">
                <Target size={14} /> Our Core Purpose
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                From Action <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#D6A95A]">to Impact</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative">
            {/* Center Divider Line for Desktop */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[#4CAF50]/50 via-white/20 to-[#D6A95A]/50" />

            {/* LEFT: MISSION (The Work Today) */}
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-5 mb-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4CAF50]/30">
                    <Target size={30} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Mission</h3>
                    <p className="text-[#4CAF50] font-semibold tracking-widest uppercase text-xs mt-1.5">The Work Today</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {visionMissionData.missionItems.map((item, index) => (
                    <div key={item.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#4CAF50]/40 transition-all duration-300 group">
                      <div className="flex gap-5">
                        <div className="w-12 h-12 rounded-full bg-[#4CAF50]/20 flex items-center justify-center shrink-0 border border-[#4CAF50]/30 group-hover:scale-110 transition-transform">
                          <span className="text-[#4CAF50] font-black text-lg">0{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/60 leading-relaxed text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT: VISION (The 2050 Goal) */}
            <div className="relative z-10 lg:pt-32">
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="flex items-center gap-5 mb-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D6A95A] to-[#9E6B3C] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D6A95A]/30">
                    <Globe2 size={30} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Vision 2050</h3>
                    <p className="text-[#D6A95A] font-semibold tracking-widest uppercase text-xs mt-1.5">The Future We're Building</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {visionMissionData.visionItems.map(item => (
                    <div key={item.id} className="bg-[#D6A95A]/10 backdrop-blur-md rounded-2xl p-6 border border-[#D6A95A]/20 hover:border-[#D6A95A]/50 transition-all duration-300 group">
                      <div className="flex gap-5">
                        <div className="mt-1 w-8 h-8 rounded-full bg-[#D6A95A]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Check size={14} className="text-[#D6A95A]" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-white/70 leading-relaxed text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mega Vision Card */}
                  <div className="bg-gradient-to-br from-[#D6A95A] to-[#9E6B3C] rounded-2xl p-8 shadow-2xl shadow-[#D6A95A]/20 relative overflow-hidden group mt-8">
                    <Globe2 className="absolute -right-6 -bottom-6 text-white/20 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black text-white mb-3 tracking-tight">{visionMissionData.megaVisionTitle}</h4>
                      <p className="text-white/90 leading-relaxed text-sm font-medium">
                        {visionMissionData.megaVisionDescription}
                      </p>
                      <Link to="/projects" className="mt-6 inline-flex items-center gap-2 text-[#9E6B3C] font-bold text-sm bg-white px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all shadow-lg">
                        See 2050 Roadmap <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

{/* ── Impact Statistics ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="https://images.unsplash.com/photo-1683221704109-acdeb0883037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&auto=format&q=60&w=800" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Target size={12} className="text-[#4CAF50]" /> Impact at Scale
            </div>
            <h2 className="text-white mb-4">7 Years. One Planet.<br />Measurable Impact.</h2>
            <p className="text-white/65 text-lg max-w-xl mx-auto">Every number represents communities protected, ecosystems restored, and futures secured.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/8 border border-white/12 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/12 transition-all group"
              >
                <div className="w-14 h-14 bg-[#4CAF50]/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#4CAF50]/30 transition-all">
                  {(() => {
                    const Icon = resolveIcon(s.iconName || "");
                    return <Icon size={26} className="text-[#4CAF50]" />;
                  })()}
                </div>
                <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}{s.suffix}</div>
                <div className="text-white font-semibold mb-1">{s.label}</div>
                <div className="text-white/50 text-sm">{s.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ── Advisors ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#D6A95A]/10 text-[#9E6B3C] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Star size={12} fill="currentColor" /> Advisors
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Our Advisory Board</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Guided by leading experts in climate science, policy, and community organizing.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisorTeamList.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F6FBF8] rounded-3xl p-8 border border-[#4CAF50]/10 hover:shadow-xl hover:shadow-[#0B5D3F]/5 transition-all group flex flex-col sm:flex-row gap-6 items-start"
              >
                {member.img ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-[#0B5D3F]/10 to-[#173B63]/10">
                    <ImageWithFallback src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gradient-to-br from-[#0B5D3F]/10 to-[#173B63]/10 flex items-center justify-center text-[#0B5D3F] font-black text-xl border border-[#0B5D3F]/10">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 mb-1 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{member.name}</h4>
                  <p className="text-[#0B5D3F] text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* ── Leadership Team ───────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Users size={12} /> Global Team
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Global Leadership Team</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Scientists, strategists, community organizers, and technologists — united by an unshakeable belief in collective action.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...founderTeam, ...globalTeamList].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100/90 hover:border-[#0B5D3F]/25 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
                {/* Profile Showcase Portrait */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#0B5D3F]/10 via-[#F6FBF8] to-[#173B63]/10">
                  {member.img ? (
                    <ImageWithFallback
                      src={member.img}
                      alt={member.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                        member.imagePosition === "center"
                          ? "object-center"
                          : member.imagePosition === "bottom"
                          ? "object-bottom"
                          : "object-top"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0B5D3F]/15 via-[#F6FBF8] to-[#173B63]/10 p-6">
                      <div className="w-24 h-24 rounded-full bg-white shadow-md border border-[#0B5D3F]/20 flex items-center justify-center text-[#0B5D3F] font-black text-3xl tracking-wider">
                        {member.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <span className="mt-3 text-xs font-bold text-[#0B5D3F]/70 tracking-widest uppercase">ESN Leadership</span>
                    </div>
                  )}

                  {/* Gradient Vignette (bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity pointer-events-none" />

                  {/* Category badge - Unobtrusive at top right */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0B5D3F] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md border border-white/40">
                    <Sparkles size={11} className="text-[#4CAF50]" />
                    <span>{member.category || "Leader"}</span>
                  </div>

                  {/* Location pill - Natural position at bottom left */}
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-black/55 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                    <MapPin size={11} className="text-[#4CAF50]" />
                    <span>{member.country || "Global"}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-xl mb-1 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {member.name}
                    </h4>
                    <p className="text-[#0B5D3F] text-sm font-bold mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Tags */}
                    {member.tags && member.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {member.tags.map((tag) => (
                          <span key={tag} className="text-[11px] font-bold bg-[#0B5D3F]/8 text-[#0B5D3F] px-3 py-1 rounded-full border border-[#0B5D3F]/12">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Showcase Action Link */}
                  <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0B5D3F] group-hover:text-[#4CAF50] transition-colors mt-auto">
                    <span>View Profile Showcase</span>
                    <div className="w-7 h-7 rounded-full bg-[#0B5D3F]/8 flex items-center justify-center group-hover:bg-[#0B5D3F] group-hover:text-white transition-all">
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BD Team ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <MapPin size={12} /> BD Team
            </div>
            <h2 className="text-[#0B5D3F] mb-4">Bangladesh Leadership</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">The dedicated team leading our grassroots initiatives and national campaigns in Bangladesh.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bdTeamList.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100/90 hover:border-[#4CAF50]/30 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
                {/* Profile Showcase Portrait */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#0B5D3F]/10 via-[#F6FBF8] to-[#173B63]/10">
                  {member.img ? (
                    <ImageWithFallback
                      src={member.img}
                      alt={member.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                        member.imagePosition === "center"
                          ? "object-center"
                          : member.imagePosition === "bottom"
                          ? "object-bottom"
                          : "object-top"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4CAF50]/15 via-[#F6FBF8] to-[#0B5D3F]/10 p-6">
                      <div className="w-24 h-24 rounded-full bg-white shadow-md border border-[#4CAF50]/20 flex items-center justify-center text-[#0B5D3F] font-black text-3xl tracking-wider">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="mt-3 text-xs font-bold text-[#0B5D3F]/70 tracking-widest uppercase">Bangladesh Team</span>
                    </div>
                  )}

                  {/* Gradient Vignette (bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity pointer-events-none" />

                  {/* Category badge */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0B5D3F] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md border border-white/40">
                    <Sparkles size={11} className="text-[#4CAF50]" />
                    <span>BD Chapter</span>
                  </div>

                  {/* Location pill */}
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-black/55 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                    <MapPin size={11} className="text-[#4CAF50]" />
                    <span>{member.country || "Bangladesh"}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-xl mb-1 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {member.name}
                    </h4>
                    <p className="text-[#0B5D3F] text-sm font-bold mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Tags */}
                    {member.tags && member.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {member.tags.map((tag) => (
                          <span key={tag} className="text-[11px] font-bold bg-[#4CAF50]/10 text-[#0B5D3F] px-3 py-1 rounded-full border border-[#4CAF50]/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Showcase Action Link */}
                  <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0B5D3F] group-hover:text-[#4CAF50] transition-colors mt-auto">
                    <span>View Profile Showcase</span>
                    <div className="w-7 h-7 rounded-full bg-[#4CAF50]/15 flex items-center justify-center group-hover:bg-[#0B5D3F] group-hover:text-white transition-all">
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profile Showcase Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedMember(null)}
                aria-label="Close profile showcase"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition-all hover:scale-105"
              >
                <X size={18} />
              </button>

              <div className="grid sm:grid-cols-5">
                {/* Portrait showcase */}
                <div className="sm:col-span-2 relative aspect-[4/5] sm:aspect-auto sm:min-h-full bg-gradient-to-br from-[#0B5D3F]/15 to-[#173B63]/15 overflow-hidden">
                  {selectedMember.img ? (
                    <ImageWithFallback
                      src={selectedMember.img}
                      alt={selectedMember.name}
                      className={`w-full h-full object-cover ${
                        selectedMember.imagePosition === "center"
                          ? "object-center"
                          : selectedMember.imagePosition === "bottom"
                          ? "object-bottom"
                          : "object-top"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F6FBF8]">
                      <div className="w-24 h-24 rounded-full bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center font-black text-3xl">
                        {selectedMember.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                    <MapPin size={12} className="text-[#4CAF50]" />
                    <span>{selectedMember.country || "Global"}</span>
                  </div>
                </div>

                {/* Profile details */}
                <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                      <Sparkles size={11} className="text-[#4CAF50]" />
                      {selectedMember.category} Leadership
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {selectedMember.name}
                    </h3>
                    <p className="text-[#0B5D3F] font-bold text-sm mb-4 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                      {selectedMember.role}
                    </p>

                    <div className="h-px bg-gray-100 my-4" />

                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Executive Biography</h5>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                      {selectedMember.bio}
                    </p>

                    {selectedMember.tags && selectedMember.tags.length > 0 && (
                      <div>
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Focus Areas & Expertise</h5>
                        <div className="flex gap-2 flex-wrap">
                          {selectedMember.tags.map(tag => (
                            <span key={tag} className="text-xs font-bold bg-[#4CAF50]/10 text-[#0B5D3F] px-3 py-1 rounded-full border border-[#4CAF50]/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Environmental Shapers Network</span>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="text-xs font-bold bg-[#0B5D3F] text-white px-4 py-2 rounded-xl hover:bg-[#0a5237] transition-all"
                    >
                      Close Showcase
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

{/* ── Timeline ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest">
              <Calendar size={12} /> Our Journey
            </div>
            <h2 className="text-[#0B5D3F] mb-4">A Decade of Milestones</h2>
            <p className="text-gray-500 text-lg">From one mangrove project to a global network — every step on the map.</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#4CAF50] via-[#0B5D3F] to-[#173B63] md:-translate-x-0.5" />

            <div className="flex flex-col gap-14">
              {milestonesData.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`relative flex items-start gap-0 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot — centered on the line */}
                  <div
                    className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center"
                    style={{ backgroundColor: m.color }}
                  >
                    {(() => {
                      const Icon = resolveIcon(m.iconName || "");
                      return <Icon size={10} className="text-white" />;
                    })()}
                  </div>

                  {/* Year bubble — opposite side on desktop */}
                  <div className={`hidden md:flex md:w-1/2 items-center ${i % 2 === 0 ? "justify-end pr-12" : "justify-start pl-12"}`}>
                    <div className="text-4xl font-black" style={{ color: m.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.year}</div>
                  </div>

                  {/* Content card */}
                  <div className={`md:w-1/2 ml-20 md:ml-0 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                    <div className="bg-[#F6FBF8] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "20" }}>
                          {(() => {
                            const Icon = resolveIcon(m.iconName || "");
                            return <Icon size={16} style={{ color: m.color }} />;
                          })()}
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest md:hidden" style={{ color: m.color }}>{m.year}</div>
                          <div className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.title}</div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
{/* ── Global Presence ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                <Globe2 size={12} /> Global Presence
              </div>
              <h2 className="text-[#0B5D3F] mb-6">Rooted Locally,<br />Acting Globally</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {presenceData.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {presenceData.regions.map((r) => (
                  <div key={r.region} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:border-[#0B5D3F]/20 transition-all duration-300 group hover:-translate-y-1">
                    <div 
                      className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: `${r.color}15`, color: r.color }}
                    >
                      {(() => {
                        const Icon = resolveIcon(r.iconName || "");
                        return <Icon size={20} />;
                      })()}
                    </div>
                    <div className="text-sm font-bold text-gray-800 group-hover:text-[#0B5D3F] transition-colors">{r.region}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{r.countries}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1580696499419-84ca9688f947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Global impact"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#0B5D3F]/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Latest Milestone</div>
                  <div className="font-black text-gray-900 mb-1">{presenceData.milestoneTitle}</div>
                  <div className="text-sm text-gray-500">{presenceData.milestoneLocationDate}</div>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                    <div className="h-full bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F] rounded-full" style={{ width: `${presenceData.milestoneProgress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                    <span>{presenceData.milestoneProgress}% completed</span>
                    <span>{presenceData.milestoneGoal}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0f] via-[#0B5D3F] to-[#173B63]" />
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&auto=format&q=60&w=800" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D6A95A]/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
              <Leaf size={12} className="text-[#4CAF50]" /> Join the Movement
            </div>
            <h2 className="text-white mb-6 leading-tight">
              The Planet Needs<br />
              <span className="text-[#4CAF50]">Your Chapter</span> in This Story
            </h2>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you volunteer on the ground, support us financially, or advocate in your community — there is a role for every committed person in this movement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/volunteer" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105 shadow-lg shadow-[#4CAF50]/30">
                Become a Volunteer <ArrowRight size={16} />
              </Link>
              <Link to="/donate" className="inline-flex items-center gap-2 bg-[#D6A95A] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#c49a4a] transition-all hover:scale-105 shadow-lg shadow-[#D6A95A]/30">
                Donate to ESN
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer between final CTA and Footer */}
      <div className="h-16 lg:h-24 bg-[#F6FBF8]" />
    </div>
  );
}
