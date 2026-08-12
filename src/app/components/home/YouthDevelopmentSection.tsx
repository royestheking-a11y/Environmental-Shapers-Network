import { motion } from "motion/react";

import { useState, useEffect } from "react";
import { getInitialYouthInitiatives, getInitialYouthStats } from "../../pages/admin/sections/YouthAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";

const defaultInitiatives = [
  { num: "01", title: "ESN Youth Leadership Academy", desc: "A 12-month immersive leadership programme for 18–30 year olds — combining environmental science training, policy advocacy skills, field experience, and mentorship from senior ESN practitioners and UN officials.", impact: "2,500 graduates in 55 countries" },
  { num: "02", title: "Climate Action Fellowships", desc: "Competitive, fully-funded fellowships placing young environmental professionals within ESN programs, partner NGOs, government ministries, and international institutions for 6–12 month assignments.", impact: "800 fellows placed annually" },
  { num: "03", title: "Youth Shapers COP Delegation", desc: "Providing rigorous negotiation training and accredited seats at UNFCCC COP summits, CBD COPs, and other key multilateral environmental forums — ensuring youth voices shape global climate agreements.", impact: "Active in 60 nations · COP29 ✓" },
  { num: "04", title: "Green Schools Initiative", desc: "Transforming schools into climate action hubs through curriculum integration, student-led environment clubs, solar installations, tree planting, and connections to ESN's global youth network.", impact: "4,200 schools across 38 countries" },
  { num: "05", title: "Digital Climate Literacy Platform", desc: "Free, multilingual online learning platform delivering climate science, sustainability, and environmental advocacy courses to young people — accessible on mobile with or without internet connectivity.", impact: "1.2M learners · 55 languages" },
  { num: "06", title: "Youth Research & Innovation Grants", desc: "Seed funding and mentorship for youth-led environmental research projects and social enterprises — supporting the next generation of environmental innovators from idea to impact in communities worldwide.", impact: "$4M awarded · 320 projects funded" }
];

const defaultStats = [
  { value: "100K+", label: "Youth Leaders", sub: "Trained Globally" },
  { value: "60", label: "Countries with Active", sub: "Youth Networks" },
  { value: "4,200", label: "Green Schools", sub: "Transformed" },
  { value: "$4M+", label: "Youth Research", sub: "Grants Awarded" }
];

export function YouthDevelopmentSection() {
  const [initsRaw] = useFirestoreData<any[]>("esn_youth_initiatives", getInitialYouthInitiatives());
  const [statsRaw] = useFirestoreData<any[]>("esn_youth_stats", getInitialYouthStats());

  const initiatives = initsRaw && initsRaw.length > 0 ? initsRaw : defaultInitiatives;
  const stats = statsRaw && statsRaw.length > 0 ? statsRaw : defaultStats;
  return (
    <section className="py-16 bg-[#E6F3EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Youth Development</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
              Investing in Tomorrow's Environmental Leaders
            </h2>
            <p className="text-[#0A3D2A]/70 max-w-3xl mx-auto text-lg leading-relaxed mb-16 font-light">
              Our Youth Development Program is a transformative pipeline — turning passionate young people into skilled, connected, and empowered environmental champions operating at every level from village to UN chamber.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F8FCF9] rounded-3xl p-8 shadow-sm border border-white text-center"
              >
                <div className="text-4xl font-serif text-[#0A3D2A] mb-3">{stat.value}</div>
                <div className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500 font-light">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {initiatives.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#0A3D2A]/10 border border-transparent hover:border-[#0A3D2A]/5 transition-all flex flex-col group overflow-hidden relative"
            >
              {/* Background large number */}
              <div className="absolute -top-10 -right-6 text-9xl font-serif font-black text-[#F2F9F1] group-hover:text-[#E8F5EE] transition-colors duration-500 select-none z-0">
                {item.num}
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-2xl font-serif text-[#0A3D2A]/40 mb-4">{item.num}</div>
                <h3 className="text-2xl font-serif text-[#0A3D2A] mb-4 pr-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow font-light">{item.desc}</p>
                <div className="text-[10px] font-bold text-[#0A3D2A] bg-[#E6F3EB] px-4 py-2 rounded-full inline-block w-fit uppercase tracking-wider">
                  {item.impact}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
