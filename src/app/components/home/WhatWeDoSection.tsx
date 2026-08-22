import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  Lightbulb, 
  FlaskConical, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass,
  X,
  Target,
  FileText,
  Workflow
} from "lucide-react";
import { Link } from "react-router";

export interface CycleStep {
  num: string;
  phase: string;
  action: string;
  title: string;
  subtitle: string;
  icon: any;
  desc: string;
  focusList: string[];
  outputs: string[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

export const cycleSteps: CycleStep[] = [
  {
    num: "01",
    phase: "EMPATHIZE",
    action: "Community Voice",
    title: "Empathize",
    subtitle: "Listen & Understand Lived Experiences",
    icon: Users,
    desc: "We begin in the field. We listen to communities, youth, local practitioners, researchers, and institutions to understand lived experiences, environmental risks, unmet needs, and local knowledge.",
    focusList: [
      "Community voices",
      "Lived experience",
      "Local knowledge",
      "Environmental realities"
    ],
    outputs: [
      "Community vulnerability assessments",
      "Oral histories & indigenous ecological mapping",
      "Field observation logs & stakeholder matrix"
    ],
    accentColor: "#0B5D3F",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200"
  },
  {
    num: "02",
    phase: "DEFINE",
    action: "Research",
    title: "Define",
    subtitle: "Transform Concerns into Root-Cause Evidence",
    icon: Search,
    desc: "We transform community concerns into clear, researchable questions. Through literature reviews, field studies, data collection, stakeholder consultations, and evidence analysis, we investigate root causes—not just visible symptoms.",
    focusList: [
      "Research questions",
      "Evidence gaps",
      "Root causes",
      "Data & analysis"
    ],
    outputs: [
      "Peer-reviewed baseline studies",
      "Open-access environmental datasets",
      "Systemic causal-loop problem diagrams"
    ],
    accentColor: "#173B63",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200"
  },
  {
    num: "03",
    phase: "IDEATE",
    action: "Innovation",
    title: "Ideate",
    subtitle: "Co-Create Scientifically-Informed Solutions",
    icon: Lightbulb,
    desc: "We bring evidence and lived experience together. Communities, young people, scientists, policymakers, and practitioners collaboratively develop solutions that are locally relevant, scientifically informed, inclusive, and practical.",
    focusList: [
      "Co-creation",
      "Innovation",
      "Collaboration",
      "Solution design"
    ],
    outputs: [
      "Multi-stakeholder design sprint blueprints",
      "Policy briefs & participatory action plans",
      "Community-vetted technology models"
    ],
    accentColor: "#D97706",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200"
  },
  {
    num: "04",
    phase: "PROTOTYPE",
    action: "Validation",
    title: "Prototype | Test in Practice",
    subtitle: "Real-World Pilots & Continuous Adaptation",
    icon: FlaskConical,
    desc: "We translate ideas into prototypes, research pilots, community interventions, campaigns, and innovative solutions. We test assumptions in real-world settings, measure results, document challenges, and continuously adapt.",
    focusList: [
      "Experimentation",
      "Pilot action",
      "Learning",
      "Adaptation"
    ],
    outputs: [
      "Field pilot demonstrations",
      "Adaptive iteration logs & feedback loops",
      "Rapid feasibility & cost-benefit analysis"
    ],
    accentColor: "#0891B2",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200"
  },
  {
    num: "05",
    phase: "TEST",
    action: "Impact",
    title: "Test",
    subtitle: "Actionable Evidence & Policy Replication",
    icon: TrendingUp,
    desc: "We turn lessons and results into actionable evidence. We evaluate outcomes, document findings, communicate knowledge, strengthen partnerships, inform policy, and support the replication or scaling of solutions that demonstrate meaningful impact.",
    focusList: [
      "Validation",
      "Impact measurement",
      "Knowledge sharing",
      "Policy influence",
      "Scaling"
    ],
    outputs: [
      "Published longitudinal impact reports",
      "National policy amendments & guidelines",
      "Global scaling toolkits & open replication repositories"
    ],
    accentColor: "#059669",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200"
  }
];

export function WhatWeDoSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [modalStep, setModalStep] = useState<CycleStep | null>(null);

  return (
    <section id="what-we-do" className="py-24 md:py-32 bg-[#F4F9F5] relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0B5D3F 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0B5D3F]/15 shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#0B5D3F]" />
            <span className="text-[#0B5D3F] text-xs font-bold uppercase tracking-[0.2em]">
              What We Do • Our Methodology
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 leading-[1.18] tracking-tight">
            We Place People at the Center of Research and{" "}
            <span className="text-[#0B5D3F] block sm:inline">Evidence at the Center of Action.</span>
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal max-w-3xl mx-auto">
            Our approach connects community knowledge, scientific research, innovation, and policy to develop environmental solutions that are relevant, measurable, inclusive, and scalable.
          </p>
        </motion.div>

        {/* ─── Research-to-Action Cycle Flow Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-14 p-5 md:p-8 bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-gray-200/50"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#0B5D3F] uppercase block mb-1">
                Systemic Framework
              </span>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 font-serif">
                Our Research-to-Action Cycle
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3F] animate-ping" />
              <span>Closed-Loop Continuous Feedback</span>
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
                  className={`cursor-pointer transition-all duration-300 rounded-2xl p-4 border flex flex-col justify-between ${
                    isSelected 
                      ? "bg-[#0B5D3F] text-white border-[#0B5D3F] shadow-lg scale-[1.02]" 
                      : "bg-gray-50/80 hover:bg-white text-gray-800 border-gray-200 hover:border-[#0B5D3F]/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                      isSelected ? "bg-white/20 text-white" : "bg-white border border-gray-200 text-[#0B5D3F]"
                    }`}>
                      {step.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-[#0B5D3F]"}`} />
                  </div>
                  
                  <div>
                    <div className={`text-xs font-bold tracking-wider uppercase mb-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                      {step.phase}
                    </div>
                    <div className={`text-[12px] font-medium flex items-center justify-between ${isSelected ? "text-emerald-100" : "text-gray-600"}`}>
                      <span>{step.action}</span>
                      {idx < cycleSteps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 hidden lg:inline opacity-60 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Formula Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-gray-600">
            <span className="text-[#0B5D3F] font-bold">Cycle Formula:</span>
            <span>Community Voice</span>
            <span>→</span>
            <span>Research</span>
            <span>→</span>
            <span>Innovation</span>
            <span>→</span>
            <span>Validation</span>
            <span>→</span>
            <span className="text-[#0B5D3F] font-bold">Scalable Impact</span>
          </div>
        </motion.div>

        {/* ─── 5-Stage Detailed Cards Grid ─── */}
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
                className={`group relative bg-white rounded-3xl p-7 sm:p-8 border transition-all duration-500 flex flex-col justify-between ${
                  isHighlighted
                    ? "border-[#0B5D3F] shadow-2xl shadow-[#0B5D3F]/15 -translate-y-1.5"
                    : "border-gray-200 hover:border-[#0B5D3F]/40 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 hover:-translate-y-1"
                } ${idx === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
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
                        <span className="text-xs font-bold text-gray-700">
                          {step.action}
                        </span>
                      </div>
                    </div>

                    <div className={`w-11 h-11 rounded-2xl ${step.accentBg} ${step.accentBorder} border flex items-center justify-center text-[#0B5D3F] group-hover:scale-110 transition-transform duration-300`}>
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
                <div className="pt-5 border-t border-gray-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0B5D3F]" />
                      Focus:
                    </span>
                    <button 
                      onClick={() => setModalStep(step)}
                      className="text-xs text-[#0B5D3F] hover:underline font-semibold flex items-center gap-1"
                    >
                      Deep Dive <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.focusList.map((focus, fIdx) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-950 border border-emerald-200/80 group-hover:bg-[#E8F3EB] group-hover:border-[#0B5D3F]/30 transition-colors"
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

        {/* ─── Bottom Callout Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0A3323 0%, #062318 60%, #03150E 100%)",
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
                <span>Scalable Impact Engine</span>
              </div>

              {/* Title */}
              <h4 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif mb-4 leading-tight"
                style={{ color: "#ffffff" }}
              >
                Connecting Community Realities with Global Policy
              </h4>

              {/* Paragraph */}
              <p 
                className="text-sm sm:text-base font-normal leading-relaxed"
                style={{ color: "#D1FAE5" }}
              >
                By anchoring every phase in real community voices and rigorous scientific validation, we translate localized initiatives into lasting systemic change.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <Link
                to="/thematic-areas"
                className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-[1.03] text-sm"
                style={{
                  backgroundColor: "#52C794",
                  color: "#0A261B"
                }}
              >
                <span>Explore Thematic Areas</span>
                <ArrowRight className="w-4 h-4 text-[#0A261B]" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-7 py-4 font-semibold rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-[1.03] text-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.35)"
                }}
              >
                <span>Our Organization</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ─── Phase Detail Modal ─── */}
      <AnimatePresence>
        {modalStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <button
                onClick={() => setModalStep(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0B5D3F] text-white font-bold flex items-center justify-center">
                  {modalStep.num}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B5D3F] uppercase tracking-wider block">
                    {modalStep.phase} • {modalStep.action}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-900">{modalStep.title}</h3>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {modalStep.desc}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#0B5D3F]" />
                    Key Focus Areas:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modalStep.focusList.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0B5D3F]" />
                    Expected Concrete Outputs:
                  </div>
                  <ul className="space-y-1.5">
                    {modalStep.outputs.map((out, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B5D3F] mt-1.5 shrink-0" />
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setModalStep(null)}
                className="w-full py-3 bg-[#0B5D3F] text-white font-bold rounded-xl text-sm hover:bg-[#094d34] transition-colors"
              >
                Close Deep Dive
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
