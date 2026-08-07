import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Leaf, Globe2, Users, Target, ChevronRight, Sprout, TreePine, Wind } from "lucide-react";
import { Link } from "react-router";
import { getInitialMissionValues } from "../../pages/admin/sections/MissionAdminView";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";
import { useFirestoreData } from "../../../lib/useFirestore";

const defaultValues = [
  {
    iconName: "Sprout",
    title: "Sustainability First",
    description: "Every action we take is grounded in environmental responsibility and long-term ecological thinking.",
    color: "#0B5D3F",
  },
  {
    iconName: "Globe2",
    title: "Global Collaboration",
    description: "We bridge borders, cultures, and disciplines to address planetary challenges with collective intelligence.",
    color: "#173B63",
  },
  {
    iconName: "Users",
    title: "Community-Led",
    description: "Local communities are the heart of our work — we amplify grassroots voices to drive systemic change.",
    color: "#4CAF50",
  },
  {
    iconName: "Target",
    title: "Action-Oriented",
    description: "We translate research and policy into tangible, on-the-ground environmental impact.",
    color: "#D6A95A",
  },
];

export function MissionSection() {
  const [valuesRaw] = useFirestoreData<any[]>("esn_mission_admin", defaultValues);
  const values = valuesRaw && valuesRaw.length > 0 ? valuesRaw : defaultValues;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-[#F6FBF8] relative overflow-hidden">
      {/* Decorative SVG background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="absolute top-20 right-10 w-64 h-64" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#4CAF50" strokeWidth="1" strokeDasharray="8 6" />
          <circle cx="100" cy="100" r="55" stroke="#0B5D3F" strokeWidth="1" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="30" stroke="#4CAF50" strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-20 left-10 w-48 h-48" viewBox="0 0 200 200" fill="none">
          <path d="M100 20 L180 180 L20 180 Z" stroke="#0B5D3F" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Mission Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-sm font-semibold px-5 py-2 rounded-full mb-6">
                <Leaf size={14} />
                Who We Are
              </div>
              <h2 className="text-[#0B5D3F] mb-6">
                Shaping Minds,<br />
                <span className="text-[#4CAF50]">Protecting Earth</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Environmental Shapers Network (ESN) is a global organization dedicated to catalyzing environmental action through youth empowerment, scientific research, community mobilization, and policy advocacy.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Founded on the belief that every person has the power to be an environmental shaper, we work across continents to protect biodiversity, restore ecosystems, and build climate-resilient communities — one project, one idea, one person at a time.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {["Youth Leadership", "Climate Policy", "Nature Restoration", "Green Innovation", "Community Action"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-white border border-[#0B5D3F]/20 text-[#0B5D3F] text-sm font-medium px-4 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#0B5D3F] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0a5237] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#0B5D3F]/30"
              >
                Our Full Story <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>

          {/* Right: Vision Card + Animated Globe */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mt-10 lg:mt-0"
          >
            {/* Main Glass Card */}
            <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-3xl p-8 sm:p-10 pb-20 sm:pb-24 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-white/20" />
                <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-[#4CAF50]/30" />
              </div>
              <div className="relative z-10">
                <TreePine size={32} className="text-[#4CAF50] mb-4" />
                <h3 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Our Vision
                </h3>
                <p className="text-white/80 leading-relaxed">
                  A world where every human being lives in harmony with nature — where environmental sustainability is not just a goal, but a global reality.
                </p>

                {/* Rotating Earth */}
                <div className="mt-10 mb-6 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="relative w-32 h-32"
                  >
                    <div className="absolute inset-0 rounded-full border-2 border-[#4CAF50]/30" />
                    <div className="absolute inset-4 rounded-full border border-white/20" />
                    <Globe2 size={48} className="absolute inset-0 m-auto text-[#4CAF50]" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  {[["2015", "Founded"], ["80+", "Countries"], ["2.4M", "Trees"]].map(([v, l]) => (
                    <div key={l}>
                      <div className="text-2xl font-black text-[#4CAF50]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
                      <div className="text-xs text-white/60">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mission Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 z-20 max-w-[280px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center">
                  <Wind size={22} className="text-[#4CAF50]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Net Zero by 2050</div>
                  <div className="text-xs text-gray-500">Our mission target</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24"
        >
          <div className="text-center mb-14">
            <h3 className="text-[#0B5D3F] mb-3">Our Core Values</h3>
            <p className="text-gray-500 max-w-xl mx-auto">The principles that guide every decision, every program, and every partnership we build.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = resolveIcon(v.iconName);
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#0B5D3F]/20 hover:shadow-xl hover:shadow-[#0B5D3F]/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: v.color + "15" }}
                  >
                    <Icon size={22} style={{ color: v.color }} />
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: v.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {v.title}
                  </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            );
          })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
