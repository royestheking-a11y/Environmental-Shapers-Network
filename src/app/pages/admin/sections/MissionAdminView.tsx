import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";
import { resolveIcon } from "./ProgramsView";

export interface MissionValue {
  id: number;
  iconName: string;
  title: string;
  description: string;
  color: string;
}

export function getInitialMissionValues(): MissionValue[] {
  return [
    { id: 1, iconName: "Sprout", title: "Sustainability First", description: "Every action we take is grounded in environmental responsibility and long-term ecological thinking.", color: "#0B5D3F" },
    { id: 2, iconName: "Globe2", title: "Global Collaboration", description: "We bridge borders, cultures, and disciplines to address planetary challenges with collective intelligence.", color: "#173B63" },
    { id: 3, iconName: "Users", title: "Community-Led", description: "Local communities are the heart of our work — we amplify grassroots voices to drive systemic change.", color: "#4CAF50" },
    { id: 4, iconName: "Target", title: "Action-Oriented", description: "We translate research and policy into tangible, on-the-ground environmental impact.", color: "#D6A95A" },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function MissionAdminView() {
  const [values, setValues, loading] = useFirestoreData<MissionValue[]>("esn_mission_admin", getInitialMissionValues());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MissionValue>>({ title: "", description: "", iconName: "Sprout", color: "#0B5D3F" });

  const saveValues = (newData: MissionValue[]) => {
    setValues(newData);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;
    if (editingId !== null) {
      saveValues(values.map(v => v.id === editingId ? { ...v, ...formData } as MissionValue : v));
      setEditingId(null);
    } else {
      const newId = values.length > 0 ? Math.max(...values.map(v => v.id)) + 1 : 1;
      saveValues([...values, { ...formData, id: newId } as MissionValue]);
    }
    setShowAdd(false);
  };

  const startEdit = (v: MissionValue) => {
    setFormData(v);
    setEditingId(v.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveValues(values.filter(v => v.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = values.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mission Values</h3>
          <p className="text-sm text-gray-400">Manage the core values shown in the Mission section.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ title: "", description: "", iconName: "Sprout", color: "#0B5D3F" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Value
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Value" : "Add Value"}</h4>
            <div className="grid gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                <textarea rows={2} value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name *</label>
                  <input type="text" value={formData.iconName || ""} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Color (Hex) *</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={formData.color || "#0B5D3F"} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-12 h-12 rounded cursor-pointer" />
                    <input type="text" value={formData.color || ""} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Value</button>
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
              <h4 className="font-bold text-gray-900 mb-2">Delete Value?</h4>
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
          <input type="text" placeholder="Search values..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(v => {
            const Icon = resolveIcon(v.iconName);
            return (
              <div key={v.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0B5D3F]/20 transition-all flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${v.color}15` }}>
                    <Icon size={24} color={v.color} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{v.title}</h4>
                    <p className="text-sm text-gray-500">{v.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => startEdit(v)} className="flex-1 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F] flex justify-center">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(v.id)} className="flex-1 py-1.5 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500 flex justify-center">
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
