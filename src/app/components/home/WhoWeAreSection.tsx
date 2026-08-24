import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { getInitialWhoWeAreFeatures } from "../../pages/admin/sections/WhoWeAreAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

const defaultFeatures = [
  {
    iconName: "Globe2",
    title: "Global-Local Integration",
    description: "We operate through regional hubs and grassroots networks, ensuring solutions are globally informed and locally owned.",
  },
  {
    iconName: "Microscope",
    title: "Evidence-Based Research",
    description: "Every program is grounded in rigorous science, co-designed with leading universities and experts.",
  },
  {
    iconName: "GraduationCap",
    title: "Youth-Centred Leadership",
    description: "We invest in the next generation — equipping youth with tools to drive lasting systemic change.",
  },
];

const proofPoints = [
  "Science-informed, community-owned model",
  "70%+ of leadership from Global South",
  "Open-source data & transparent finances",
];

export function WhoWeAreSection() {
  const [featuresRaw] = useFirestoreData<any[]>("esn_whoweare_admin", getInitialWhoWeAreFeatures());

  const features = (featuresRaw || defaultFeatures).map((f) => ({
    iconName: f.iconName,
    title: f.title,
    description: f.description,
  }));

  return (
    <section className="py-0 bg-white overflow-hidden">
      {/* Editorial label bar */}
      <div className="bg-[#F6FBF8] border-b border-[#4CAF50]/15 py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-[#4CAF50] text-xs font-black uppercase tracking-[0.3em]">Who We Are</span>
          <div className="flex-1 h-px bg-[#4CAF50]/20" />
          <span className="text-gray-400 text-xs font-medium">Est. 2019 · 80+ Countries</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 py-16 lg:py-24 items-start">

          {/* ─── LEFT: Story + Proof Points ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 flex flex-col"
          >
            {/* Headline */}
            <h2
              className="text-[#0A3D2A] leading-[1.1] mb-6 tracking-tight"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                fontWeight: 900,
              }}
            >
              Shaping Change Through<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#0B5D3F]">
                Science, Community & Courage
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
              Environmental Shapers Network (ESN) is a globally active NGO bringing together environmental scientists, frontline communities, youth advocates, researchers, and policymakers across{" "}
              <strong className="text-[#0B5D3F] font-semibold">80+ countries</strong>. We operate at the intersection of ecology, social justice, and systemic innovation.
            </p>

            {/* Founders' Quote Card */}
            <div className="relative bg-gradient-to-br from-[#0B5D3F] to-[#0a4d33] rounded-2xl p-6 mb-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#4CAF50]/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#D6A95A]/10 rounded-full blur-2xl" />
              <div className="relative">
                <svg width="28" height="20" viewBox="0 0 32 24" fill="none" className="mb-3 opacity-60">
                  <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.2 6.4 6.4 10.4H12V24H0zm20 0V14.4C20 6.4 24.8 1.6 34.4 0l1.6 2.4C30.4 3.6 27.2 6.4 26.4 10.4H32V24H20z" fill="#4CAF50" />
                </svg>
                <p className="text-white/90 text-base leading-relaxed font-medium italic mb-3">
                  "When the floods came and scientists confirmed climate change as the cause, we realized that hope without action was just a comfortable lie. We had to build something real."
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-px bg-[#4CAF50]" />
                  <span className="text-[#A5D6A7] text-xs font-bold">Imran Hossain & Abu Hanif · Co-Founders, ESN</span>
                </div>
              </div>
            </div>

            {/* Proof points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {proofPoints.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2.5 bg-[#F6FBF8] rounded-xl p-3.5 border border-[#4CAF50]/15"
                >
                  <div className="w-5 h-5 bg-[#4CAF50] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 leading-snug">{t}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#0B5D3F] hover:bg-[#0a4d33] text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-[#0B5D3F]/25"
              >
                Our Full Story <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* ─── RIGHT: Image + Feature Cards ─── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 lg:order-2 flex flex-col gap-5"
          >
            {/* Main hero image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#0B5D3F]/10 h-[260px] sm:h-[300px] relative group">
              <img
                src="/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg"
                alt="ESN community work"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Feature cards */}
            <div className="flex flex-col gap-3">
              {features.map((feature, index) => {
                const Icon = resolveIcon(feature.iconName);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 bg-[#F6FBF8] hover:bg-white border border-[#4CAF50]/10 hover:border-[#4CAF50]/30 hover:shadow-md rounded-2xl p-4 transition-all group cursor-default"
                  >
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0B5D3F] transition-colors">
                      <Icon size={20} className="text-[#0B5D3F] group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0A3D2A] mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Years badge */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-2xl p-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-black text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>7+</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Years of Global Action</div>
                <div className="text-white/60 text-xs">From Dhaka to 80+ countries worldwide</div>
              </div>
              <Link
                to="/programs"
                className="ml-auto shrink-0 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
              >
                Our Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom 4-pillar accent bar */}
      <div className="border-t border-gray-100 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: "Target", label: "Science-Led", desc: "Every action grounded in peer-reviewed research" },
              { icon: "HandHeart", label: "Community First", desc: "Local ownership in every project we run" },
              { icon: "Shield", label: "Radical Transparency", desc: "Full financial & impact data, always open" },
              { icon: "Globe2", label: "Global South Led", desc: "70%+ leadership from most-affected nations" },
            ].map((p, i) => {
              const Icon = resolveIcon(p.icon);
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 items-start group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0B5D3F] transition-colors">
                    <Icon size={16} className="text-[#0B5D3F] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xs mb-0.5">{p.label}</div>
                    <div className="text-gray-400 text-[11px] leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
