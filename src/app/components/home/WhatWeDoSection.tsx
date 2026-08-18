import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Search, 
  Lightbulb, 
  FlaskConical, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass
} from "lucide-react";
import { Link } from "react-router";

const cycleSteps = [
  {
    num: "01",
    phase: "EMPATHIZE",
    action: "Community Voice",
    title: "Empathize",
    subtitle: "Listen & Understand Lived Experience",
    icon: Users,
    desc: "We begin in the field. We listen to communities, youth, local practitioners, researchers, and institutions to understand lived experiences, environmental risks, unmet needs, and local knowledge.",
    focusList: [
      "Community voices",
      "Lived experience",
      "Local knowledge",
      "Environmental realities"
    ],
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-800",
    glowColor: "from-emerald-500/15 to-transparent"
  },
  {
    num: "02",
    phase: "DEFINE",
    action: "Research",
    title: "Define",
    subtitle: "Investigate Root Causes with Evidence",
    icon: Search,
    desc: "We transform community concerns into clear, researchable questions. Through literature reviews, field studies, data collection, stakeholder consultations, and evidence analysis, we investigate root causes—not just visible symptoms.",
    focusList: [
      "Research questions",
      "Evidence gaps",
      "Root causes",
      "Data & analysis"
    ],
    accentBg: "bg-teal-50",
    accentBorder: "border-teal-200",
    accentText: "text-teal-800",
    glowColor: "from-teal-500/15 to-transparent"
  },
  {
    num: "03",
    phase: "IDEATE",
    action: "Innovation",
    title: "Ideate",
    subtitle: "Co-create Evidence-Informed Solutions",
    icon: Lightbulb,
    desc: "We bring evidence and lived experience together. Communities, young people, scientists, policymakers, and practitioners collaboratively develop solutions that are locally relevant, scientifically informed, inclusive, and practical.",
    focusList: [
      "Co-creation",
      "Innovation",
      "Collaboration",
      "Solution design"
    ],
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-800",
    glowColor: "from-amber-500/15 to-transparent"
  },
  {
    num: "04",
    phase: "PROTOTYPE",
    action: "Validation",
    title: "Prototype | Test in Practice",
    subtitle: "Real-World Pilots & Continuous Learning",
    icon: FlaskConical,
    desc: "We translate ideas into prototypes, research pilots, community interventions, campaigns, and innovative solutions. We test assumptions in real-world settings, measure results, document challenges, and continuously adapt.",
    focusList: [
      "Experimentation",
      "Pilot action",
      "Learning",
      "Adaptation"
    ],
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    accentText: "text-cyan-800",
    glowColor: "from-cyan-500/15 to-transparent"
  },
  {
    num: "05",
    phase: "TEST",
    action: "Impact",
    title: "Test & Scale",
    subtitle: "Actionable Evidence & Policy Scaling",
    icon: TrendingUp,
    desc: "We turn lessons and results into actionable evidence. We evaluate outcomes, document findings, communicate knowledge, strengthen partnerships, inform policy, and support the replication or scaling of solutions that demonstrate meaningful impact.",
    focusList: [
      "Validation",
      "Impact measurement",
      "Knowledge sharing",
      "Policy influence",
      "Scaling"
    ],
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-800",
    glowColor: "from-emerald-500/15 to-transparent"
  }
];

export function WhatWeDoSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-[#F4F9F5] relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0B5D3F 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0B5D3F]/15 shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#0B5D3F]" />
            <span className="text-[#0B5D3F] text-xs font-bold uppercase tracking-[0.2em]">
              Our Methodology • What We Do
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.18] tracking-tight">
            People at the Center of Research.{" "}
            <span className="text-[#0B5D3F] block sm:inline">Evidence at the Center of Action.</span>
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal">
            Our approach connects community knowledge, scientific research, innovation, and policy to develop environmental solutions that are relevant, measurable, inclusive, and scalable.
          </p>
        </motion.div>

        {/* Research-to-Action Cycle Flow Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-14 p-5 md:p-7 bg-white rounded-2xl md:rounded-3xl border border-gray-200/90 shadow-lg shadow-gray-200/50"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#0B5D3F] uppercase">System Architecture</span>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Our Research-to-Action Cycle</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3F] animate-pulse" />
              Continuous Closed-Loop Feedback Process
            </div>
          </div>

          {/* Connected Cycle Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {cycleSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                  className={`cursor-pointer transition-all duration-300 rounded-xl p-4 border ${
                    isSelected 
                      ? "bg-[#0B5D3F] text-white border-[#0B5D3F] shadow-lg scale-[1.02]" 
                      : "bg-gray-50/80 hover:bg-white text-gray-800 border-gray-200 hover:border-[#0B5D3F]/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-white border border-gray-200 text-[#0B5D3F]"
                    }`}>
                      {step.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-[#0B5D3F]"}`} />
                  </div>
                  <div className={`text-xs font-bold tracking-wider uppercase mb-0.5 ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {step.phase}
                  </div>
                  <div className={`text-[12px] font-medium flex items-center gap-1 ${isSelected ? "text-emerald-100" : "text-gray-600"}`}>
                    <span>{step.action}</span>
                    {idx < cycleSteps.length - 1 && (
                      <ArrowRight className="w-3 h-3 hidden lg:inline ml-auto opacity-60" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 5-Stage Detailed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {cycleSteps.map((step, idx) => {
            const Icon = step.icon;
            const isHighlighted = activeStep === idx;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className={`group relative bg-white rounded-3xl p-7 sm:p-8 border transition-all duration-500 flex flex-col justify-between ${
                  isHighlighted
                    ? "border-[#0B5D3F] shadow-2xl shadow-[#0B5D3F]/15 -translate-y-1.5"
                    : "border-gray-200 hover:border-[#0B5D3F]/40 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 hover:-translate-y-1"
                } ${idx === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {/* Subtle corner gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.glowColor} rounded-tr-3xl rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-60`} />

                <div>
                  {/* Top Row: Number, Phase Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F] text-white flex items-center justify-center font-bold text-base shadow-md shadow-[#0B5D3F]/20">
                        {step.num}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B5D3F] block">
                          Phase {step.num}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {step.action}
                        </span>
                      </div>
                    </div>

                    <div className={`w-11 h-11 rounded-2xl ${step.accentBg} ${step.accentBorder} border flex items-center justify-center ${step.accentText} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 font-serif tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs font-bold text-[#0B5D3F] mb-4 tracking-wide uppercase">
                    {step.subtitle}
                  </p>

                  {/* Body Description */}
                  <p className="text-gray-700 font-normal text-sm sm:text-[15px] leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Focus Areas List */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0B5D3F]" />
                    Key Focus & Priorities:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.focusList.map((focus, fIdx) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50/80 text-emerald-950 border border-emerald-200/80 group-hover:bg-[#E8F3EB] group-hover:border-[#0B5D3F]/30 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B5D3F]" />
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Callout / Summary Card with Fixed High-Contrast Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0B5D3F 0%, #063926 50%, #031F15 100%)",
            color: "#ffffff"
          }}
        >
          {/* Background Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#6EE7B7",
                  borderColor: "rgba(110, 231, 183, 0.4)"
                }}
              >
                <Compass className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span>Continuous Learning Loop</span>
              </div>

              {/* Title */}
              <h4 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-4 leading-tight"
                style={{ color: "#ffffff" }}
              >
                From Grassroots Realities to Scalable Global Policy
              </h4>

              {/* Paragraph */}
              <p 
                className="text-sm sm:text-base font-normal leading-relaxed"
                style={{ color: "#D1FAE5" }}
              >
                By bridging community knowledge with scientific rigor, every project we launch produces verifiable evidence, open data, and institutional momentum to safeguard our planet.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                to="/thematic-areas"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.03] text-sm"
                style={{
                  backgroundColor: "#10B981",
                  color: "#032817"
                }}
              >
                <span className="font-extrabold text-[#032817]">Explore Thematic Areas</span>
                <ArrowRight className="w-4 h-4 text-[#032817]" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.03] text-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.35)"
                }}
              >
                <span className="text-white font-medium">About Our Approach</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


