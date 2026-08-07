import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";

export interface Partner {
  id: number;
  name: string;
}

export function getInitialPartners(): Partner[] {
  return [
    { id: 1, name: "UNEP" },
    { id: 2, name: "WWF" },
    { id: 3, name: "IUCN" },
    { id: 4, name: "GEF" },
    { id: 5, name: "World Bank" },
    { id: 6, name: "UNDP" },
    { id: 7, name: "FAO" },
    { id: 8, name: "UNESCO" },
    { id: 9, name: "Greenpeace" },
    { id: 10, name: "Nature.org" },
    { id: 11, name: "350.org" },
    { id: 12, name: "CI" },
    { id: 13, name: "WCS" },
    { id: 14, name: "AWF" },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function PartnersView() {
  const [partners, setPartners, loading] = useFirestoreData<Partner[]>("esn_partners_admin", getInitialPartners());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<Partner>>({
    name: ""
  });

  const savePartners = (newData: Partner[]) => {
    setPartners(newData);
    
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    if (editingId !== null) {
      savePartners(partners.map(p => p.id === editingId ? { ...p, ...formData } as Partner : p));
      setEditingId(null);
    } else {
      const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
      savePartners([...partners, { ...formData, id: newId } as Partner]);
    }
    setShowAdd(false);
    setFormData({ name: "" });
  };

  const startEdit = (p: Partner) => {
    setFormData(p);
    setEditingId(p.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      savePartners(partners.filter(p => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Trusted Partners</h3>
          <p className="text-sm text-gray-400">Manage the list of partner organizations.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: "" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Partner
        </button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Partner" : "Add Partner"}</h4>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 mb-1.5 block">Partner Name *</label>
              <input type="text" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Partner</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
              <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Delete Partner?</h4>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <div className="relative max-w-sm mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search partners..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-[#0B5D3F]/20 transition-all">
              <span className="font-bold text-gray-800 text-sm">{p.name}</span>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p)} className="p-1 text-gray-400 hover:text-[#0B5D3F]">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => setDeleteConfirmId(p.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
