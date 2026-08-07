import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";
import { resolveIcon } from "./ProgramsView";

export interface ThematicArea {
  id: number;
  icon: string;
  slug: string;
  title: string;
  desc: string;
  tag: string;
}

export function getInitialThematicAreas(): ThematicArea[] {
  return [
    { id: 1, icon: "Target", slug: "sdgs", title: "Sustainable Development Goals", desc: "Mainstreaming all 17 SDGs across our programs — ensuring every intervention contributes measurably to the 2030 Agenda for Sustainable Development at local, national, and global levels.", tag: "All SDGs" },
    { id: 2, icon: "Thermometer", slug: "climate-change", title: "Climate Change", desc: "Addressing the root causes and impacts of climate change through mitigation, adaptation, loss and damage frameworks, and multilateral climate diplomacy aligned with the Paris Agreement goals.", tag: "SDG 13" },
    { id: 3, icon: "Tent", slug: "displacement-migration", title: "Displacement & Migration", desc: "Protecting climate-displaced populations through rights-based policy frameworks, humanitarian response, and long-term durable solutions that address intersections of climate and migration.", tag: "SDG 10 · 16" },
    { id: 4, icon: "Wheat", slug: "livelihoods", title: "Livelihoods", desc: "Building green, climate-resilient livelihoods for smallholder farmers, coastal communities, and forest-dependent peoples through agroecology and sustainable fisheries.", tag: "SDG 1 · 8" },
    { id: 5, icon: "Bug", slug: "biodiversity", title: "Biodiversity", desc: "Halting and reversing biodiversity loss through ecosystem protection, species recovery, indigenous community co-management, and the Kunming-Montreal Global Biodiversity Framework.", tag: "SDG 15" },
    { id: 6, icon: "Zap", slug: "green-energy", title: "Green Energy", desc: "Accelerating the just energy transition by scaling renewable energy access, phasing out fossil fuel subsidies, and ensuring clean energy benefits reach the most marginalised communities first.", tag: "SDG 7" },
    { id: 7, icon: "Shield", slug: "drr", title: "Disaster Risk Reduction", desc: "Strengthening community and national resilience through early warning systems, disaster preparedness frameworks, and nature-based DRR solutions aligned with the Sendai Framework.", tag: "SDG 11 · 13" },
    { id: 8, icon: "Building", slug: "urban-resilience", title: "Urban Resilience", desc: "Transforming cities into climate-resilient, liveable spaces with green infrastructure, urban forests, low-carbon mobility, and integrated water and waste management.", tag: "SDG 11" },
    { id: 9, icon: "Fish", slug: "blue-economy", title: "Blue Economy", desc: "Developing sustainable ocean economies that protect marine biodiversity, support coastal livelihoods, advance blue carbon solutions, and ensure equitable access to ocean resources.", tag: "SDG 14" }
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function ThematicAreasView() {
  const [areas, setAreas, loading] = useFirestoreData<ThematicArea[]>("esn_thematic_areas_admin", getInitialThematicAreas());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Partial<ThematicArea>>({
    icon: "Target", slug: "", title: "", desc: "", tag: ""
  });

  const saveAreas = (newData: ThematicArea[]) => {
    setAreas(newData);
    
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug) return;
    
    if (editingId !== null) {
      saveAreas(areas.map(a => a.id === editingId ? { ...a, ...formData } as ThematicArea : a));
      setEditingId(null);
    } else {
      const newId = areas.length > 0 ? Math.max(...areas.map(a => a.id)) + 1 : 1;
      saveAreas([{ ...formData, id: newId } as ThematicArea, ...areas]);
    }
    setShowAdd(false);
    setFormData({ icon: "Target", slug: "", title: "", desc: "", tag: "" });
  };

  const startEdit = (a: ThematicArea) => {
    setFormData(a);
    setEditingId(a.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveAreas(areas.filter(a => a.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = areas.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.slug.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Thematic Areas</h3>
          <p className="text-sm text-gray-400">Manage the core thematic focus areas of the organization.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ icon: "Target", slug: "", title: "", desc: "", tag: "" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Theme
        </button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Theme" : "Add Theme"}</h4>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">URL Slug *</label>
                <input type="text" value={formData.slug || ""} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Icon Name (Lucide)</label>
                <input type="text" value={formData.icon || ""} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tag (e.g. SDG 13)</label>
                <input type="text" value={formData.tag || ""} onChange={e => setFormData({ ...formData, tag: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                <textarea value={formData.desc || ""} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] h-24 resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Theme</button>
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
              <h4 className="font-bold text-gray-900 mb-2">Delete Theme?</h4>
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
          <input type="text" placeholder="Search thematic areas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(a => {
            const Icon = resolveIcon(a.icon);
            return (
              <div key={a.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#0B5D3F]/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-[#0B5D3F]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{a.title}</h4>
                      <div className="text-xs text-gray-500">{a.tag}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(a)} className="p-1.5 text-gray-400 hover:bg-[#0B5D3F]/10 hover:text-[#0B5D3F] rounded-lg">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => setDeleteConfirmId(a.id)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
