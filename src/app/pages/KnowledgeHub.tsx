import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight, BookOpen, Download, FileText, Globe2, Search, Video,
  BarChart2, Leaf, ExternalLink, Filter, Sparkles, CheckCircle2
} from "lucide-react";
import { useFirestoreData } from "../../lib/useFirestore";
import {
  defaultKnowledgeSettings,
  defaultKnowledgeResources,
  KnowledgeHubSettings,
  KnowledgeResource
} from "./admin/sections/KnowledgeHubAdminView";

const typeColors: Record<string, string> = {
  Report: "#0B5D3F",
  "Policy Brief": "#173B63",
  "Research Paper": "#4CAF50",
  Toolkit: "#D6A95A",
  Data: "#5B8DB8",
  Guide: "#6B3FA0",
  News: "#0B5D3F",
  Article: "#173B63",
};

const categories = [
  { icon: FileText, label: "All", type: "All" },
  { icon: FileText, label: "Reports", type: "Report" },
  { icon: BarChart2, label: "Policy Briefs", type: "Policy Brief" },
  { icon: BookOpen, label: "Research Papers", type: "Research Paper" },
  { icon: Globe2, label: "Toolkits & Data", type: "Toolkit" },
  { icon: Video, label: "Articles & News", type: "Article" },
];

export default function KnowledgeHub() {
  const [settingsData] = useFirestoreData<KnowledgeHubSettings>("esn_knowledge_hub_settings", defaultKnowledgeSettings);
  const [resourcesData] = useFirestoreData<KnowledgeResource[]>("esn_knowledge_hub_resources", defaultKnowledgeResources);
  const [cmsContent] = useFirestoreData<any[]>("esn_cms_content", []);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const settings = settingsData || defaultKnowledgeSettings;

  // Combine dynamic resources from Knowledge Hub Admin with dynamic CMS articles
  const allResources = useMemo(() => {
    const rawResources = resourcesData && resourcesData.length > 0 ? resourcesData : defaultKnowledgeResources;

    // Optional integration with CMS articles
    const extraCmsItems = (cmsContent || [])
      .filter((item: any) => item.status === "Published" || !item.status)
      .map((item: any) => ({
        id: item.id + 1000,
        type: item.type || "Article",
        title: item.title,
        desc: item.excerpt || item.summary || "Official ESN research publication and briefing.",
        date: item.date || "2026",
        downloads: Math.floor(1000 + ((item.id || 1) % 5000)),
        image: item.image || item.coverImage || "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
        link: `/news/${item.id}`,
        featured: false
      }));

    return [...rawResources, ...extraCmsItems];
  }, [resourcesData, cmsContent]);

  // Featured publications (Items marked as featured or top 3)
  const featured = useMemo(() => {
    const rawResources = resourcesData && resourcesData.length > 0 ? resourcesData : defaultKnowledgeResources;
    const explicitlyFeatured = rawResources.filter((r) => r.featured && r.image);

    if (explicitlyFeatured.length >= 3) {
      return explicitlyFeatured.slice(0, 3);
    }

    const withImages = rawResources.filter((r) => r.image);
    if (withImages.length >= 3) {
      return withImages.slice(0, 3);
    }

    return defaultKnowledgeResources.slice(0, 3);
  }, [resourcesData]);

  // Filtered list based on search and selected category
  const filteredResources = useMemo(() => {
    return allResources.filter((r) => {
      const matchSearch =
        search === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.desc && r.desc.toLowerCase().includes(search.toLowerCase())) ||
        r.type.toLowerCase().includes(search.toLowerCase());

      const matchType =
        selectedType === "All" ||
        r.type.toLowerCase() === selectedType.toLowerCase() ||
        (selectedType === "Toolkit" && (r.type === "Toolkit" || r.type === "Data" || r.type === "Guide")) ||
        (selectedType === "Article" && (r.type === "Article" || r.type === "News" || r.type === "Blog"));

      return matchSearch && matchType;
    });
  }, [allResources, search, selectedType]);

  const handleDownload = (item: KnowledgeResource) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank", "noopener,noreferrer");
      setDownloadToast(`Opening/Downloading: ${item.title}`);
    } else if (item.link) {
      if (item.link.startsWith("http")) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = item.link;
      }
    } else {
      setDownloadToast(`Downloading Open-Access PDF: ${item.title}`);
    }

    setTimeout(() => {
      setDownloadToast(null);
    }, 4000);
  };

  return (
    <div className="bg-[#F6FBF8] min-h-screen">
      {/* Download Alert Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B5D3F] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 size={18} className="text-[#4CAF50]" />
          <span className="text-xs font-bold">{downloadToast}</span>
        </div>
      )}

      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-[#0B5D3F] via-[#0E4733] to-[#173B63] overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #4CAF50, transparent 60%)" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
              <BookOpen size={14} />
              {settings.badge || "Open Access Knowledge Hub"}
            </div>
            <h1
              className="text-white mb-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight whitespace-pre-line"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {settings.title || "Evidence for a\nSustainable Planet"}
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              {settings.subtitle ||
                "Access ESN's open-access repository of peer-reviewed research, policy recommendations, community toolkits, and climate datasets."}
            </p>
            <div className="flex items-center max-w-lg bg-white rounded-2xl p-2 gap-3 shadow-xl">
              <Search size={18} className="text-gray-400 ml-2 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={settings.searchPlaceholder || "Search publications, topics, SDGs…"}
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm font-medium"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs px-2">
                  Clear
                </button>
              )}
              <button className="bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all shadow-md">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {(settings.stats || defaultKnowledgeSettings.stats).map((st, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {st.value}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-3">Browse by Classification</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-14">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setSelectedType(c.type)}
              className={`p-4 text-center rounded-2xl border transition-all ${
                selectedType === c.type
                  ? "bg-[#0B5D3F] text-white border-[#0B5D3F] shadow-md shadow-[#0B5D3F]/20"
                  : "bg-white text-gray-700 border-gray-100 hover:border-[#4CAF50]/40 hover:shadow-sm"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors ${
                  selectedType === c.type ? "bg-white/20 text-white" : "bg-[#0B5D3F]/8 text-[#0B5D3F]"
                }`}
              >
                <c.icon size={18} />
              </div>
              <div className="text-xs font-bold truncate">{c.label}</div>
            </button>
          ))}
        </div>

        {/* Featured */}
        <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-2">Featured Publications</div>
        <h2
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}
          className="text-gray-900 mb-6"
        >
          Latest Key Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {featured.map((f, i) => (
            <motion.div
              key={f.id || f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col h-full"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={f.image || "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full shadow bg-white/90 backdrop-blur-md text-[#0B5D3F]">
                    {f.type}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-gray-400 mb-2 block">{f.date}</span>
                  <h3 className="font-bold text-gray-900 mb-2 text-base leading-snug group-hover:text-[#0B5D3F] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{f.desc}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Download size={12} /> {f.downloads.toLocaleString()} reads
                  </div>
                  {f.link ? (
                    <Link
                      to={f.link}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors"
                    >
                      Read Online <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleDownload(f)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] hover:text-[#4CAF50] transition-colors cursor-pointer"
                    >
                      Download PDF <Download size={12} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All Resources */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="text-[#4CAF50] text-xs font-bold uppercase tracking-wider mb-1">Publications Library</div>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800 }}
              className="text-gray-900"
            >
              All Available Documents ({filteredResources.length})
            </h2>
          </div>
          {selectedType !== "All" && (
            <button onClick={() => setSelectedType("All")} className="text-xs font-bold text-[#0B5D3F] hover:underline cursor-pointer">
              Reset filter ({selectedType})
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-10 shadow-sm">
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              No publications found matching "{search}". Try searching for another term.
            </div>
          ) : (
            filteredResources.map((r, i) => (
              <motion.div
                key={r.id || r.title + i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 p-5 ${
                  i < filteredResources.length - 1 ? "border-b border-gray-50" : ""
                } hover:bg-[#F6FBF8] transition-colors group`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: (typeColors[r.type] || "#0B5D3F") + "15" }}
                >
                  <FileText size={16} style={{ color: typeColors[r.type] || "#0B5D3F" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate group-hover:text-[#0B5D3F] transition-colors">
                    {r.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="font-semibold" style={{ color: typeColors[r.type] || "#0B5D3F" }}>
                      {r.type}
                    </span>
                    <span>·</span>
                    <span>{r.date}</span>
                    <span>·</span>
                    <span>{r.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.link ? (
                    <Link
                      to={r.link}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] bg-[#0B5D3F]/8 px-3.5 py-2 rounded-xl hover:bg-[#0B5D3F] hover:text-white transition-all"
                    >
                      <ExternalLink size={12} /> View
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleDownload(r)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] bg-[#0B5D3F]/8 px-3.5 py-2 rounded-xl hover:bg-[#0B5D3F] hover:text-white transition-all cursor-pointer"
                    >
                      <Download size={12} /> Download
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Propose a research paper */}
        <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] rounded-3xl p-10 text-white text-center shadow-lg">
          <Leaf size={36} className="text-[#4CAF50] mx-auto mb-3" />
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.8rem", fontWeight: 800 }} className="mb-2">
            {settings.ctaHeading || "Submit Research for Peer Review"}
          </h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            {settings.ctaDescription ||
              "Are you a researcher or academic institution working on climate adaptation? Partner with ESN to publish in our open library."}
          </p>
          <Link
            to={settings.ctaButtonLink || "/contact"}
            className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#43a047] transition-all shadow-md"
          >
            {settings.ctaButtonText || "Submit a Proposal"} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
