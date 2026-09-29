import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { getInitialPrograms, resolveIcon, ProgramData } from "../../pages/admin/sections/ProgramsView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export function CoreProgramsSection() {
  const [programsRaw] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());
  const programs = (programsRaw && programsRaw.length > 0) ? programsRaw.slice(0, 3) : getInitialPrograms().slice(0, 3);

  return (
    <section className="py-16 bg-[#F8FCF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[#0A3D2A] text-xs font-bold uppercase tracking-[0.2em]">Programs</span>
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
                key={program.slug || program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#0A3D2A]/10 border border-gray-100/80 hover:border-transparent transition-all duration-500 group flex flex-col relative"
              >
                {/* Photo Banner with Fallback */}
                <div className="relative h-52 w-full overflow-hidden shrink-0 bg-emerald-950/20">
                  <ImageWithFallback
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {program.category}
                    </span>
                  </div>

                  {/* Reach Pill */}
                  {program.reach && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[11px] font-semibold text-white/95 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {program.reach}
                      </span>
                    </div>
                  )}

                  {/* Icon Circle */}
                  <div 
                    className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white"
                    style={{ backgroundColor: program.color, color: "#ffffff" }}
                  >
                    <IconComp size={22} strokeWidth={2} />
                  </div>
                </div>

                <div className="pt-8 p-7 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif text-[#0A3D2A] mb-3 group-hover:text-[#072B1E] transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {program.desc}
                  </p>
                  
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

