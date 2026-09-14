import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { useFirestoreData } from "../../../lib/useFirestore";
import { getInitialMissionSection, MissionSectionData } from "../../pages/admin/sections/MissionAdminView";

export function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [sectionDataRaw] = useFirestoreData<MissionSectionData>("esn_mission_section_admin", getInitialMissionSection());
  const data = sectionDataRaw || getInitialMissionSection();
  const goals = data.goals && data.goals.length > 0 ? data.goals : getInitialMissionSection().goals;

  return (
    <section 
      ref={ref} 
      className="py-24 lg:py-32 relative overflow-hidden bg-[#0A261B] text-white selection:bg-[#52C794] selection:text-[#0A261B]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#165B3E]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-[#52C794]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle organic background grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#52C794 1px, transparent 1px)`,
          backgroundSize: "36px 36px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ─── LEFT: Glowing Concentric 2050 Circle ─── */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center"
            >
              {/* Outermost dotted orbit ring */}
              <div className="absolute inset-0 rounded-full border border-[#52C794]/15 animate-[spin_60s_linear_infinite]" />

              {/* Second subtle dashed ring */}
              <div className="absolute inset-4 sm:inset-6 rounded-full border border-dashed border-[#52C794]/25 animate-[spin_40s_linear_infinite_reverse]" />

              {/* Outer pulsing glow halo */}
              <div className="absolute inset-10 sm:inset-12 rounded-full bg-[#185339]/50 blur-xl animate-pulse" />

              {/* Main Glowing Circle Container */}
              <div className="relative w-[230px] h-[230px] sm:w-[290px] sm:h-[290px] md:w-[320px] md:h-[320px] rounded-full bg-gradient-to-br from-[#1E5F43] via-[#154B34] to-[#0D3624] border border-[#52C794]/40 shadow-[0_0_80px_rgba(46,143,101,0.45)] flex flex-col items-center justify-center text-center p-6 backdrop-blur-md group hover:border-[#52C794]/70 transition-all duration-500">
                
                {/* Inner radial gradient highlights */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(110,231,183,0.35),transparent_70%)] pointer-events-none" />

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative z-10"
                >
                  <div className="text-5xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-[#6EE7B7] drop-shadow-[0_2px_15px_rgba(110,231,183,0.4)]">
                    {data.targetYear || "2050"}
                  </div>
                  <div className="mt-2 text-sm sm:text-base font-medium text-emerald-100/90 tracking-wide">
                    <span className="block font-bold text-white text-base sm:text-lg">
                      {data.targetSubtitle ? data.targetSubtitle.split(" ")[0] : "Net-Zero"}
                    </span>
                    {data.targetSubtitle ? data.targetSubtitle.split(" ").slice(1).join(" ") : "Carbon Goal"}
                  </div>
                </motion.div>

                {/* Orbiting particle */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#6EE7B7] rounded-full shadow-[0_0_12px_#6EE7B7]" />
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT: Content & Checklist ─── */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Mission Label */}
              <div className="flex items-center gap-2 mb-4">
                <span className="h-0.5 w-6 bg-[#52C794]" />
                <span className="text-[#52C794] text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">
                  OUR MISSION
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-[1.18] tracking-tight">
                {data.headline || "A Greener World Is Possible"}
              </h2>

              {/* Subtext Paragraph */}
              <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-light">
                {data.subtext || "We believe that with the right science, the right partnerships, and the right political will, a net-zero carbon future is achievable by 2050."}
              </p>

              {/* Dynamic Checklist with round check icons */}
              <div className="space-y-4 mb-10">
                {goals.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + index * 0.08 }}
                    className="flex items-center gap-3.5 group"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-[#52C794] flex items-center justify-center text-[#52C794] group-hover:bg-[#52C794] group-hover:text-[#0A261B] transition-all duration-300 shrink-0 shadow-[0_0_10px_rgba(82,199,148,0.2)]">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/90 text-sm sm:text-base font-normal group-hover:text-white transition-colors">
                        {item.text}
                      </span>
                      {item.metric && (
                        <span className="text-[11px] font-bold text-[#52C794] bg-[#52C794]/15 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {item.metric}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/get-involved"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-[#52C794] text-[#0A261B] hover:bg-[#66e2ad] shadow-[0_0_35px_rgba(82,199,148,0.45)] hover:shadow-[0_0_50px_rgba(82,199,148,0.65)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  Join the Mission
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white px-5 py-3 transition-colors"
                >
                  <span>Learn about our strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

