import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";
import { resolveIcon } from "./ProgramsView";

export interface ResearchArea {
  id: number;
  slug: string;
  iconName: string;
  title: string;
  desc: string;
  tags: string[];
}

export function getInitialResearchAreas(): ResearchArea[] {
  return [
    { id: 1, slug: "ecosystem-health", iconName: "Leaf", title: "Ecosystem Health & Monitoring", desc: "Long-term ecological monitoring across 40+ biomes — tracking deforestation, soil degradation, species loss, and ecosystem recovery using satellite imagery and AI-powered analytics.", tags: ["Ecology", "Remote Sensing", "AI"] },
    { id: 2, slug: "ocean-blue-carbon", iconName: "Waves", title: "Ocean & Blue Carbon Science", desc: "Quantifying marine ecosystem carbon sequestration potential, tracking ocean acidification, and developing blue carbon accounting frameworks for international climate finance mechanisms.", tags: ["Marine Science", "Carbon", "Climate Finance"] },
    { id: 3, slug: "clean-energy-transition", iconName: "Sun", title: "Clean Energy Transition Research", desc: "Modelling just energy transition pathways for developing economies — assessing socioeconomic impacts, policy gaps, and community-level energy access solutions in the Global South.", tags: ["Energy Policy", "Just Transition", "SDG 7"] },
    { id: 4, slug: "climate-data-lab", iconName: "Database", title: "Climate Data & Innovation Lab", desc: "Harnessing open data platforms, citizen science, and machine learning to track environmental change in real time — making climate intelligence universally accessible and actionable.", tags: ["Data Science", "Open Access", "Innovation"] },
    { id: 5, slug: "social-environmental-justice", iconName: "Users", title: "Social & Environmental Justice Research", desc: "Studying the intersections of environmental degradation, gender inequality, indigenous rights, and climate vulnerability — generating evidence for rights-based environmental governance reforms.", tags: ["Social Science", "Gender", "Indigenous Rights"] },
    { id: 6, slug: "urban-climate-resilience", iconName: "Building", title: "Urban Climate Resilience Studies", desc: "Analysing climate risks in rapidly urbanising cities, developing green infrastructure blueprints, and evaluating urban nature-based solutions for heat, flood, and air pollution resilience.", tags: ["Urban Planning", "Nature-Based", "Resilience"] }
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function ResearchAdminView() {
  const [areas, setAreas, loading] = useFirestoreData<ResearchArea[]>("esn_research_admin", getInitialResearchAreas());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ResearchArea>>({
    slug: "", title: "", desc: "", iconName: "Leaf", tags: []
  });
  const [tagInput, setTagInput] = useState("");

  const saveAreas = (newData: ResearchArea[]) => {
    setAreas(newData);
    
  };

  const handleSave = () => {
    if (!formData.title || !formData.desc) return;
    if (editingId !== null) {
      saveAreas(areas.map(a => a.id === editingId ? { ...a, ...formData } as ResearchArea : a));
      setEditingId(null);
    } else {
      const newId = areas.length > 0 ? Math.max(...areas.map(a => a.id)) + 1 : 1;
      saveAreas([...areas, { ...formData, slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), id: newId } as ResearchArea]);
    }
    setShowAdd(false);
    setFormData({ slug: "", title: "", desc: "", iconName: "Leaf", tags: [] });
    setTagInput("");
  };

  const startEdit = (a: ResearchArea) => {
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

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter((_, i) => i !== indexToRemove) }));
  };

  const filtered = areas.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Research & Knowledge</h3>
          <p className="text-sm text-gray-400">Manage research areas and capabilities.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ slug: "", title: "", desc: "", iconName: "Leaf", tags: [] }); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Area
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Area" : "Add Area"}</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name *</label>
                <input type="text" value={formData.iconName || ""} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                <textarea rows={3} value={formData.desc || ""} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tags (Press Enter to add)</label>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] mb-2" placeholder="e.g. Ecology" />
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F3EB] text-[#0A3D2A] text-xs font-bold rounded-full">
                      {tag}
                      <button onClick={() => removeTag(i)} className="hover:text-red-500 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Area</button>
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
              <h4 className="font-bold text-gray-900 mb-2">Delete Area?</h4>
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
          <input type="text" placeholder="Search areas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(a => {
            const Icon = resolveIcon(a.iconName);
            return (
              <div key={a.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0B5D3F]/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E6F3EB] flex items-center justify-center">
                      <Icon size={20} className="text-[#0A3D2A]" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{a.title}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{a.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {a.tags.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button onClick={() => startEdit(a)} className="flex-1 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F] flex justify-center">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(a.id)} className="flex-1 py-1.5 text-gray-400 hover:bg-red-50 rounded-lg hover:text-red-500 flex justify-center">
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
