import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { getInitialThematicAreas, ThematicArea } from "../../pages/admin/sections/ThematicAreasView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

export function ThematicFocusAreasSection() {
  const [areasRaw] = useFirestoreData<ThematicArea[]>("esn_thematic_areas_admin", getInitialThematicAreas());
  const areas = areasRaw && areasRaw.length > 0 ? areasRaw : getInitialThematicAreas();

  const gradients = [
    "from-emerald-500/10 to-teal-500/10",
    "from-blue-500/10 to-indigo-500/10",
    "from-amber-500/10 to-orange-500/10",
    "from-lime-500/10 to-emerald-500/10",
    "from-teal-500/10 to-cyan-500/10",
    "from-yellow-500/10 to-amber-500/10",
    "from-rose-500/10 to-red-500/10",
    "from-teal-500/10 to-emerald-500/10",
    "from-cyan-500/10 to-blue-500/10",
  ];

  return (
    <section id="thematic-areas" className="py-24 md:py-32 bg-[#F8FCF9] relative overflow-hidden">
      {/* Background Subtle Elements */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0A3D2A 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-teal-100/30 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0A3D2A]/10 shadow-sm mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0A3D2A]" />
            <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">
              Strategic Impact Domains
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0A3D2A] mb-6 leading-tight"
          >
            Our Thematic Focus Areas
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal"
          >
            Nine thematic focus areas cut across all our core programs — ensuring environmental action is holistic, just, and aligned with the 2030 Sustainable Development Agenda and the Paris Agreement.
          </motion.p>
        </div>

        {/* Thematic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {areas.map((theme, idx) => {
            const IconComp = resolveIcon(theme.icon);
            const gradient = gradients[idx % gradients.length];
            return (
              <Link 
                key={theme.slug} 
                to={`/thematic-areas/${theme.slug}`} 
                className="block h-full group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white border border-gray-200/90 rounded-[28px] p-7 sm:p-8 shadow-lg shadow-gray-200/50 group-hover:shadow-2xl group-hover:shadow-[#0A3D2A]/15 group-hover:border-[#0A3D2A]/40 transition-all duration-500 flex flex-col justify-between h-full group-hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Subtle top corner gradient glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#F4F9F5] border border-[#0A3D2A]/10 flex items-center justify-center group-hover:bg-[#0A3D2A] group-hover:border-[#0A3D2A] group-hover:scale-105 transition-all duration-300 shadow-sm">
                        <IconComp className="w-7 h-7 text-[#0A3D2A] group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
                      </div>
                      
                      <span className="text-xs font-bold tracking-wider bg-emerald-50 text-[#0A3D2A] px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-sm">
                        {theme.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0A3D2A] mb-3 group-hover:text-[#0B5D3F] transition-colors leading-snug">
                      {theme.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                      {theme.desc}
                    </p>
                  </div>

                  {/* Read More Link Arrow */}
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A3D2A] group-hover:text-[#0B5D3F] transition-colors pt-4 border-t border-gray-100">
                    <span>Explore Focus Area</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Explorer Action */}
        <div className="text-center">
          <Link
            to="/thematic-areas"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A3D2A] text-white font-bold text-sm shadow-xl shadow-[#0A3D2A]/20 hover:bg-[#082E20] hover:scale-105 transition-all duration-300"
          >
            <span>View All Thematic Strategy Frameworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
