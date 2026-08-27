import { motion } from "motion/react";

import { useState, useEffect } from "react";
import { getInitialPartners } from "../../pages/admin/sections/PartnersView";
import { useFirestoreData } from "../../../lib/useFirestore";

const fallbackPartners = [
  { name: "United Nations", abbr: "UN" },
  { name: "UNEP", abbr: "UNEP" },
  { name: "WWF Global", abbr: "WWF" },
  { name: "Greenpeace", abbr: "GP" },
  { name: "IUCN", abbr: "IUCN" },
  { name: "GEF", abbr: "GEF" },
  { name: "World Bank", abbr: "WB" },
  { name: "Climate Fund", abbr: "GCF" },
  { name: "UNDP", abbr: "UNDP" },
  { name: "COP30", abbr: "COP" },
  { name: "Earth Day", abbr: "ED" },
  { name: "IPCC", abbr: "IPCC" },
];

export function TrustedBySection() {
  const [partnersRaw] = useFirestoreData<any[]>("esn_partners_admin", getInitialPartners());
  
  const partners = partnersRaw && partnersRaw.length > 0 
    ? partnersRaw.map(p => ({
        name: p.name,
        abbr: p.name.substring(0, 4).toUpperCase()
      }))
    : fallbackPartners;

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="hidden sm:block h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-gray-300" />
          <span className="text-gray-400 text-xs sm:text-sm font-bold whitespace-nowrap tracking-widest uppercase">
            Trusted By Global Organizations
          </span>
          <div className="hidden sm:block h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-gray-300" />
        </motion.div>

        {/* Scrolling marquee */}
        <div className="overflow-hidden relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          <motion.div
            className="flex gap-8 items-center w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 shrink-0 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/8 flex items-center justify-center border border-[#0B5D3F]/10 group-hover:bg-[#0B5D3F]/15 transition-colors">
                  <span className="text-[9px] font-black text-[#0B5D3F]">{p.abbr}</span>
                </div>
                <span className="text-sm font-semibold text-gray-500 group-hover:text-[#0B5D3F] transition-colors whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
