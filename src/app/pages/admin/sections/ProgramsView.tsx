import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TreePine, Waves, Sun, ShieldAlert, Bug, GraduationCap, Microscope, UsersRound,
  Plus, Search, Edit3, Trash2, X, AlertTriangle, Download, CheckCircle2, Leaf
} from "lucide-react";
import * as Icons from "lucide-react";

export interface ProgramData {
  id: number;
  slug: string;
  title: string;
  category: string;
  iconName: string;
  color: string;
  desc: string;
  highlights: string[];
  reach: string;
  image: string;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function getInitialPrograms(): ProgramData[] {
  return [
    {
      id: 1, slug: "forest-restoration", title: "Forest Restoration", category: "Ecosystems", iconName: "TreePine", color: "#4CAF50",
      desc: "Coordinating the planting and long-term stewardship of 100 million trees across degraded landscapes in Asia, Africa, and Latin America through science-led reforestation and digital ecosystem monitoring.",
      highlights: ["2.4M Trees Planted", "Community Nurseries", "Land Tenure Support"],
      reach: "80+ Countries Active",
      image: "/canada journey.jpeg"
    },
    {
      id: 2, slug: "ocean-action", title: "Ocean & Coastal Action", category: "Ecosystems", iconName: "Waves", color: "#2196F3",
      desc: "Protecting marine ecosystems, combating deep-ocean plastic pollution, restoring coral reefs, and establishing community-governed Marine Protected Areas across 35+ coastal nations.",
      highlights: ["Reef Monitoring Network", "Coastal Clean-ups", "Marine Protected Areas"],
      reach: "32 Marine Projects",
      image: "/Representing Bangladesh's Coastal Communities on the Global Stage.jpeg"
    },
    {
      id: 3, slug: "clean-energy", title: "Climate-Smart Energy Access", category: "Energy", iconName: "Sun", color: "#FFC107",
      desc: "Accelerating access to affordable solar, wind, and micro-hydro energy for 10 million off-grid households in the Global South — replacing fossil fuel dependence with community-owned clean power.",
      highlights: ["Solar Mini-grids", "Cookstove Programs", "Energy Policy"],
      reach: "120K+ Households",
      image: "/canada conference.jpeg"
    },
    {
      id: 4, slug: "climate-adaptation", title: "Climate Adaptation & Resilience", category: "Community", iconName: "ShieldAlert", color: "#F44336",
      desc: "Building adaptive capacity in the world's most climate-vulnerable communities — from Pacific islands to African drylands — through nature-based infrastructure and early warning systems.",
      highlights: ["Community Plans", "Resilience Grants", "Capacity Building"],
      reach: "12K+ Communities",
      image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg"
    },
    {
      id: 5, slug: "biodiversity", title: "Biodiversity & Wildlife", category: "Ecosystems", iconName: "Bug", color: "#9C27B0",
      desc: "Protecting endangered species and critical ecosystems through community ranger programs, AI-powered habitat monitoring, and evidence-based conservation policy advocacy at UN biodiversity forums.",
      highlights: ["Species Monitoring", "Corridor Projects", "Anti-Poaching"],
      reach: "85 Species Monitored",
      image: "/Commonwealth Secretariat at COP27.jpeg"
    },
    {
      id: 6, slug: "education", title: "Environmental Education", category: "Knowledge", iconName: "GraduationCap", color: "#00BCD4",
      desc: "Delivering climate literacy, environmental science, and sustainability curricula to 5 million students annually through school networks, teacher training, and open digital learning tools.",
      highlights: ["Green Schools Initiative", "Teacher Training", "Digital Curriculum"],
      reach: "5M+ Students Annually",
      image: "/meeting time.jpeg"
    },
    {
      id: 7, slug: "research", title: "Environmental Research", category: "Knowledge", iconName: "Microscope", color: "#607D8B",
      desc: "Conducting peer-reviewed, policy-relevant research across ecosystems, climate systems, and sustainability transitions — producing actionable insights that shape global environmental policy.",
      highlights: ["180+ Publications", "Policy Dialogues", "Open Data"],
      reach: "180+ Publications",
      image: "/represent bangladesh.jpeg"
    },
    {
      id: 8, slug: "youth", title: "Youth Development", category: "People", iconName: "UsersRound", color: "#FF9800",
      desc: "Nurturing the next generation of environmental champions through fellowships, leadership academies, mentorship networks, and meaningful seats at international climate negotiation tables.",
      highlights: ["YEL Fellowship Program", "Leadership Academies", "Youth Innovation Fund"],
      reach: "48K+ Youth Engaged",
      image: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg"
    }
  ];
}

const availableIcons = ["TreePine", "Waves", "Sun", "ShieldAlert", "Bug", "GraduationCap", "Microscope", "UsersRound", "Leaf", "Globe2", "Heart"];
const availableColors = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0", "#00BCD4", "#607D8B", "#FF9800", "#795548", "#E91E63", "#3F51B5"];

const blankProgram: Omit<ProgramData, "id"> = {
  slug: "", title: "", category: "Ecosystems", iconName: "Leaf", color: "#4CAF50",
  desc: "", highlights: ["", "", ""], reach: "", image: ""
};

export function resolveIcon(name: string) {
  const Icon = (Icons as any)[name] || Leaf;
  return Icon;
}

export function ProgramsView() {
  const [programs, setPrograms, loading] = useFirestoreData<ProgramData[]>("esn_programs", getInitialPrograms());
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (programs.length > 0 && programs.some(p => p.image.includes('unsplash'))) {
      saveFirestoreData("esn_programs", getInitialPrograms());
    }
  }, [programs]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<ProgramData, "id">>(blankProgram);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const save = (list: ProgramData[]) => {
    setPrograms(list);
    
  };

  const handleSubmit = () => {
    if (!form.title || !form.slug) return;
    if (editId !== null) {
      save(programs.map((p) => p.id === editId ? { ...form, id: editId } : p));
    } else {
      save([...programs, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankProgram);
  };

  const startEdit = (p: ProgramData) => {
    const { id, ...rest } = p;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  };

  const doDelete = () => {
    if (deleteConfirmId === null) return;
    save(programs.filter((p) => p.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...form.highlights];
    newHighlights[index] = value;
    setForm({ ...form, highlights: newHighlights });
  };

  const filtered = (programs || []).filter((p) => {
    if (!p) return false;
    const title = String(p.title || "").toLowerCase();
    const category = String(p.category || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || title.includes(q) || category.includes(q);
  });
  const programToDelete = programs.find(p => p.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Core Programs</h3>
          <p className="text-sm text-gray-400 mt-0.5">{programs.length} active programs</p>
        </div>
        <button onClick={() => { setForm(blankProgram); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add Program
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Program" : "Add New Program"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Program Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E.g., Forest Restoration" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">URL Slug *</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="E.g., forest-restoration" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="E.g., Ecosystems" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Reach (Label)</label>
                  <input type="text" value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} placeholder="E.g., 80+ Countries Active" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Image URL</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Theme Color</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(c => (
                      <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {availableIcons.map(iconName => {
                      const IconComp = resolveIcon(iconName);
                      return (
                        <button key={iconName} onClick={() => setForm({ ...form, iconName })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.iconName === iconName ? 'bg-gray-900 text-white' : 'bg-[#F6FBF8] border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                          <IconComp size={18} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Program description..." />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Highlights (3 max)</label>
                  <div className="flex flex-col gap-2">
                    {form.highlights.map((h, i) => (
                      <input key={i} type="text" value={h} onChange={(e) => handleHighlightChange(i, e.target.value)} placeholder={`Highlight ${i + 1}`} className="w-full px-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
                  {editId ? "Save Changes" : "Create Program"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2">Delete Program?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{programToDelete?.title}"</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.map((p) => {
          const Icon = resolveIcon(p.iconName);
          return (
            <motion.div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-5 px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-[#F6FBF8]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.color + '18', color: p.color }}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm mb-1">{p.title}</div>
                <div className="text-xs text-gray-400 line-clamp-1">{p.desc}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="Edit">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-300">
            <Leaf size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No programs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
