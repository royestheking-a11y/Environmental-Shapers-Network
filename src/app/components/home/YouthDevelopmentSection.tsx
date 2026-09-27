import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getInitialYouthInitiatives, getInitialYouthStats, YouthInitiative } from "../../pages/admin/sections/YouthAdminView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { X, ArrowRight, Users, Target, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export function YouthDevelopmentSection() {
  const [initsRaw] = useFirestoreData<any[]>("esn_youth_initiatives_admin", getInitialYouthInitiatives());
  const [statsRaw] = useFirestoreData<any[]>("esn_youth_stats", getInitialYouthStats());
  const [activeInitiative, setActiveInitiative] = useState<YouthInitiative | null>(null);

  const initiatives = initsRaw && initsRaw.length > 0 ? initsRaw : getInitialYouthInitiatives();
  const stats = statsRaw && statsRaw.length > 0 ? statsRaw : getInitialYouthStats();

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
                key={stat.id || idx}
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
              key={item.id || item.num || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#0A3D2A]/10 border border-transparent hover:border-[#0A3D2A]/5 transition-all flex flex-col group relative"
            >
              {item.image ? (
                <div className="relative h-52 w-full overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#0A3D2A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                    {item.num}
                  </div>
                </div>
              ) : (
                /* Background large number if no image */
                <div className="absolute -top-10 -right-6 text-9xl font-serif font-black text-[#F2F9F1] group-hover:text-[#E8F5EE] transition-colors duration-500 select-none z-0">
                  {item.num}
                </div>
              )}
              
              <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
                {!item.image && (
                  <div className="text-2xl font-serif text-[#0A3D2A]/40 mb-4">{item.num}</div>
                )}
                <h3 className="text-2xl font-serif text-[#0A3D2A] mb-4 pr-4 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow font-light">{item.desc}</p>
                
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-auto">
                  <div className="text-[10px] font-bold text-[#0A3D2A] bg-[#E6F3EB] px-3.5 py-1.5 rounded-full uppercase tracking-wider truncate max-w-[65%]">
                    {item.impact}
                  </div>
                  <button
                    onClick={() => setActiveInitiative(item)}
                    className="text-xs font-bold text-[#0B5D3F] hover:text-[#063322] inline-flex items-center gap-1 group/btn transition-colors shrink-0"
                  >
                    Details <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Public In-Details Modal */}
      <AnimatePresence>
        {activeInitiative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setActiveInitiative(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setActiveInitiative(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
              >
                <X size={16} />
              </button>

              {activeInitiative.image && (
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 bg-gray-100 relative">
                  <img src={activeInitiative.image} alt={activeInitiative.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-[#0B5D3F] text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                    Initiative #{activeInitiative.num}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-[#0B5D3F] bg-[#E6F3EB] px-3 py-1 rounded-full uppercase tracking-wider">
                  Track #{activeInitiative.num}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {activeInitiative.impact}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#0A3D2A] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {activeInitiative.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium bg-[#F6FBF8] p-4 rounded-2xl border border-gray-100">
                {activeInitiative.desc}
              </p>

              {activeInitiative.details && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Program Overview & Operations</h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {activeInitiative.details}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {activeInitiative.audience && (
                  <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-emerald-100/70">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] mb-1.5 uppercase tracking-wider">
                      <Users size={14} /> Who Can Join
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {activeInitiative.audience}
                    </p>
                  </div>
                )}
                {activeInitiative.outcomes && (
                  <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-emerald-100/70">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] mb-1.5 uppercase tracking-wider">
                      <Target size={14} /> Key Deliverables
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {activeInitiative.outcomes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 border-t border-gray-100">
                <Link
                  to="/volunteer"
                  className="flex-1 bg-[#0A3D2A] hover:bg-[#173B63] text-white py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  Join This Initiative <ArrowRight size={15} />
                </Link>
                <button
                  onClick={() => setActiveInitiative(null)}
                  className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

