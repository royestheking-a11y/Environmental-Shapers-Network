import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { MapPin, ArrowRight, ExternalLink, Filter, Target } from "lucide-react";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { getInitialProjects, Project } from "../../pages/admin/sections/ProjectsView";
import { useFirestoreData } from "../../../lib/useFirestore";
import { resolveIcon } from "../../pages/admin/sections/ProgramsView";

export function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [projects] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Forest", "Ocean", "Climate", "Energy", "Community"];

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section ref={ref} className="py-16 bg-[#F6FBF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0B5D3F]/10 text-[#0B5D3F] text-sm font-semibold px-5 py-2 rounded-full mb-5">
              <MapPin size={14} />
              Our Projects
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B5D3F] mb-6">
              Featured <span className="text-[#4CAF50]">Projects</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-white border border-[#0B5D3F]/20 text-[#0B5D3F] px-6 py-3 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all duration-300"
          >
            All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-2 mb-10 flex-wrap"
        >
          <Filter size={16} className="text-gray-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#0B5D3F] text-white shadow-lg shadow-[#0B5D3F]/20"
                  : "bg-white text-gray-600 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.slice(0, 3).map((project, i) => {
              const Icon = resolveIcon("Globe");
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0B5D3F]/20 hover:shadow-2xl hover:shadow-[#0B5D3F]/10 transition-all duration-400 hover:-translate-y-1.5 cursor-pointer h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={project.img}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`text-white text-xs font-bold px-3 py-1.5 rounded-full ${project.status === "Active" ? "bg-[#4CAF50]" : "bg-gray-500"}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#D6A95A] text-white text-xs font-bold px-2.5 py-1 rounded-full">{project.theme}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-xs font-medium">
                          <MapPin size={12} />
                          {project.country}
                        </div>
                      </div>

                      <div className="p-6 pb-2">
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: project.color + "15" }}
                          >
                            <Icon size={18} style={{ color: project.color }} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base mb-0.5 group-hover:text-[#0B5D3F] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {project.name}
                            </h4>
                            <div className="text-xs text-gray-400">{project.startDate}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                      <div className="flex items-center justify-between py-3 border-t border-gray-50">
                        <div className="text-sm font-bold" style={{ color: project.color }}>
                          {project.impact}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-[#0B5D3F] font-bold group-hover:underline">
                          View Details <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
