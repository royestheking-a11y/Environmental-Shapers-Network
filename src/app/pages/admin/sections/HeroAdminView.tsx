import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";

export interface HeroSlide {
  id: number;
  tag: string;
  heading: string;
  sub: string;
}

export function getInitialHeroSlides(): HeroSlide[] {
  return [
    {
      id: 1,
      tag: "Global Environmental Action",
      heading: "Taking Small Strides to\nPreserve Our Planet",
      sub: "Ecology, as a field of science, investigates the interconnections between living organisms and their surroundings, encompassing both the physical and chemical aspects.",
    },
    {
      id: 2,
      tag: "Nature-Based Solutions",
      heading: "Together We Restore,\nProtect & Innovate",
      sub: "From reforestation to marine conservation, ESN leads science-driven environmental action across 80+ countries, shaping a sustainable future for generations to come.",
    },
    {
      id: 3,
      tag: "Youth Climate Leadership",
      heading: "Shaping the Leaders\nof Tomorrow Today",
      sub: "Our youth programs empower the next generation of environmental advocates with the knowledge, tools, and networks to drive meaningful change globally.",
    },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function HeroAdminView() {
  const [slides, setSlides, loading] = useFirestoreData<HeroSlide[]>("esn_hero_admin", getInitialHeroSlides());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<HeroSlide>>({ tag: "", heading: "", sub: "" });

  const saveSlides = (newData: HeroSlide[]) => {
    setSlides(newData);
    
  };

  const handleSave = () => {
    if (!formData.heading || !formData.sub) return;
    if (editingId !== null) {
      saveSlides(slides.map(s => s.id === editingId ? { ...s, ...formData } as HeroSlide : s));
      setEditingId(null);
    } else {
      const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
      saveSlides([...slides, { ...formData, id: newId } as HeroSlide]);
    }
    setShowAdd(false);
    setFormData({ tag: "", heading: "", sub: "" });
  };

  const startEdit = (s: HeroSlide) => {
    setFormData(s);
    setEditingId(s.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      saveSlides(slides.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = (slides || []).filter(s => {
    if (!s) return false;
    const heading = String(s.heading || "").toLowerCase();
    const tag = String(s.tag || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || heading.includes(q) || tag.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hero Section Slides</h3>
          <p className="text-sm text-gray-400">Manage the slides that appear on the homepage hero.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ tag: "", heading: "", sub: "" }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Slide" : "Add Slide"}</h4>
            <div className="grid gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tag / Label</label>
                <input type="text" value={formData.tag || ""} onChange={e => setFormData({ ...formData, tag: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" placeholder="e.g. Global Environmental Action" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Heading (Use \n for line breaks) *</label>
                <textarea rows={2} value={formData.heading || ""} onChange={e => setFormData({ ...formData, heading: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subheading *</label>
                <textarea rows={3} value={formData.sub || ""} onChange={e => setFormData({ ...formData, sub: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Slide</button>
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
              <h4 className="font-bold text-gray-900 mb-2">Delete Slide?</h4>
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
          <input type="text" placeholder="Search slides..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="flex flex-col gap-4">
          {filtered.map(s => (
            <div key={s.id} className="border border-gray-100 rounded-xl p-5 flex items-start justify-between hover:border-[#0B5D3F]/20 transition-all">
              <div className="flex-1">
                <div className="text-xs font-bold text-[#4CAF50] mb-2">{s.tag}</div>
                <h4 className="font-bold text-gray-900 text-lg mb-2 whitespace-pre-wrap leading-tight">{s.heading}</h4>
                <p className="text-sm text-gray-500">{s.sub}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => startEdit(s)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F]">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setDeleteConfirmId(s.id)} className="p-2 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
