import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Leaf } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getInitialPrograms, resolveIcon, ProgramData } from "./admin/sections/ProgramsView";
import { useFirestoreData } from "../../lib/useFirestore";

export default function AllPrograms() {
  const [programs] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());

  const categories = useMemo(() => {
    const cats = new Set(programs.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [programs]);

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPrograms = useMemo(() => {
    if (activeFilter === "All") return programs;
    return programs.filter(p => p.category === activeFilter);
  }, [programs, activeFilter]);

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B5D3F] to-[#173B63]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #4CAF50 0%, transparent 50%), radial-gradient(circle at 80% 50%, #D6A95A 0%, transparent 50%)"
        }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
              <Leaf size={14} />
              Our Programs
            </div>
            <h1 className="text-white mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900 }}>
              Programs That Drive<br />Real Environmental Change
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Integrated program areas working across ecosystems, communities, and policy to address the world's most pressing environmental challenges.
            </p>
            <div className="flex items-center justify-center gap-8">
              {[[programs.length.toString(), "Programs"], ["80+", "Countries"], ["470+", "Projects"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-white text-2xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
                  <div className="text-white/60 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveFilter(c)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${c === activeFilter ? "bg-[#0B5D3F] text-white border-[#0B5D3F]" : "bg-white text-gray-600 border-gray-200 hover:border-[#4CAF50]/50"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Program Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((p, i) => {
            const IconComp = resolveIcon(p.iconName);
            return (
              <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                <div className="h-48 overflow-hidden shrink-0">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: p.color + "18" }}>
                        <IconComp size={16} style={{ color: p.color }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.category}</span>
                    </div>
                    <span className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[40%]">{p.reach}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.highlights.map((h, hIdx) => h ? (
                      <span key={hIdx} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{h}</span>
                    ) : null)}
                  </div>
                  <Link to={`/programs/${p.slug}`} className="flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3 mt-auto" style={{ color: p.color }}>
                    Explore Program <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-12 text-white text-center mt-16">
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }} className="text-white mb-3">Work with Our Programs</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Partner with ESN programs as a funder, technical partner, or implementing organization.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/partner" className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#43a047] transition-all hover:scale-105">
              Partner With Us <ArrowRight size={15} />
            </Link>
            <Link to="/donate" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all">
              Fund a Program
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
