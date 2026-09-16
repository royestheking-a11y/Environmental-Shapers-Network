import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Plus, Search, Edit3, Trash2, Download, FileText, BarChart2,
  Globe2, Sparkles, CheckCircle2, ArrowRight, Star, ExternalLink, RefreshCw, Upload, Eye
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { uploadMediaFile } from "../../../../lib/storageService";

export interface KnowledgeResource {
  id: number;
  type: string;
  title: string;
  desc?: string;
  date: string;
  downloads: number;
  image?: string;
  fileUrl?: string;
  link?: string;
  featured?: boolean;
}

export interface KnowledgeHubSettings {
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  stats: Array<{ value: string; label: string }>;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export const defaultKnowledgeSettings: KnowledgeHubSettings = {
  badge: "Open Access Knowledge Hub",
  title: "Evidence for a\nSustainable Planet",
  subtitle: "Access ESN's open-access repository of peer-reviewed research, policy recommendations, community toolkits, and climate datasets.",
  searchPlaceholder: "Search publications, topics, SDGs…",
  stats: [
    { value: "200+", label: "Publications" },
    { value: "50K+", label: "Downloads Globally" },
    { value: "35+", label: "University Partners" },
    { value: "100%", label: "Open Access — Free" }
  ],
  ctaHeading: "Submit Research for Peer Review",
  ctaDescription: "Are you a researcher or academic institution working on climate adaptation? Partner with ESN to publish in our open library.",
  ctaButtonText: "Submit a Proposal",
  ctaButtonLink: "/contact"
};

export const defaultKnowledgeResources: KnowledgeResource[] = [
  {
    id: 1,
    type: "Report",
    title: "State of Global Forests 2025",
    desc: "Comprehensive assessment of global forest cover, deforestation drivers, and restoration progress across 80 countries.",
    downloads: 8420,
    date: "May 2025",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: true
  },
  {
    id: 2,
    type: "Policy Brief",
    title: "Carbon Markets & Community Rights",
    desc: "Analysis of emerging voluntary carbon markets and their implications for indigenous and local communities.",
    downloads: 5210,
    date: "Apr 2025",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: true
  },
  {
    id: 3,
    type: "Research Paper",
    title: "Youth-Led Climate Movements: Impact Analysis",
    desc: "Quantitative and qualitative assessment of youth climate movements' influence on national and global climate policy.",
    downloads: 3890,
    date: "Mar 2025",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    featured: true
  },
  {
    id: 4,
    type: "Toolkit",
    title: "Community Climate Resilience Toolkit",
    desc: "Step-by-step practical guides and participatory appraisal tools for vulnerable coastal and riparian communities.",
    date: "Jun 2025",
    downloads: 2140
  },
  {
    id: 5,
    type: "Data",
    title: "ESN Environmental Database 2025",
    desc: "Comprehensive open-access GIS raster layers, bio-indicators, and climate vulnerability indexes.",
    date: "Jan 2025",
    downloads: 4780
  },
  {
    id: 6,
    type: "Guide",
    title: "Grant Writing for Environmental NGOs",
    desc: "Best practices, project proposal templates, and donor alignment strategies for grassroots environmental organizations.",
    date: "Feb 2025",
    downloads: 3320
  },
  {
    id: 7,
    type: "Policy Brief",
    title: "NDC Enhancement: Lessons from 12 Countries",
    desc: "Cross-jurisdictional comparative analysis on updating nationally determined contributions under the Paris Agreement.",
    date: "Mar 2025",
    downloads: 1980
  },
  {
    id: 8,
    type: "Report",
    title: "Marine Plastic Pollution: 2024 Assessment",
    desc: "Microplastic concentration tracking across major river deltas and bay systems in South and Southeast Asia.",
    date: "Apr 2025",
    downloads: 5600
  },
  {
    id: 9,
    type: "Research Paper",
    title: "Clean Cookstoves & Women's Empowerment",
    desc: "Empirical study on health, time-poverty reduction, and localized emission cuts from improved cookstove deployment.",
    date: "May 2025",
    downloads: 2730
  },
  {
    id: 10,
    type: "Toolkit",
    title: "Campus Sustainability Action Guide",
    desc: "Resource pack for student unions and university environmental clubs to audit energy, waste, and procurement.",
    date: "Jun 2025",
    downloads: 1450
  },
  {
    id: 11,
    type: "Data",
    title: "Biodiversity Monitoring Indicators Framework",
    desc: "Standardized biological monitoring metrics aligned with the Kunming-Montreal Global Biodiversity Framework.",
    date: "Dec 2024",
    downloads: 3200
  }
];

const PUBLICATION_TYPES = [
  "Report",
  "Policy Brief",
  "Research Paper",
  "Toolkit",
  "Data",
  "Guide",
  "Article",
  "News"
];

export default function KnowledgeHubAdminView() {
  const [activeTab, setActiveTab] = useState<"resources" | "hero-stats" | "cta">("resources");
  const [settings, setSettings] = useFirestoreData<KnowledgeHubSettings>("esn_knowledge_hub_settings", defaultKnowledgeSettings);
  const [resources, setResources] = useFirestoreData<KnowledgeResource[]>("esn_knowledge_hub_resources", defaultKnowledgeResources);

  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [formData, setFormData] = useState<Partial<KnowledgeResource>>({
    title: "",
    type: "Report",
    desc: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    downloads: 1000,
    image: "",
    fileUrl: "",
    link: "",
    featured: false
  });

  const saveSettingsToFirestore = async (newSettings: KnowledgeHubSettings) => {
    setSettings(newSettings);
    await saveFirestoreData("esn_knowledge_hub_settings", newSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const saveResourcesToFirestore = async (newResources: KnowledgeResource[]) => {
    setResources(newResources);
    await saveFirestoreData("esn_knowledge_hub_resources", newResources);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      type: "Report",
      desc: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      downloads: Math.floor(1000 + Math.random() * 4000),
      image: "",
      fileUrl: "",
      link: "",
      featured: false
    });
    setShowAddModal(true);
  };

  const handleStartEdit = (res: KnowledgeResource) => {
    setEditingId(res.id);
    setFormData({ ...res });
    setShowAddModal(true);
  };

  const handleSaveResource = () => {
    if (!formData.title?.trim()) {
      alert("Please enter a title for the publication / document.");
      return;
    }

    if (editingId !== null) {
      const updated = (resources || []).map((r) =>
        r.id === editingId ? ({ ...r, ...formData } as KnowledgeResource) : r
      );
      saveResourcesToFirestore(updated);
    } else {
      const newId = resources && resources.length > 0 ? Math.max(...resources.map((r) => r.id)) + 1 : 1;
      const newResource: KnowledgeResource = {
        id: newId,
        title: formData.title || "",
        type: formData.type || "Report",
        desc: formData.desc || "",
        date: formData.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        downloads: Number(formData.downloads) || 1200,
        image: formData.image || "",
        fileUrl: formData.fileUrl || "",
        link: formData.link || "",
        featured: !!formData.featured
      };
      saveResourcesToFirestore([newResource, ...(resources || [])]);
    }

    setShowAddModal(false);
  };

  const handleDeleteResource = () => {
    if (deleteConfirmId !== null) {
      const updated = (resources || []).filter((r) => r.id !== deleteConfirmId);
      saveResourcesToFirestore(updated);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleFeatured = (id: number) => {
    const updated = (resources || []).map((r) =>
      r.id === id ? { ...r, featured: !r.featured } : r
    );
    saveResourcesToFirestore(updated);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingDoc(true);
    try {
      const res = await uploadMediaFile(file, "knowledge_hub_docs");
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, fileUrl: res.url }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload document. Please try again or paste a link.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const currentSettings = settings || defaultKnowledgeSettings;
  const currentResources = resources || defaultKnowledgeResources;

  const filteredResources = currentResources.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.desc && r.desc.toLowerCase().includes(search.toLowerCase())) ||
      r.type.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      selectedTypeFilter === "All" ||
      r.type.toLowerCase() === selectedTypeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 font-black text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Knowledge Hub Management
            </h3>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3F] bg-[#E6F3EB] px-2.5 py-1 rounded-full animate-pulse">
                <CheckCircle2 size={13} /> Saved Live
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage open-access research papers, policy briefs, toolkits, datasets, stats, and banners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/knowledge-hub"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <Eye size={14} /> Preview Live Page <ExternalLink size={12} className="text-gray-400" />
          </a>
          {activeTab === "resources" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
            >
              <Plus size={16} /> Add Document / Paper
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "resources"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Publications & Documents ({currentResources.length})
        </button>
        <button
          onClick={() => setActiveTab("hero-stats")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "hero-stats"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Hero Banner & Statistics
        </button>
        <button
          onClick={() => setActiveTab("cta")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "cta"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Call to Action (Proposal Section)
        </button>
      </div>

      {/* TAB 1: RESOURCES & PUBLICATIONS */}
      {activeTab === "resources" && (
        <div className="flex flex-col gap-5">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-80 bg-[#F6FBF8] px-3.5 py-2.5 rounded-xl border border-gray-200">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search publications, authors, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs font-medium outline-none text-gray-800"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedTypeFilter("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  selectedTypeFilter === "All"
                    ? "bg-[#0B5D3F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({currentResources.length})
              </button>
              {PUBLICATION_TYPES.map((type) => {
                const count = currentResources.filter((r) => r.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      selectedTypeFilter === type
                        ? "bg-[#0B5D3F] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resources Table / Cards */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {filteredResources.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No documents found matching your filter. Click "+ Add Document / Paper" above.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F6FBF8]/60 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {res.image ? (
                        <img
                          src={res.image}
                          alt={res.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#0B5D3F]/10 text-[#0B5D3F]">
                            {res.type}
                          </span>
                          {res.featured && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Star size={11} className="fill-amber-500 text-amber-500" /> Featured (Top Card)
                            </span>
                          )}
                          <span className="text-xs text-gray-400">· {res.date}</span>
                          <span className="text-xs text-gray-400">· {res.downloads.toLocaleString()} reads/downloads</span>
                        </div>

                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                          {res.title}
                        </h4>

                        {res.desc && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {res.desc}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-xs">
                          {res.fileUrl && (
                            <a
                              href={res.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0B5D3F] font-bold hover:underline flex items-center gap-1"
                            >
                              <Download size={12} /> Direct PDF / File Attached
                            </a>
                          )}
                          {res.link && (
                            <span className="text-gray-400 flex items-center gap-1 truncate max-w-xs">
                              <ExternalLink size={12} /> {res.link}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(res.id)}
                        title={res.featured ? "Remove from Featured" : "Pin to Featured"}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          res.featured
                            ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                            : "bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-500"
                        }`}
                      >
                        <Star size={15} className={res.featured ? "fill-amber-500" : ""} />
                      </button>

                      <button
                        onClick={() => handleStartEdit(res)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                      >
                        <Edit3 size={13} /> Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(res.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HERO BANNER & STATS */}
      {activeTab === "hero-stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="font-bold text-gray-900 text-base">Hero Header Settings</h4>
            <p className="text-xs text-gray-400">Configure top banner title, badge, and search placeholder</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Top Badge Label</label>
              <input
                type="text"
                value={currentSettings.badge}
                onChange={(e) =>
                  setSettings({ ...currentSettings, badge: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="e.g. Open Access Knowledge Hub"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Search Box Placeholder</label>
              <input
                type="text"
                value={currentSettings.searchPlaceholder}
                onChange={(e) =>
                  setSettings({ ...currentSettings, searchPlaceholder: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="e.g. Search publications, topics, SDGs…"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Main Hero Heading</label>
              <input
                type="text"
                value={currentSettings.title}
                onChange={(e) =>
                  setSettings({ ...currentSettings, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Evidence for a Sustainable Planet"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Subtitle / Description</label>
              <textarea
                rows={3}
                value={currentSettings.subtitle}
                onChange={(e) =>
                  setSettings({ ...currentSettings, subtitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="Access ESN's open-access repository..."
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-base">Key Impact Statistics (4 Counters)</h4>
              <p className="text-xs text-gray-400">These 4 metrics appear directly beneath the hero header</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentSettings.stats.map((stat, idx) => (
                <div key={idx} className="bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-2">Metric #{idx + 1}</div>
                  <div className="mb-2">
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Value (e.g. 200+)</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...currentSettings.stats];
                        newStats[idx] = { ...newStats[idx], value: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-black text-[#0B5D3F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...currentSettings.stats];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        setSettings({ ...currentSettings, stats: newStats });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium outline-none text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => saveSettingsToFirestore(currentSettings)}
              className="px-6 py-3 rounded-xl bg-[#0B5D3F] text-white font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Save Hero & Statistics
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CTA PROPOSAL BANNER */}
      {activeTab === "cta" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="font-bold text-gray-900 text-base">Bottom Call to Action Banner</h4>
            <p className="text-xs text-gray-400">Configure the proposal invitation block at the bottom of the Knowledge Hub page</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">CTA Heading</label>
              <input
                type="text"
                value={currentSettings.ctaHeading}
                onChange={(e) =>
                  setSettings({ ...currentSettings, ctaHeading: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Submit Research for Peer Review"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">CTA Description</label>
              <textarea
                rows={3}
                value={currentSettings.ctaDescription}
                onChange={(e) =>
                  setSettings({ ...currentSettings, ctaDescription: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="Are you a researcher or academic institution..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Button Text</label>
              <input
                type="text"
                value={currentSettings.ctaButtonText}
                onChange={(e) =>
                  setSettings({ ...currentSettings, ctaButtonText: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Submit a Proposal"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Button Link (URL / Route)</label>
              <input
                type="text"
                value={currentSettings.ctaButtonLink}
                onChange={(e) =>
                  setSettings({ ...currentSettings, ctaButtonLink: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="/contact"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => saveSettingsToFirestore(currentSettings)}
              className="px-6 py-3 rounded-xl bg-[#0B5D3F] text-white font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Save CTA Settings
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT PUBLICATION MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {editingId ? "Edit Publication / Resource" : "Add New Publication / Resource"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Fill out the publication details below for the Knowledge Hub.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Document Title *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. State of Global Forests 2026"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Classification / Type *</label>
                  <select
                    value={formData.type || "Report"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                  >
                    {PUBLICATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Publication Date / Year</label>
                  <input
                    type="text"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. May 2025 or 2026"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Estimated Downloads / Reads Count</label>
                  <input
                    type="number"
                    value={formData.downloads || 0}
                    onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="8420"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[#0B5D3F] rounded border-gray-300 focus:ring-[#0B5D3F]"
                    />
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Star size={13} className="text-amber-500 fill-amber-500" /> Feature in Top 3 Cards
                    </span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Summary / Abstract</label>
                  <textarea
                    rows={3}
                    value={formData.desc || ""}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="Brief description or research abstract..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Cover Image (Recommended for Featured Cards)"
                    value={formData.image || ""}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="knowledge_hub_images"
                    aspectRatio="wide"
                    helpText="Upload an attractive cover photo or paste an image URL"
                  />
                </div>

                <div className="sm:col-span-2 bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Document PDF / File Download URL</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={formData.fileUrl || ""}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="https://.../document.pdf or upload below"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium focus:outline-none"
                    />
                    <label className="cursor-pointer bg-[#0B5D3F] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#0a5237] transition-all flex items-center gap-1.5 shrink-0">
                      <Upload size={13} /> {isUploadingDoc ? "Uploading..." : "Upload File"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip,.xls,.xlsx"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        disabled={isUploadingDoc}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    When visitors click "Download", this file or URL will automatically download or open.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Online Read Link (Optional)</label>
                  <input
                    type="text"
                    value={formData.link || ""}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. /news/1 or external article URL"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveResource}
                  className="px-6 py-2.5 rounded-xl bg-[#0B5D3F] text-white font-bold text-xs hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
                >
                  {editingId ? "Update Publication" : "Add Publication"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-100 shadow-xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Delete Publication?</h4>
              <p className="text-xs text-gray-500 mb-6">
                Are you sure you want to remove this publication from the Knowledge Hub? This cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteResource}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
