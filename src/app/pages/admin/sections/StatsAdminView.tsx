import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Edit3, Trash2, AlertCircle, CheckCircle2, Sparkles,
  TreePine, Droplets, Users, Globe2, Target, Award, Save
} from "lucide-react";
import { resolveIcon } from "./ProgramsView";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export interface StatItem {
  id: number;
  iconName: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export function getInitialStats(): StatItem[] {
  return [
    { id: 1, iconName: "TreePine", value: 2400000, suffix: "+", label: "Trees Planted", description: "Across reforestation projects worldwide", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
    { id: 2, iconName: "Users", value: 190, suffix: "+", label: "Countries Reached", description: "Our global network of change-makers", color: "text-[#173B63]", bgColor: "bg-[#173B63]/10" },
    { id: 3, iconName: "Target", value: 470, suffix: "+", label: "Active Projects", description: "0 active initiatives", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
    { id: 4, iconName: "Globe2", value: 80, suffix: "+", label: "Partner Countries", description: "+5 new countries", color: "text-[#D6A95A]", bgColor: "bg-[#D6A95A]/10" },
    { id: 5, iconName: "Building2", value: 12000, suffix: "+", label: "Communities", description: "+0 across 3 sectors", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
    { id: 6, iconName: "Leaf", value: 150000, suffix: " MT", label: "CO₂ Reduced", description: "Derived from trees", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
    { id: 7, iconName: "Award", value: 24, suffix: "", label: "International Awards", description: "+3 this year", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
  ];
}

export default function StatsAdminView() {
  const [stats, setStats, loading] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<StatItem>>({
    label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10"
  });

  // Ensure "International Awards" and "Active Projects" are present in stats
  useEffect(() => {
    if (stats && stats.length > 0) {
      let needsUpdate = false;
      const updated = [...stats];

      const hasAwards = updated.some(s => s.label.toLowerCase().includes("award"));
      if (!hasAwards) {
        const awardsItem: StatItem = {
          id: 7,
          iconName: "Award",
          value: 24,
          suffix: "",
          label: "International Awards",
          description: "+3 this year",
          color: "text-[#4CAF50]",
          bgColor: "bg-[#4CAF50]/10"
        };
        updated.push(awardsItem);
        needsUpdate = true;
      }

      const hasProjects = updated.some(s => s.label.toLowerCase().includes("project"));
      if (!hasProjects) {
        const projectsItem: StatItem = {
          id: 3,
          iconName: "Target",
          value: 470,
          suffix: "+",
          label: "Active Projects",
          description: "0 active initiatives",
          color: "text-[#4CAF50]",
          bgColor: "bg-[#4CAF50]/10"
        };
        updated.push(projectsItem);
        needsUpdate = true;
      }

      if (needsUpdate) {
        setStats(updated);
        saveFirestoreData("esn_stats_admin", updated);
      }
    }
  }, [stats]);

  const saveStats = async (newData: StatItem[]) => {
    // Automatically recalculate and synchronize CO2 sequestered whenever Trees Planted changes
    const treeStat = newData.find(s => s.label.toLowerCase().includes("tree") || s.iconName === "TreePine");
    let synchronized = newData;
    if (treeStat && treeStat.value) {
      const computedCO2 = Math.round(treeStat.value * 0.0625);
      synchronized = newData.map(s => {
        if (s.label.toLowerCase().includes("co₂") || s.label.toLowerCase().includes("co2") || s.label.toLowerCase().includes("carbon")) {
          return { ...s, value: computedCO2, label: "CO₂ Sequestered", suffix: " MT" };
        }
        return s;
      });
    }
    setStats(synchronized);
    await saveFirestoreData("esn_stats_admin", synchronized);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSave = () => {
    if (!formData.label || !formData.description) return;
    if (editingId !== null) {
      saveStats(stats.map(s => s.id === editingId ? { ...s, ...formData } as StatItem : s));
      setEditingId(null);
    } else {
      const newId = stats.length > 0 ? Math.max(...stats.map(s => s.id)) + 1 : 1;
      saveStats([...stats, { ...formData, id: newId } as StatItem]);
    }
    setShowAdd(false);
  };

  const startEdit = (s: StatItem) => {
    setFormData(s);
    setEditingId(s.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveStats(stats.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  // Quick edit state for Impact Dashboard Cards
  const activeProjectsItem = stats.find(s => s.label.toLowerCase().includes("project")) || {
    id: 3, iconName: "Target", value: 470, suffix: "+", label: "Active Projects", description: "0 active initiatives", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10"
  };
  const awardsItem = stats.find(s => s.label.toLowerCase().includes("award")) || {
    id: 7, iconName: "Award", value: 24, suffix: "", label: "International Awards", description: "+3 this year", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10"
  };
  const treesItem = stats.find(s => s.label.toLowerCase().includes("tree")) || {
    id: 1, iconName: "TreePine", value: 2400000, suffix: "+", label: "Trees Planted", description: "Across reforestation projects worldwide", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10"
  };
  const countriesItem = stats.find(s => s.label.toLowerCase().includes("countr")) || {
    id: 4, iconName: "Globe2", value: 80, suffix: "+", label: "Countries Active", description: "+5 new countries", color: "text-[#D6A95A]", bgColor: "bg-[#D6A95A]/10"
  };
  const commItem = stats.find(s => s.label.toLowerCase().includes("communit")) || {
    id: 5, iconName: "Building2", value: 12000, suffix: "+", label: "Communities Reached", description: "+0 across 3 sectors", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10"
  };

  const updateQuickStat = (id: number, field: "value" | "suffix" | "description", val: any) => {
    const updated = stats.map(s => s.id === id ? { ...s, [field]: val } : s);
    saveStats(updated);
  };

  const isTreeStat = (formData.label || "").toLowerCase().includes("tree") || formData.iconName === "TreePine";

  const filtered = (stats || []).filter(s => {
    if (!s) return false;
    const label = String(s.label || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || label.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF8F1] border border-[#A2DCBA] text-[#0B5D3F] text-xs font-bold mb-2">
            <Sparkles size={13} /> Impact & Homepage Metrics
          </div>
          <h3 className="text-gray-900 font-bold text-xl sm:text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Impact Stats & Dashboard Cards</h3>
          <p className="text-sm text-gray-500">Manage all statistics displayed on the homepage and the live Measuring Real Change impact dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 size={15} /> Synced to Live Site!
            </motion.div>
          )}
          <button onClick={() => { setEditingId(null); setFormData({ label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-sm">
            <Plus size={16} /> Add Custom Stat
          </button>
        </div>
      </div>

      {/* ─── Impact Dashboard Cards Quick Manager ─── */}
      <div className="bg-gradient-to-br from-[#0B5D3F]/5 via-white to-[#173B63]/5 rounded-3xl p-6 border-2 border-[#0B5D3F]/20 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="font-black text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Target size={20} className="text-[#0B5D3F]" />
              Measuring Real Change — Impact Dashboard KPI Cards
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              These 6 cards are prominently featured on the <strong>Impact Page (/impact)</strong>. Edit Active Projects, International Awards, Trees, and others below:
            </p>
          </div>
          <div className="text-xs text-gray-400 font-semibold bg-white px-3 py-1.5 rounded-xl border border-gray-200 shrink-0">
            Real-time live sync
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Trees */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0B5D3F] flex items-center justify-center">
                  <TreePine size={18} />
                </div>
                <span className="text-xs font-bold text-gray-800">Trees Planted</span>
              </div>
              <span className="text-[10px] bg-emerald-100/60 text-[#0B5D3F] px-2 py-0.5 rounded-full font-bold">Auto-syncs CO₂</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Value</label>
                <input
                  type="number"
                  value={treesItem.value || 0}
                  onChange={e => updateQuickStat(treesItem.id, "value", Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Suffix</label>
                <input
                  type="text"
                  value={treesItem.suffix || "+"}
                  onChange={e => updateQuickStat(treesItem.id, "suffix", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-500">
              Sequestered: <strong>{Math.round(Number(treesItem.value || 0) * 0.0625).toLocaleString()} MT CO₂</strong>
            </div>
          </div>

          {/* Card 2: Communities */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#173B63] flex items-center justify-center">
                  <Users size={18} />
                </div>
                <span className="text-xs font-bold text-gray-800">Communities Reached</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Value</label>
                <input
                  type="number"
                  value={commItem.value || 0}
                  onChange={e => updateQuickStat(commItem.id, "value", Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Suffix</label>
                <input
                  type="text"
                  value={commItem.suffix || "+"}
                  onChange={e => updateQuickStat(commItem.id, "suffix", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Subtext / Change</label>
              <input
                type="text"
                value={commItem.description || ""}
                onChange={e => updateQuickStat(commItem.id, "description", e.target.value)}
                placeholder="+0 across 3 sectors"
                className="w-full px-3 py-1.5 text-xs text-gray-700 bg-[#F6FBF8] border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          {/* Card 3: Countries Active */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D6A95A] flex items-center justify-center">
                  <Globe2 size={18} />
                </div>
                <span className="text-xs font-bold text-gray-800">Countries Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Value</label>
                <input
                  type="number"
                  value={countriesItem.value || 0}
                  onChange={e => updateQuickStat(countriesItem.id, "value", Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Suffix</label>
                <input
                  type="text"
                  value={countriesItem.suffix || "+"}
                  onChange={e => updateQuickStat(countriesItem.id, "suffix", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Subtext / Change</label>
              <input
                type="text"
                value={countriesItem.description || ""}
                onChange={e => updateQuickStat(countriesItem.id, "description", e.target.value)}
                placeholder="+5 new countries"
                className="w-full px-3 py-1.5 text-xs text-gray-700 bg-[#F6FBF8] border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          {/* Card 4: ACTIVE PROJECTS (Circled in User Request) */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border-2 border-[#4CAF50] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#4CAF50] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
              Circled by Admin
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#0B5D3F] flex items-center justify-center shadow-sm">
                  <Target size={18} />
                </div>
                <div>
                  <span className="text-xs font-black text-gray-900 block">Active Projects</span>
                  <span className="text-[10px] text-[#0B5D3F] font-bold">Featured on Impact Card</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Projects Count *</label>
                <input
                  type="number"
                  value={activeProjectsItem.value || 0}
                  onChange={e => updateQuickStat(activeProjectsItem.id, "value", Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-black text-[#0B5D3F] bg-white border border-[#4CAF50]/50 rounded-xl focus:outline-none focus:border-[#0B5D3F] shadow-inner"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Suffix (e.g. +)</label>
                <input
                  type="text"
                  value={activeProjectsItem.suffix ?? "+"}
                  onChange={e => updateQuickStat(activeProjectsItem.id, "suffix", e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-white border border-[#4CAF50]/50 rounded-xl focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Subtext (e.g. 0 active initiatives)</label>
              <input
                type="text"
                value={activeProjectsItem.description || ""}
                onChange={e => updateQuickStat(activeProjectsItem.id, "description", e.target.value)}
                placeholder="e.g. 0 active initiatives"
                className="w-full px-3 py-1.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          {/* Card 5: INTERNATIONAL AWARDS (Circled in User Request) */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border-2 border-[#4CAF50] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#4CAF50] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
              Circled by Admin
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#4CAF50] flex items-center justify-center shadow-sm">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-xs font-black text-gray-900 block">International Awards</span>
                  <span className="text-[10px] text-[#4CAF50] font-bold">Featured on Impact Card</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Awards Count *</label>
                <input
                  type="number"
                  value={awardsItem.value || 0}
                  onChange={e => updateQuickStat(awardsItem.id, "value", Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-black text-[#0B5D3F] bg-white border border-[#4CAF50]/50 rounded-xl focus:outline-none focus:border-[#0B5D3F] shadow-inner"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Suffix</label>
                <input
                  type="text"
                  value={awardsItem.suffix ?? ""}
                  onChange={e => updateQuickStat(awardsItem.id, "suffix", e.target.value)}
                  placeholder="Leave empty or +"
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 bg-white border border-[#4CAF50]/50 rounded-xl focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Subtext (e.g. +3 this year)</label>
              <input
                type="text"
                value={awardsItem.description || ""}
                onChange={e => updateQuickStat(awardsItem.id, "description", e.target.value)}
                placeholder="e.g. +3 this year"
                className="w-full px-3 py-1.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          {/* Card 6: CO2 Sequestered */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#173B63] flex items-center justify-center">
                  <Droplets size={18} />
                </div>
                <span className="text-xs font-bold text-gray-800">CO₂ Sequestered</span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold">MT Metric</span>
            </div>
            <div className="bg-[#F6FBF8] p-3 rounded-xl border border-gray-200 mb-2">
              <div className="text-lg font-black text-[#173B63]">
                {Math.round(Number(treesItem.value || 0) * 0.0625).toLocaleString()} MT
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Automatically calculated from Trees Planted based on standard 0.0625 MT per tree formula.
              </p>
            </div>
            <div className="text-[11px] text-[#4CAF50] font-semibold">
              Live synchronized with calculator on /impact
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden shadow-sm">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Stat" : "Add Stat"}</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Label *</label>
                <input type="text" value={formData.label || ""} onChange={e => setFormData({ ...formData, label: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description / Subtext *</label>
                <input type="text" value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Value (Number) *</label>
                <input type="number" value={formData.value || 0} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                {isTreeStat && (
                  <p className="text-xs text-[#0B5D3F] font-semibold mt-1.5 bg-[#EBF8F1] p-2 rounded-lg border border-[#A2DCBA]">
                    🌳 Auto-Calculation: {Number(formData.value || 0).toLocaleString()} Trees = <strong>{Math.round(Number(formData.value || 0) * 0.0625).toLocaleString()} MT CO₂ Sequestered</strong> (0.0625 MT / tree)
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Suffix (e.g. +, MT)</label>
                <input type="text" value={formData.suffix ?? ""} onChange={e => setFormData({ ...formData, suffix: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name *</label>
                <input type="text" value={formData.iconName || ""} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Color Classes (Text / BG)</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.color || ""} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-1/2 px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
                  <input type="text" value={formData.bgColor || ""} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="w-1/2 px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Stat</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Delete Stat?</h4>
              <div className="flex gap-3 mt-6">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="font-bold text-gray-900 text-base">All Registered Stats ({stats.length})</h4>
            <p className="text-xs text-gray-400">All database items synchronized with the public website components</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search stats..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => {
            const Icon = resolveIcon(s.iconName);
            return (
              <div key={s.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0B5D3F]/20 transition-all flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${s.bgColor} flex items-center justify-center mb-4`}>
                    <Icon size={24} className={s.color} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-2xl mb-1">{s.value}{s.suffix}</h4>
                  <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => startEdit(s)} className="flex-1 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F] flex justify-center" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(s.id)} className="flex-1 py-1.5 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500 flex justify-center" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
