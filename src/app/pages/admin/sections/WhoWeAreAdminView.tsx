import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle, Save, AlignLeft, LayoutGrid } from "lucide-react";
import { resolveIcon } from "./ProgramsView";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export interface WhoWeAreFeature {
  id: number;
  iconName: string;
  title: string;
  description: string;
}

export interface WhoWeAreStory {
  tagline: string;
  subtagline: string;
  title1: string;
  title2: string;
  description: string;
  quoteText: string;
  quoteAuthor: string;
}

export function getInitialWhoWeAreStory(): WhoWeAreStory {
  return {
    tagline: "Who We Are",
    subtagline: "Est. 2019 · 80+ Countries",
    title1: "Shaping Change Through",
    title2: "Science, Community & Courage",
    description: "Environmental Shapers Network (ESN) is a globally active NGO bringing together environmental scientists, frontline communities, youth advocates, researchers, and policymakers across 80+ countries. We operate at the intersection of ecology, social justice, and systemic innovation.",
    quoteText: "When the floods came and scientists confirmed climate change as the cause, we realized that hope without action was just a comfortable lie. We had to build something real.",
    quoteAuthor: "Imran Hossain & Abu Hanif · Co-Founders, ESN",
  };
}

export function getInitialWhoWeAreFeatures(): WhoWeAreFeature[] {
  return [
    {
      id: 1,
      iconName: "Globe2",
      title: "Global-Local Integration",
      description: "We operate through regional hubs and grassroots networks, ensuring solutions are globally informed and locally owned.",
    },
    {
      id: 2,
      iconName: "Microscope",
      title: "Evidence-Based Research",
      description: "Every program is grounded in rigorous science, co-designed with leading universities and experts.",
    },
    {
      id: 3,
      iconName: "GraduationCap",
      title: "Youth-Centred Leadership",
      description: "We invest in the next generation — equipping youth with tools to drive lasting systemic change.",
    }
  ];
}

export default function WhoWeAreAdminView() {
  const [activeTab, setActiveTab] = useState<"story" | "features">("story");
  const [story, setStory] = useFirestoreData<WhoWeAreStory>("esn_whoweare_story", getInitialWhoWeAreStory());
  const [features, setFeatures, loading] = useFirestoreData<WhoWeAreFeature[]>("esn_whoweare_admin", getInitialWhoWeAreFeatures());
  
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<WhoWeAreFeature>>({ title: "", description: "", iconName: "Target" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const notifySave = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveStory = async () => {
    setIsSaving(true);
    await saveFirestoreData("esn_whoweare_story", story);
    setIsSaving(false);
    notifySave("Who We Are story & headline updated and published live!");
  };

  const saveFeatures = async (newData: WhoWeAreFeature[]) => {
    setFeatures(newData);
    await saveFirestoreData("esn_whoweare_admin", newData);
    notifySave("Feature updated and published live!");
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;
    if (editingId !== null) {
      saveFeatures(features.map(f => f.id === editingId ? { ...f, ...formData } as WhoWeAreFeature : f));
      setEditingId(null);
    } else {
      const newId = features.length > 0 ? Math.max(...features.map(f => f.id)) + 1 : 1;
      saveFeatures([...features, { ...formData, id: newId } as WhoWeAreFeature]);
    }
    setShowAdd(false);
    setFormData({ title: "", description: "", iconName: "Target" });
  };

  const startEdit = (f: WhoWeAreFeature) => {
    setFormData(f);
    setEditingId(f.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveFeatures(features.filter(f => f.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = (features || []).filter(f => {
    if (!f) return false;
    const title = String(f.title || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || title.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Who We Are Section</h3>
          <p className="text-sm text-gray-400">Manage the homepage Who We Are story, quote, and feature cards.</p>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("story")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "story" ? "bg-[#0B5D3F] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <AlignLeft size={16} /> Story & Headline
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "features" ? "bg-[#0B5D3F] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutGrid size={16} /> Feature Cards ({features.length})
        </button>
      </div>

      {activeTab === "story" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid gap-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Section Tagline</label>
                <input
                  type="text"
                  value={story?.tagline || ""}
                  onChange={e => setStory({ ...story, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subtagline / Stats Text</label>
                <input
                  type="text"
                  value={story?.subtagline || ""}
                  onChange={e => setStory({ ...story, subtagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Heading Part 1 (Top Line)</label>
                <input
                  type="text"
                  value={story?.title1 || ""}
                  onChange={e => setStory({ ...story, title1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Heading Part 2 (Green Gradient)</label>
                <input
                  type="text"
                  value={story?.title2 || ""}
                  onChange={e => setStory({ ...story, title2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Main Narrative / Description</label>
              <textarea
                rows={3}
                value={story?.description || ""}
                onChange={e => setStory({ ...story, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Co-Founders Quote</label>
              <textarea
                rows={2}
                value={story?.quoteText || ""}
                onChange={e => setStory({ ...story, quoteText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Quote Attribution / Authors</label>
              <input
                type="text"
                value={story?.quoteAuthor || ""}
                onChange={e => setStory({ ...story, quoteAuthor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          <button
            onClick={handleSaveStory}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save Story & Headline"}
          </button>
        </div>
      )}

      {activeTab === "features" && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-900">Key Pillar & Feature Cards</h4>
            <button
              onClick={() => { setEditingId(null); setFormData({ title: "", description: "", iconName: "Target" }); setShowAdd(true); }}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
            >
              <Plus size={16} /> Add Feature
            </button>
          </div>

          <AnimatePresence>
            {showAdd && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden shadow-sm">
                <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Feature" : "Add Feature"}</h4>
                <div className="grid gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                    <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                    <textarea rows={2} value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name *</label>
                    <input type="text" value={formData.iconName || ""} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" placeholder="e.g. Globe2, Microscope, GraduationCap, Target" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Feature</button>
                  <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {deleteConfirmId !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
                  <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">Delete Feature?</h4>
                  <p className="text-sm text-gray-500 mb-6">This will remove this feature from the homepage.</p>
                  <div className="flex gap-3">
                    <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="relative max-w-sm mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search features..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-4">
              {filtered.map(f => {
                const Icon = resolveIcon(f.iconName);
                return (
                  <div key={f.id} className="border border-gray-100 rounded-xl p-5 flex items-start justify-between hover:border-[#0B5D3F]/20 transition-all">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#E6F3EB] flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-[#0A3D2A]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-md mb-1">{f.title}</h4>
                        <p className="text-sm text-gray-500">{f.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => startEdit(f)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F]">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(f.id)} className="p-2 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
