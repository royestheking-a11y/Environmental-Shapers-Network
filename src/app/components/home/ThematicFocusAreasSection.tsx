import { motion } from "motion/react";
import { Link } from "react-router";

import { getInitialThematicAreas } from "../../pages/admin/sections/ThematicAreasView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";
import { useState, useEffect } from "react";

export function ThematicFocusAreasSection() {
  const [themes] = useFirestoreData<any[]>("esn_thematic_areas", getInitialThematicAreas());
  return (
    <section className="py-16 bg-[#F8FCF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-[#0A3D2A] text-sm font-bold uppercase tracking-[0.2em]">Our Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6">
            Themes Driving Systemic Change
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Our strategic interventions are clustered around nine core thematic areas, designed to address the world's most pressing environmental challenges through integrated, science-based solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, idx) => {
            const Icon = resolveIcon(theme.icon);
            return (
              <Link key={theme.title} to={`/thematic-areas/${theme.slug}`} className="block h-full group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-gray-100 rounded-[32px] p-8 group-hover:bg-[#F8FCF9] shadow-xl shadow-gray-200/40 group-hover:shadow-2xl group-hover:shadow-[#0A3D2A]/10 group-hover:border-[#0A3D2A]/5 transition-all flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#F8FCF9] border border-[#0A3D2A]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-[#0A3D2A]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F8FCF9] text-[#46986F] px-3 py-1.5 rounded-full border border-[#46986F]/20">
                      {theme.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#0A3D2A] mb-4">{theme.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light flex-grow">
                    {theme.desc}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
