import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Edit3, Trash2, AlertCircle, CheckCircle2, Sparkles,
  TreePine, Droplets, Users, Globe2, Target, Award, Save, RefreshCw,
  ExternalLink, Eye, Info
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
    { id: 2, iconName: "Leaf", value: 150000, suffix: " MT", label: "CO₂ Sequestered", description: "Metric tons of carbon sequestered", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
    { id: 3, iconName: "Building2", value: 12000, suffix: "+", label: "Communities Reached", description: "+0 across 3 sectors", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
    { id: 4, iconName: "Globe2", value: 80, suffix: "+", label: "Countries Active", description: "+5 new countries", color: "text-[#D6A95A]", bgColor: "bg-[#D6A95A]/10" },
    { id: 5, iconName: "Target", value: 470, suffix: "+", label: "Active Projects", description: "0 active initiatives", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
    { id: 6, iconName: "Award", value: 24, suffix: "", label: "International Awards", description: "+3 this year", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
  ];
}

export default function StatsAdminView() {
  // ─── Single Unified Dataset: esn_stats_admin powers Homepage, /impact, /about, and all pages ───
  const [stats, setStats] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<StatItem>>({
    label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10"
  });

  const showToast = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const currentStats = stats && stats.length > 0 ? stats : getInitialStats();

  const saveStats = async (newData: StatItem[], customToast = "Impact Stats updated live across all pages!") => {
    setStats(newData);
    await saveFirestoreData("esn_stats_admin", newData);
    showToast(customToast);
  };

  // Quick inline update for any stat card
  const updateInlineStat = (id: number, field: "value" | "suffix" | "label" | "description", val: any) => {
    const updated = currentStats.map(s => s.id === id ? { ...s, [field]: val } : s);
    saveStats(updated);
  };

  // Auto-sync CO2 from Trees if requested
  const handleAutoCalcCO2 = () => {
    const treeStat = currentStats.find(s => s.label?.toLowerCase().includes("tree") || s.iconName === "TreePine") || currentStats[0];
    const treeVal = Number(treeStat?.value || 0);
    const calculatedCO2 = Math.round(treeVal * 0.0625);

    let foundCO2 = false;
    const updated = currentStats.filter(s => {
      const isCO2 = s.label?.toLowerCase().includes("co2") || s.label?.toLowerCase().includes("co₂") || s.label?.toLowerCase().includes("carbon");
      if (isCO2) {
        if (foundCO2) return false;
        foundCO2 = true;
      }
      return true;
    }).map((s) => {
      const isCO2 = s.label?.toLowerCase().includes("co2") || s.label?.toLowerCase().includes("co₂") || s.label?.toLowerCase().includes("carbon");
      if (isCO2) {
        return { ...s, value: calculatedCO2, suffix: " MT", label: "CO₂ Sequestered", description: "Metric tons of carbon sequestered" };
      }
      return s;
    });
    
    if (!foundCO2) {
      const newId = updated.length > 0 ? Math.max(...updated.map(s => s.id)) + 1 : 1;
      updated.push({ id: newId, iconName: "Leaf", value: calculatedCO2, suffix: " MT", label: "CO₂ Sequestered", description: "Metric tons of carbon sequestered", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" });
    }

    saveStats(updated, `CO₂ calculated: ${calculatedCO2.toLocaleString()} MT based on ${treeVal.toLocaleString()} trees`);
  };

  useEffect(() => {
    if (stats && stats.length > 0) {
      const co2Stats = stats.filter(s => s.label?.toLowerCase().includes("co2") || s.label?.toLowerCase().includes("co₂") || s.label?.toLowerCase().includes("carbon"));
      if (co2Stats.length > 1) {
        let foundCO2 = false;
        const deduped = stats.filter(s => {
          const isCO2 = s.label?.toLowerCase().includes("co2") || s.label?.toLowerCase().includes("co₂") || s.label?.toLowerCase().includes("carbon");
          if (isCO2) {
            if (foundCO2) return false;
            foundCO2 = true;
          }
          return true;
        });
        setStats(deduped);
        saveFirestoreData("esn_stats_admin", deduped);
      }
    }
  }, [stats, setStats]);

  const handleSaveModal = () => {
    if (!formData.label?.trim()) return;
    if (editingId !== null) {
      const updated = currentStats.map(s => s.id === editingId ? { ...s, ...formData } as StatItem : s);
      saveStats(updated, "Stat updated live!");
      setEditingId(null);
    } else {
      const newId = currentStats.length > 0 ? Math.max(...currentStats.map(s => s.id)) + 1 : 1;
      saveStats([...currentStats, { ...formData, id: newId } as StatItem], "New stat added live!");
    }
    setShowAdd(false);
  };

  const startEditStat = (s: StatItem) => {
    setFormData(s);
    setEditingId(s.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveStats(currentStats.filter(s => s.id !== deleteConfirmId), "Stat removed from all pages.");
      setDeleteConfirmId(null);
    }
  };

  const handleResetToClean6 = async () => {
    const defaults = getInitialStats();
    await saveStats(defaults, "Reset to clean 6 standard impact stats!");
    setResetConfirm(false);
  };

  const filtered = currentStats.filter(s => {
    if (!s) return false;
    const label = String(s.label || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || label.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Header: Universal Impact Control ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF8F1] border border-[#A2DCBA] text-[#0B5D3F] text-xs font-bold mb-2 shadow-xs">
            <Sparkles size={13} /> Single Unified Impact System
          </div>
          <h3 className="text-gray-900 font-black text-xl sm:text-2xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Unified Impact Stats & Metrics
          </h3>
          <p className="text-sm text-gray-500 max-w-2xl mt-0.5">
            One single edit updates <strong>everywhere</strong> simultaneously: Homepage 1-Line Impact Bar, the /impact Measuring Real Change Dashboard, /about Hero badges, and all public components.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccessMsg && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 shadow-sm">
              <CheckCircle2 size={15} /> {savedSuccessMsg}
            </motion.div>
          )}

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all shadow-xs"
              title="Preview Homepage"
            >
              <Eye size={13} /> View Home <ExternalLink size={11} className="text-gray-400" />
            </a>
            <a
              href="/impact"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all shadow-xs"
              title="Preview Impact Dashboard"
            >
              <Eye size={13} /> View /impact <ExternalLink size={11} className="text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Information Banner: Explains Universal Sync ─── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 text-[#0B5D3F] shadow-xs">
            <Info size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Synchronized Website-Wide Impact ({currentStats.length} Cards)</div>
            <div className="text-[11px] text-gray-600">
              Editing values or subtexts below instantly propagates to both the Homepage 1-line bar and the /impact KPI dashboard.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAutoCalcCO2}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D3F] bg-white border border-[#0B5D3F]/30 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all shadow-xs"
            title="Calculate CO2 based on Trees Count (0.0625 MT/tree)"
          >
            <RefreshCw size={12} /> Auto-Sync CO₂ from Trees
          </button>
          <button
            onClick={() => setResetConfirm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-all shadow-xs"
            title="Restore standard 6 cards"
          >
            <RefreshCw size={12} /> Reset to Clean 6
          </button>
        </div>
      </div>

      {/* ─── Search & Add Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search impact stats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-[#0B5D3F]"
          />
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" });
            setShowAdd(true);
          }}
          className="inline-flex items-center gap-1.5 bg-[#0B5D3F] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all shadow-sm"
        >
          <Plus size={15} /> Add Custom Stat
        </button>
      </div>

      {/* ─── Add / Edit Modal Drawer ─── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-6 border-2 border-[#0B5D3F]/30 shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{editingId ? "Edit Impact Stat Details" : "Add New Website-Wide Impact Stat"}</h4>
                <p className="text-xs text-gray-400">Updates the stat on Homepage, /impact, and all connected pages</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 text-xs font-bold">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Label / Title *</label>
                <input
                  type="text"
                  value={formData.label || ""}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Trees Planted"
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Numeric Value *</label>
                <input
                  type="number"
                  value={formData.value ?? 0}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Suffix (e.g. +, MT)</label>
                <input
                  type="text"
                  value={formData.suffix ?? ""}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  placeholder="e.g. +"
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1 block">Subtext / Description *</label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Across reforestation projects worldwide"
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Lucide Icon Name</label>
                <input
                  type="text"
                  value={formData.iconName || ""}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  placeholder="TreePine, Droplets, Users, Globe2, Target, Award..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="flex items-center gap-1.5 bg-[#0B5D3F] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all shadow-sm"
              >
                <Save size={14} /> Save Stat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Unified Stat Cards Grid (Live Across Entire Site) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s, index) => {
          const Icon = resolveIcon(s.iconName);

          return (
            <div
              key={s.id ?? index}
              className="bg-white rounded-3xl p-5 border border-gray-200/90 hover:border-[#0B5D3F]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header with Icon & Index */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl ${s.bgColor || "bg-[#0B5D3F]/10"} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={s.color || "text-[#0B5D3F]"} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">{s.label}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Stat #{index + 1} · Live Universal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditStat(s)}
                      className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit styling & icon"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(s.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Stat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Inline Quick-Edit Fields */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Value (Number)</label>
                    <input
                      type="number"
                      value={s.value ?? 0}
                      onChange={(e) => updateInlineStat(s.id, "value", Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-black text-[#0B5D3F] bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3F] shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Suffix (e.g. +, MT)</label>
                    <input
                      type="text"
                      value={s.suffix ?? ""}
                      onChange={(e) => updateInlineStat(s.id, "suffix", e.target.value)}
                      placeholder="e.g. +"
                      className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3F]"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Label / Title</label>
                  <input
                    type="text"
                    value={s.label || ""}
                    onChange={(e) => updateInlineStat(s.id, "label", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-gray-800 bg-[#F6FBF8] border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Subtext / Description</label>
                  <input
                    type="text"
                    value={s.description || ""}
                    onChange={(e) => updateInlineStat(s.id, "description", e.target.value)}
                    placeholder="e.g. Across reforestation projects worldwide"
                    className="w-full px-3 py-1.5 text-xs text-gray-700 bg-[#F6FBF8] border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>
              </div>

              {/* Sync Tag */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <span>Renders on Home, /impact, /about</span>
                <span className="font-bold text-[#0B5D3F]">Auto-Saved</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
          <AlertCircle size={28} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-semibold text-sm">No impact stats found matching &quot;{search}&quot;</p>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 text-base mb-1">Delete Impact Stat?</h4>
              <p className="text-xs text-gray-500">This stat will be removed from the Homepage, /impact Dashboard, and other public pages.</p>
              <div className="flex gap-2 mt-5">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Reset to Clean 6 Confirmation Modal ─── */}
      <AnimatePresence>
        {resetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl">
              <RefreshCw size={32} className="text-[#0B5D3F] mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 text-base mb-1">Reset to Clean 6 Standard Stats?</h4>
              <p className="text-xs text-gray-500">
                This will reset the entire website&apos;s impact system to the clean standard 6 stats (Trees Planted, CO₂ Sequestered, Communities Reached, Countries Active, Active Projects, International Awards) and clean up any duplicate or orphaned items.
              </p>
              <div className="flex gap-2 mt-5">
                <button onClick={handleResetToClean6} className="flex-1 bg-[#0B5D3F] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all">Yes, Reset</button>
                <button onClick={() => setResetConfirm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
