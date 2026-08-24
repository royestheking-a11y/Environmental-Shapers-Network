import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { MapPin, Filter, Search, ExternalLink, Calendar, Users, Target, Leaf, TreePine, Droplets, Wind, Sun, Mountain, Globe2 } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

import { getInitialProjects, Project } from "./admin/sections/ProjectsView";
import { resolveIcon } from "./admin/sections/ProgramsView";
import { useFirestoreData } from "../../lib/useFirestore";

export default function Projects() {
  const [allProjects] = useFirestoreData<Project[]>("esn_projects_admin", getInitialProjects());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = allProjects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category.includes(category);
    const matchStatus = status === "All" || p.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
              <MapPin size={14} />
              Our Projects
            </div>
            <h1 className="text-white mb-4">470+ Projects Worldwide</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              From forest restoration to marine conservation — explore our global portfolio of environmental impact projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={15} className="text-gray-400" />
              {["All", "Forest", "Ocean", "Climate", "Energy", "Community"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === c ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-600 hover:bg-[#0B5D3F]/10"}`}
                >
                  {c}
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200" />
              {["All", "Active", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${status === s ? "bg-[#173B63] text-white" : "bg-[#F6FBF8] text-gray-600 hover:bg-[#173B63]/10"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-14 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">{filtered.length} projects found</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${status}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    <ImageWithFallback src={project.img} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#0B5D3F]">
                        {project.category}
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${project.status === "Active" ? "bg-[#4CAF50]" : "bg-gray-400"}`}>
                        {project.status}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (project.color || "#0B5D3F") + "15" }}>
                        {(() => {
                           const Icon = resolveIcon("Globe");
                           return <Icon size={18} style={{ color: project.color || "#0B5D3F" }} />;
                        })()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{project.name}</h4>
                        <div className="text-xs text-gray-400 mt-0.5">{project.country}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 py-3 border-t border-gray-50 text-center">
                      <div>
                        <div className="text-xs font-bold text-gray-700">{project.impact.split(" ").slice(0, 2).join(" ")}</div>
                        <div className="text-xs text-gray-400">Impact</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-700">{project.volunteers.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Volunteers</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-700">{project.category}</div>
                        <div className="text-xs text-gray-400">Type</div>
                      </div>
                    </div>
                    <Link to={`/projects/${project.id}`} className="mt-4 flex items-center justify-between text-sm font-semibold text-[#0B5D3F] hover:gap-3 transition-all">
                      <span>View Project</span>
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Target size={40} className="mx-auto mb-4 opacity-30" />
              <p>No projects match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
