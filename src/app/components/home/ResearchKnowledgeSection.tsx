import { motion } from "motion/react";
import { Leaf, Waves, Sun, Database, Users, Building } from "lucide-react";
import { Link } from "react-router";

import { useState, useEffect } from "react";
import { getInitialResearchAreas } from "../../pages/admin/sections/ResearchAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

const defaultAreas = [
  { slug: "ecosystem-health", iconName: "Leaf", title: "Ecosystem Health & Monitoring", desc: "Long-term ecological monitoring across 40+ biomes — tracking deforestation, soil degradation, species loss, and ecosystem recovery using satellite imagery and AI-powered analytics.", tags: ["Ecology", "Remote Sensing", "AI"] },
  { slug: "ocean-blue-carbon", iconName: "Waves", title: "Ocean & Blue Carbon Science", desc: "Quantifying marine ecosystem carbon sequestration potential, tracking ocean acidification, and developing blue carbon accounting frameworks for international climate finance mechanisms.", tags: ["Marine Science", "Carbon", "Climate Finance"] },
  { slug: "clean-energy-transition", iconName: "Sun", title: "Clean Energy Transition Research", desc: "Modelling just energy transition pathways for developing economies — assessing socioeconomic impacts, policy gaps, and community-level energy access solutions in the Global South.", tags: ["Energy Policy", "Just Transition", "SDG 7"] },
  { slug: "climate-data-lab", iconName: "Database", title: "Climate Data & Innovation Lab", desc: "Harnessing open data platforms, citizen science, and machine learning to track environmental change in real time — making climate intelligence universally accessible and actionable.", tags: ["Data Science", "Open Access", "Innovation"] },
  { slug: "social-environmental-justice", iconName: "Users", title: "Social & Environmental Justice Research", desc: "Studying the intersections of environmental degradation, gender inequality, indigenous rights, and climate vulnerability — generating evidence for rights-based environmental governance reforms.", tags: ["Social Science", "Gender", "Indigenous Rights"] },
  { slug: "urban-climate-resilience", iconName: "Building", title: "Urban Climate Resilience Studies", desc: "Analysing climate risks in rapidly urbanising cities, developing green infrastructure blueprints, and evaluating urban nature-based solutions for heat, flood, and air pollution resilience.", tags: ["Urban Planning", "Nature-Based", "Resilience"] }
];

export function ResearchKnowledgeSection() {
  const [areas] = useFirestoreData<any[]>("esn_research_admin", getInitialResearchAreas());
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Research & Knowledge</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
              Evidence That Moves the World
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Our research program generates peer-reviewed, policy-relevant science across ecosystems, climate systems, and sustainability transitions — turning field data into global change.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/programs/research" className="inline-flex items-center justify-center bg-[#0A3D2A] text-white px-8 py-4 rounded-full font-medium hover:bg-[#072B1E] transition-all duration-300 shadow-lg shadow-[#0A3D2A]/20 hover:shadow-xl hover:shadow-[#0A3D2A]/30 hover:-translate-y-1">
              Access Research Publications
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, idx) => {
            const Icon = resolveIcon(area.iconName);
            return (
              <Link key={area.title} to={`/research/${area.slug}`} className="block h-full group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-gray-100 rounded-[32px] p-8 group-hover:bg-[#F8FCF9] shadow-xl shadow-gray-200/40 group-hover:shadow-2xl group-hover:shadow-[#0A3D2A]/10 group-hover:border-[#0A3D2A]/5 transition-all flex flex-col h-full"
                >
                  <div className="w-16 h-16 rounded-[24px] bg-[#E6F3EB] flex items-center justify-center text-[#46986F] mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif text-[#0A3D2A] mb-4 pr-4">{area.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light mb-8 flex-grow">{area.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {area.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full text-gray-500 group-hover:border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
