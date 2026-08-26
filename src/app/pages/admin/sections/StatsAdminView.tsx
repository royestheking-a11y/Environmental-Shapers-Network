import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";
import { resolveIcon } from "./ProgramsView";

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
    { id: 3, iconName: "Target", value: 470, suffix: "+", label: "Active Projects", description: "Environmental initiatives in progress", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
    { id: 4, iconName: "Globe2", value: 80, suffix: "+", label: "Partner Countries", description: "International collaborations active", color: "text-[#D6A95A]", bgColor: "bg-[#D6A95A]/10" },
    { id: 5, iconName: "Building2", value: 12000, suffix: "+", label: "Communities", description: "Local communities benefited globally", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" },
    { id: 6, iconName: "Leaf", value: 150000, suffix: " MT", label: "CO₂ Reduced", description: "Metric tons of carbon sequestered", color: "text-[#4CAF50]", bgColor: "bg-[#4CAF50]/10" },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function StatsAdminView() {
  const [stats, setStats, loading] = useFirestoreData<StatItem[]>("esn_stats_admin", getInitialStats());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<StatItem>>({
    label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10"
  });

  const saveStats = (newData: StatItem[]) => {
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

  const isTreeStat = (formData.label || "").toLowerCase().includes("tree") || formData.iconName === "TreePine";

  const filtered = (stats || []).filter(s => {
    if (!s) return false;
    const label = String(s.label || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || label.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Impact Stats</h3>
          <p className="text-sm text-gray-400">Manage the key statistics shown on the homepage with dynamic Tree-CO₂ calculation.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ label: "", description: "", iconName: "TreePine", value: 0, suffix: "+", color: "text-[#0B5D3F]", bgColor: "bg-[#0B5D3F]/10" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Stat
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Stat" : "Add Stat"}</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Label *</label>
                <input type="text" value={formData.label || ""} onChange={e => setFormData({ ...formData, label: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
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
                <input type="text" value={formData.suffix || ""} onChange={e => setFormData({ ...formData, suffix: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
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
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search stats..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
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
                  <button onClick={() => startEdit(s)} className="flex-1 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F] flex justify-center">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(s.id)} className="flex-1 py-1.5 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500 flex justify-center">
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
