import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle } from "lucide-react";

export interface YouthInitiative {
  id: number;
  num: string;
  title: string;
  desc: string;
  impact: string;
}

export interface YouthStat {
  id: number;
  value: string;
  label: string;
  sub: string;
}

export function getInitialYouthInitiatives(): YouthInitiative[] {
  return [
    { id: 1, num: "01", title: "ESN Youth Leadership Academy", desc: "A 12-month immersive leadership programme for 18–30 year olds — combining environmental science training, policy advocacy skills, field experience, and mentorship from senior ESN practitioners and UN officials.", impact: "2,500 graduates in 55 countries" },
    { id: 2, num: "02", title: "Climate Action Fellowships", desc: "Competitive, fully-funded fellowships placing young environmental professionals within ESN programs, partner NGOs, government ministries, and international institutions for 6–12 month assignments.", impact: "800 fellows placed annually" },
    { id: 3, num: "03", title: "Youth Shapers COP Delegation", desc: "Providing rigorous negotiation training and accredited seats at UNFCCC COP summits, CBD COPs, and other key multilateral environmental forums — ensuring youth voices shape global climate agreements.", impact: "Active in 60 nations · COP29 ✓" },
    { id: 4, num: "04", title: "Green Schools Initiative", desc: "Transforming schools into climate action hubs through curriculum integration, student-led environment clubs, solar installations, tree planting, and connections to ESN's global youth network.", impact: "4,200 schools across 38 countries" },
    { id: 5, num: "05", title: "Digital Climate Literacy Platform", desc: "Free, multilingual online learning platform delivering climate science, sustainability, and environmental advocacy courses to young people — accessible on mobile with or without internet connectivity.", impact: "1.2M learners · 55 languages" },
    { id: 6, num: "06", title: "Youth Research & Innovation Grants", desc: "Seed funding and mentorship for youth-led environmental research projects and social enterprises — supporting the next generation of environmental innovators from idea to impact in communities worldwide.", impact: "$4M awarded · 320 projects funded" }
  ];
}

export function getInitialYouthStats(): YouthStat[] {
  return [
    { id: 1, value: "100K+", label: "Youth Leaders", sub: "Trained Globally" },
    { id: 2, value: "60", label: "Countries with Active", sub: "Youth Networks" },
    { id: 3, value: "4,200", label: "Green Schools", sub: "Transformed" },
    { id: 4, value: "$4M+", label: "Youth Research", sub: "Grants Awarded" }
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export default function YouthAdminView() {
  const [initiatives, setInitiatives, loading] = useFirestoreData<YouthInitiative[]>("esn_youth_initiatives_admin", getInitialYouthInitiatives());
  const [stats, setStats] = useFirestoreData<YouthStat[]>("esn_youth_stats", getInitialYouthStats());
  
  const [activeTab, setActiveTab] = useState<"initiatives" | "stats">("initiatives");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const [initForm, setInitForm] = useState<Partial<YouthInitiative>>({ num: "", title: "", desc: "", impact: "" });
  const [statForm, setStatForm] = useState<Partial<YouthStat>>({ value: "", label: "", sub: "" });

  const saveInitiatives = (newData: YouthInitiative[]) => {
    setInitiatives(newData);
  };

  const saveStats = (newData: YouthStat[]) => {
    setStats(newData);
  };

  const handleSaveInit = () => {
    if (!initForm.title || !initForm.desc) return;
    if (editingId !== null) {
      saveInitiatives(initiatives.map(i => i.id === editingId ? { ...i, ...initForm } as YouthInitiative : i));
      setEditingId(null);
    } else {
      const newId = initiatives.length > 0 ? Math.max(...initiatives.map(i => i.id)) + 1 : 1;
      saveInitiatives([...initiatives, { ...initForm, id: newId } as YouthInitiative]);
    }
    setShowAdd(false);
    setInitForm({ num: "", title: "", desc: "", impact: "" });
  };

  const handleSaveStat = () => {
    if (!statForm.value || !statForm.label) return;
    if (editingId !== null) {
      saveStats(stats.map(s => s.id === editingId ? { ...s, ...statForm } as YouthStat : s));
      setEditingId(null);
    } else {
      const newId = stats.length > 0 ? Math.max(...stats.map(s => s.id)) + 1 : 1;
      saveStats([...stats, { ...statForm, id: newId } as YouthStat]);
    }
    setShowAdd(false);
    setStatForm({ value: "", label: "", sub: "" });
  };

  const startEditInit = (i: YouthInitiative) => {
    setInitForm(i);
    setEditingId(i.id);
    setShowAdd(true);
  };

  const startEditStat = (s: YouthStat) => {
    setStatForm(s);
    setEditingId(s.id);
    setShowAdd(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      if (activeTab === "initiatives") {
        saveInitiatives(initiatives.filter(i => i.id !== deleteConfirmId));
      } else {
        saveStats(stats.filter(s => s.id !== deleteConfirmId));
      }
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Youth Development</h3>
          <p className="text-sm text-gray-400">Manage youth initiatives and statistics.</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowAdd(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add {activeTab === "initiatives" ? "Initiative" : "Stat"}
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 max-w-sm">
        <button onClick={() => setActiveTab("initiatives")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "initiatives" ? "bg-[#E6F3EB] text-[#0A3D2A]" : "text-gray-500 hover:bg-gray-50"}`}>Initiatives</button>
        <button onClick={() => setActiveTab("stats")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "stats" ? "bg-[#E6F3EB] text-[#0A3D2A]" : "text-gray-500 hover:bg-gray-50"}`}>Stats</button>
      </div>

      <AnimatePresence>
        {showAdd && activeTab === "initiatives" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Initiative" : "Add Initiative"}</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Number (e.g. 01)</label>
                <input type="text" value={initForm.num || ""} onChange={e => setInitForm({ ...initForm, num: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Title *</label>
                <input type="text" value={initForm.title || ""} onChange={e => setInitForm({ ...initForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                <textarea rows={3} value={initForm.desc || ""} onChange={e => setInitForm({ ...initForm, desc: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Impact text</label>
                <input type="text" value={initForm.impact || ""} onChange={e => setInitForm({ ...initForm, impact: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSaveInit} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Initiative</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}

        {showAdd && activeTab === "stats" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden">
            <h4 className="font-bold text-gray-900 mb-5">{editingId ? "Edit Stat" : "Add Stat"}</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Value (e.g. 100K+) *</label>
                <input type="text" value={statForm.value || ""} onChange={e => setStatForm({ ...statForm, value: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Label *</label>
                <input type="text" value={statForm.label || ""} onChange={e => setStatForm({ ...statForm, label: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Sub-label</label>
                <input type="text" value={statForm.sub || ""} onChange={e => setStatForm({ ...statForm, sub: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSaveStat} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Stat</button>
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
              <h4 className="font-bold text-gray-900 mb-2">Delete Item?</h4>
              <div className="flex gap-3 mt-6">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-2">
        {activeTab === "initiatives" && (
          <div className="grid md:grid-cols-2 gap-4">
            {initiatives.map(i => (
              <div key={i.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0B5D3F]/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[#0B5D3F] font-bold opacity-30 text-2xl">{i.num}</div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditInit(i)} className="p-1 text-gray-400 hover:text-[#0B5D3F]"><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteConfirmId(i.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{i.title}</h4>
                <p className="text-sm text-gray-500 mb-3">{i.desc}</p>
                <div className="text-xs font-semibold text-[#0B5D3F] bg-[#E6F3EB] inline-block px-2 py-1 rounded">{i.impact}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0B5D3F]/20 transition-all text-center">
                <div className="text-3xl font-black text-[#0B5D3F] mb-1">{s.value}</div>
                <div className="text-sm font-bold text-gray-900">{s.label}</div>
                <div className="text-xs text-gray-500">{s.sub}</div>
                <div className="flex gap-2 justify-center mt-4">
                  <button onClick={() => startEditStat(s)} className="p-1 text-gray-400 hover:text-[#0B5D3F]"><Edit3 size={14} /></button>
                  <button onClick={() => setDeleteConfirmId(s.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
