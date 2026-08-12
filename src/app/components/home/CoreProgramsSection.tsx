import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getInitialPrograms, resolveIcon, ProgramData } from "../../pages/admin/sections/ProgramsView";
import { useFirestoreData } from "../../../lib/useFirestore";

export function CoreProgramsSection() {
  const [programsRaw] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());
  const programs = (programsRaw || []).filter(p => 
    ["Climate Adaptation & Resilience", "Environmental Research", "Youth Development"].includes(p.title)
  );

  return (
    <section className="py-16 bg-[#F8FCF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Core Programs</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
            Pillars of Global Environmental Action
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Our flagship programs address the planet's most urgent challenges — from climate adaptation to biodiversity, clean energy to research and youth leadership — at transformative scale across all continents.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => {
            const IconComp = resolveIcon(program.iconName);
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-[#0A3D2A]/10 border border-gray-100/80 hover:border-transparent transition-all duration-500 group flex flex-col relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: program.color }}
                />
                
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
                  style={{ backgroundColor: `${program.color}15`, color: program.color }}
                >
                  <IconComp size={28} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif text-[#0A3D2A] mb-4 group-hover:text-[#072B1E] transition-colors">{program.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-8 flex-grow">{program.desc}</p>
                
                <Link 
                  to={`/programs/${program.slug}`} 
                  className="inline-flex items-center gap-2 font-bold text-sm tracking-wide mt-auto transition-colors relative w-fit"
                  style={{ color: program.color }}
                >
                  <span className="relative z-10">Explore Program</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  <span 
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 opacity-30"
                    style={{ backgroundColor: program.color }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
