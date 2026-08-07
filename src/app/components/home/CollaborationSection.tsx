import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

const partnerships = [
  { num: "01", name: "ForestActive · 30 Nations", partners: "UNEP, WWF, FAO, IUCN", desc: "A landmark multi-agency commitment to restore 50 million hectares of degraded forest landscapes." },
  { num: "02", name: "Global Ocean Data Pact", partners: "NOAA, UNESCO, OceanX", desc: "Open-source data sharing agreement standardising marine biodiversity metrics across 120 marine research institutes." },
  { num: "03", name: "Climate Finance Coalition", partners: "World Bank, GCF, GEF", desc: "Mobilising $2 billion in adaptation finance specifically targeted at grassroots, indigenous-led environmental initiatives." },
  { num: "04", name: "Youth-to-Policy Bridge", partners: "UNFCCC, YOUNGO, UNDP", desc: "Institutionalising youth representation in national climate delegations for 45 vulnerable nations." }
];

export function CollaborationSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-[#0A3D2A]/40" />
            <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Global Collaboration</span>
            <div className="w-6 h-[2px] bg-[#0A3D2A]/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D2A] mb-6 leading-[1.15]">
            Collective Action for Planetary Impact
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Environmental challenges respect no borders. Our work is powered by radical collaboration — bridging the gap between grassroots activists, scientific institutions, and global policymakers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {partnerships.map((p, idx) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F8FCF9] rounded-3xl p-8 hover:bg-white border border-transparent hover:border-[#0A3D2A]/5 shadow-sm hover:shadow-xl hover:shadow-[#0A3D2A]/10 transition-all flex flex-col group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-sm font-bold text-[#46986F] tracking-widest">{p.num}</div>
                <ShieldCheck size={24} className="text-[#0A3D2A]/20 group-hover:text-[#46986F] transition-colors" />
              </div>
              <h3 className="text-2xl font-serif text-[#0A3D2A] mb-2">{p.name}</h3>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-4 border-b border-gray-200/50">
                With: {p.partners}
              </div>
              <p className="text-gray-500 font-light leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
