import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Download, FileText, Globe2, Search, Video, Mic, BarChart2, Leaf } from "lucide-react";

const featured = [
  {
    id: 1,
    type: "Report",
    title: "State of Global Forests 2025",
    desc: "Comprehensive assessment of global forest cover, deforestation drivers, and restoration progress across 80 countries.",
    downloads: 8420,
    date: "May 2025",
    color: "#0B5D3F",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  {
    id: 2,
    type: "Policy Brief",
    title: "Carbon Markets & Community Rights",
    desc: "Analysis of emerging voluntary carbon markets and their implications for indigenous and local communities.",
    downloads: 5210,
    date: "Apr 2025",
    color: "#173B63",
    icon: BarChart2,
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
  {
    id: 3,
    type: "Research Paper",
    title: "Youth-Led Climate Movements: Impact Analysis",
    desc: "Quantitative and qualitative assessment of youth climate movements' influence on national and global climate policy.",
    downloads: 3890,
    date: "Mar 2025",
    color: "#4CAF50",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
  },
];

const resources = [
  { id: 4, type: "Toolkit", title: "Community Climate Resilience Toolkit", date: "Jun 2025", downloads: 2140 },
  { id: 5, type: "Data", title: "ESN Environmental Database 2025", date: "Jan 2025", downloads: 4780 },
  { id: 6, type: "Guide", title: "Grant Writing for Environmental NGOs", date: "Feb 2025", downloads: 3320 },
  { id: 7, type: "Policy Brief", title: "NDC Enhancement: Lessons from 12 Countries", date: "Mar 2025", downloads: 1980 },
  { id: 8, type: "Report", title: "Marine Plastic Pollution: 2024 Assessment", date: "Apr 2025", downloads: 5600 },
  { id: 9, type: "Research Paper", title: "Clean Cookstoves & Women's Empowerment", date: "May 2025", downloads: 2730 },
  { id: 10, type: "Toolkit", title: "Campus Sustainability Action Guide", date: "Jun 2025", downloads: 1450 },
  { id: 11, type: "Data", title: "Biodiversity Monitoring Indicators Framework", date: "Dec 2024", downloads: 3200 },
];

const typeColors: Record<string, string> = {
  Report: "#0B5D3F",
  "Policy Brief": "#173B63",
  "Research Paper": "#4CAF50",
  Toolkit: "#D6A95A",
  Data: "#5B8DB8",
  Guide: "#6B3FA0",
};

const categories = [
  { icon: FileText, label: "Reports", count: 42 },
  { icon: BarChart2, label: "Policy Briefs", count: 28 },
  { icon: BookOpen, label: "Research Papers", count: 64 },
  { icon: Globe2, label: "Data & Datasets", count: 19 },
  { icon: Video, label: "Videos", count: 35 },
  { icon: Mic, label: "Podcasts", count: 12 },
];

export default function KnowledgeHub() {
  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #4CAF50, transparent 60%)" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
              <BookOpen size={14} />
              Knowledge Hub
            </div>
            <h1 className="text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900 }}>
              Evidence for a<br />Sustainable Planet
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">Access ESN's library of research reports, policy briefs, toolkits, and datasets — all free and open access.</p>
            <div className="flex items-center max-w-lg bg-white rounded-2xl p-2 gap-3">
              <Search size={18} className="text-gray-400 ml-2" />
              <input placeholder="Search publications, topics, SDGs…" className="flex-1 bg-transparent outline-none text-gray-700 text-sm" />
              <button className="bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Search</button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {[["200+", "Publications"], ["50K+", "Downloads in 2025"], ["35+", "Research Partners"], ["Open", "Access — Free"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-5 text-center border border-gray-100">
              <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Browse by Type</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-14">
          {categories.map((c, i) => (
            <motion.button key={c.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/8 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#0B5D3F]/15 transition-colors">
                <c.icon size={18} className="text-[#0B5D3F]" />
              </div>
              <div className="text-xs font-bold text-gray-700">{c.label}</div>
              <div className="text-xs text-gray-400">{c.count}</div>
            </motion.button>
          ))}
        </div>

        {/* Featured */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Featured Publications</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">Latest Key Resources</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {featured.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              <div className="h-40 overflow-hidden">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: f.color + "15", color: f.color }}>{f.type}</span>
                  <span className="text-xs text-gray-400">{f.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{f.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Download size={11} /> {f.downloads.toLocaleString()} downloads</div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors">
                    Download <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All Resources */}
        <div className="text-[#4CAF50] text-sm font-bold uppercase tracking-wider mb-3">Library</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }} className="text-gray-900 mb-6">All Publications</h2>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-10">
          {resources.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-5 ${i < resources.length - 1 ? "border-b border-gray-50" : ""} hover:bg-[#F6FBF8] transition-colors group`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (typeColors[r.type] || "#0B5D3F") + "15" }}>
                <FileText size={16} style={{ color: typeColors[r.type] || "#0B5D3F" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">{r.title}</div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="font-semibold" style={{ color: typeColors[r.type] || "#0B5D3F" }}>{r.type}</span>
                  <span>·</span><span>{r.date}</span>
                  <span>·</span><span>{r.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B5D3F]/8 px-3 py-1.5 rounded-lg hover:bg-[#0B5D3F]/15">
                <Download size={12} /> Download
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 border-2 border-[#0B5D3F] text-[#0B5D3F] px-7 py-3.5 rounded-full font-semibold hover:bg-[#0B5D3F] hover:text-white transition-all">
            Load More Publications <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
