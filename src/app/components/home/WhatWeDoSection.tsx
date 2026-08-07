import { motion } from "motion/react";
import { Search, Map, FileSearch, ScrollText, RefreshCw } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Scope the Research Question",
    desc: "We identify research priorities together with local scientists, government agencies, and the communities affected — anchoring every study in a real, unanswered question rather than an assumed one.",
    with: "With local scientists & agencies"
  },
  {
    num: "02",
    icon: Map,
    title: "Collect Field Data",
    desc: "Our teams gather primary data on the ground — combining satellite imagery, environmental sensors, and structured field surveys to build a dataset that reflects what's actually happening.",
    with: "With field researchers"
  },
  {
    num: "03",
    icon: FileSearch,
    title: "Analyse & Peer Review",
    desc: "Data is analysed by our research fellows and subjected to external peer review, so the evidence we publish can withstand scrutiny from policymakers and the scientific community.",
    with: "With research fellows & reviewers"
  },
  {
    num: "04",
    icon: ScrollText,
    title: "Translate Into Policy & Programs",
    desc: "Findings are converted into policy briefs, program designs, and technical guidance — closing the gap between what the science shows and what gets built or legislated on the ground.",
    with: "With policymakers & program teams"
  }
];

export function WhatWeDoSection() {
  return (
    <section className="py-16 bg-[#E8F3EB] relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#0A3D2A 1px, transparent 1px), linear-gradient(90deg, #0A3D2A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-[#0A3D2A]/40" />
            <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">What We Do</span>
            <div className="w-6 h-[2px] bg-[#0A3D2A]/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
            From Field to Evidence, Evidence to Action
          </h2>
          <p className="text-[#0A3D2A]/70 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Research is the engine behind every program we run. This is how we turn raw field observation into peer-reviewed evidence — and evidence into environmental action that holds up under scrutiny.
          </p>
        </motion.div>

        <div className="space-y-12 pl-4 md:pl-24">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col md:flex-row gap-8 items-start group"
            >
              {/* Timeline Connector Line */}
              {idx !== steps.length - 1 && (
                <div className="absolute left-[39px] top-24 bottom-[-48px] w-px bg-[#0A3D2A]/10 hidden md:block" />
              )}
              
              <div className="shrink-0 relative">
                <div className="w-20 h-20 rounded-full border-[1px] border-[#0A3D2A]/20 flex items-center justify-center bg-white shadow-xl shadow-gray-200/50 group-hover:border-[#0A3D2A]/40 transition-colors duration-500">
                  <span className="text-2xl font-serif text-[#0A3D2A]">{step.num}</span>
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-[#0A3D2A]/5 text-[#46986F]">
                    <step.icon size={18} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#0A3D2A]">{step.title}</h3>
                </div>
                <p className="text-gray-600 font-light leading-relaxed mb-4 max-w-2xl">
                  {step.desc}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#0A3D2A]/10 text-xs font-semibold text-[#0A3D2A] tracking-wider uppercase">
                  {step.with}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
