import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle, Image as ImageIcon, Eye, X, CheckCircle2, Users, Target } from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export interface YouthInitiative {
  id: number;
  num: string;
  title: string;
  desc: string;
  impact: string;
  image?: string;
  details?: string;
  audience?: string;
  outcomes?: string;
}

export interface YouthStat {
  id: number;
  value: string;
  label: string;
  sub: string;
}

export function getInitialYouthInitiatives(): YouthInitiative[] {
  return [
    {
      id: 1,
      num: "01",
      title: "ESN Youth Leadership Academy",
      desc: "A 12-month immersive leadership programme for 18–30 year olds — combining environmental science training, policy advocacy skills, field experience, and mentorship from senior ESN practitioners and UN officials.",
      impact: "2,500 graduates in 55 countries",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      details: "The ESN Youth Leadership Academy is our cornerstone leadership engine. Over 12 intensive months, cohorts engage in virtual masterclasses with world-leading climate scientists, UN negotiators, and community organizers. Fellows participate in localized ecological restoration projects, design regional public campaigns, and receive one-on-one mentorship to convert their ecological concepts into measurable, community-supported initiatives.",
      audience: "Ages 18–30, grassroots leaders, university advocates, and emerging sustainability practitioners.",
      outcomes: "Accredited youth leadership diploma, direct seed funding access, international peer network, and field intervention toolkit."
    },
    {
      id: 2,
      num: "02",
      title: "Climate Action Fellowships",
      desc: "Competitive, fully-funded fellowships placing young environmental professionals within ESN programs, partner NGOs, government ministries, and international institutions for 6–12 month assignments.",
      impact: "800 fellows placed annually",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      details: "A high-impact bridge from academic learning to international environmental governance and field execution. Fellows receive full living stipends, professional insurance, and specialized advisory to support regional watershed conservation, green energy mini-grids, and climate policy drafts.",
      audience: "Early-career environmental professionals, researchers, and community organizers.",
      outcomes: "800 annual placements, high career transition rate to UN agencies & conservation bodies, co-authored policy briefs."
    },
    {
      id: 3,
      num: "03",
      title: "Youth Shapers COP Delegation",
      desc: "Providing rigorous negotiation training and accredited seats at UNFCCC COP summits, CBD COPs, and other key multilateral environmental forums — ensuring youth voices shape global climate agreements.",
      impact: "Active in 60 nations · COP29 ✓",
      image: "/Commonwealth Secretariat at COP27.jpeg",
      details: "We remove systemic financial and geopolitical barriers preventing frontline youth from engaging in high-level multilateral treaties. ESN provides comprehensive training in treaty language, negotiation protocol, and bilateral drafting prior to each UNFCCC and CBD COP.",
      audience: "Selected youth delegates from 60+ countries with emphasis on climate-vulnerable coastal and island territories.",
      outcomes: "Direct input into official COP text, ministerial youth roundtables, and international press amplification."
    },
    {
      id: 4,
      num: "04",
      title: "Green Schools Initiative",
      desc: "Transforming schools into climate action hubs through curriculum integration, student-led environment clubs, solar installations, tree planting, and connections to ESN's global youth network.",
      impact: "4,200 schools across 38 countries",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      details: "Turning primary and secondary school grounds into living laboratories. We partner with headteachers, student environment clubs, and local authorities to establish schoolyard vegetable gardens, micro-solar arrays, rainwater catchment systems, and youth-led waste audits.",
      audience: "K-12 educators, student environmental council members, and school administrators.",
      outcomes: "4,200 active campus ecosystems, reduction in single-use school plastics, cross-school climate leagues."
    },
    {
      id: 5,
      num: "05",
      title: "Digital Climate Literacy Platform",
      desc: "Free, multilingual online learning platform delivering climate science, sustainability, and environmental advocacy courses to young people — accessible on mobile with or without internet connectivity.",
      impact: "1.2M learners · 55 languages",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      details: "Accessible, offline-capable open education for all. Available in 55 indigenous and global languages, featuring bite-sized modules on climate science, carbon accounting, regenerative agriculture, and legal advocacy.",
      audience: "Millions of self-paced learners worldwide, particularly in bandwidth-constrained regions.",
      outcomes: "Over 1.2M learners certified, zero data-cost partnerships with regional telcos, mobile learning app."
    },
    {
      id: 6,
      num: "06",
      title: "Youth Research & Innovation Grants",
      desc: "Seed funding and mentorship for youth-led environmental research projects and social enterprises — supporting the next generation of environmental innovators from idea to impact in communities worldwide.",
      impact: "$4M awarded · 320 projects funded",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      details: "Providing rapid, non-bureaucratic seed capital between $1,000 and $10,000 for innovative youth-designed solutions—from bio-plastic alternatives to low-cost river water filtration systems.",
      audience: "Young eco-inventors, social entrepreneurs, and grassroots laboratory collectives.",
      outcomes: "320+ prototypes piloted, 45 patented sustainable products, venture acceleration partners."
    }
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

export default function YouthAdminView() {
  const [initiatives, setInitiatives, loading] = useFirestoreData<YouthInitiative[]>("esn_youth_initiatives_admin", getInitialYouthInitiatives());
  const [stats, setStats] = useFirestoreData<YouthStat[]>("esn_youth_stats", getInitialYouthStats());
  
  const [activeTab, setActiveTab] = useState<"initiatives" | "stats">("initiatives");
  const [showAdd, setShowAdd] = useState(false);
  const [viewingInitiative, setViewingInitiative] = useState<YouthInitiative | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const [initForm, setInitForm] = useState<Partial<YouthInitiative>>({ num: "", title: "", desc: "", impact: "", image: "", details: "", audience: "", outcomes: "" });
  const [statForm, setStatForm] = useState<Partial<YouthStat>>({ value: "", label: "", sub: "" });

  const saveInitiatives = async (newData: YouthInitiative[]) => {
    setInitiatives(newData);
    await saveFirestoreData("esn_youth_initiatives_admin", newData);
  };

  const saveStats = async (newData: YouthStat[]) => {
    setStats(newData);
    await saveFirestoreData("esn_youth_stats", newData);
  };

  const handleSaveInit = () => {
    if (!initForm.title?.trim() || !initForm.desc?.trim()) return;
    const currentNum = editingId ? (initiatives.find(i => i.id === editingId)?.num || "01") : String(initiatives.length + 1).padStart(2, '0');
    const finalNum = initForm.num?.trim() || currentNum;
    const dataToSave = { ...initForm, num: finalNum };
    if (editingId !== null) {
      saveInitiatives(initiatives.map(i => i.id === editingId ? { ...i, ...dataToSave } as YouthInitiative : i));
      setEditingId(null);
    } else {
      const newId = initiatives.length > 0 ? Math.max(...initiatives.map(i => i.id)) + 1 : 1;
      saveInitiatives([...initiatives, { ...dataToSave, id: newId } as YouthInitiative]);
    }
    setShowAdd(false);
    setInitForm({ num: "", title: "", desc: "", impact: "", image: "", details: "", audience: "", outcomes: "" });
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
    setInitForm({ ...i, image: i.image || "", details: i.details || "", audience: i.audience || "", outcomes: i.outcomes || "" });
    setEditingId(i.id);
    setShowAdd(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const startEditStat = (s: YouthStat) => {
    setStatForm(s);
    setEditingId(s.id);
    setShowAdd(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
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
        <button onClick={() => { setEditingId(null); setInitForm({ num: "", title: "", desc: "", impact: "", image: "" }); setShowAdd(true); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Add {activeTab === "initiatives" ? "Initiative" : "Stat"}
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 max-w-sm">
        <button onClick={() => setActiveTab("initiatives")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "initiatives" ? "bg-[#E6F3EB] text-[#0A3D2A]" : "text-gray-500 hover:bg-gray-50"}`}>Initiatives</button>
        <button onClick={() => setActiveTab("stats")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "stats" ? "bg-[#E6F3EB] text-[#0A3D2A]" : "text-gray-500 hover:bg-gray-50"}`}>Stats</button>
      </div>

      <AnimatePresence>
        {showAdd && activeTab === "initiatives" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden shadow-sm">
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
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Short Summary / Description *</label>
                <textarea rows={2} value={initForm.desc || ""} onChange={e => setInitForm({ ...initForm, desc: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full In-Depth Details & Methodology</label>
                <textarea rows={4} value={initForm.details || ""} onChange={e => setInitForm({ ...initForm, details: e.target.value })} placeholder="Comprehensive overview of how the program operates, curriculum components, mentoring structure, etc." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Target Audience / Eligibility</label>
                <input type="text" value={initForm.audience || ""} onChange={e => setInitForm({ ...initForm, audience: e.target.value })} placeholder="e.g. Ages 18–30, grassroots leaders, university advocates" className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Key Outcomes & Deliverables</label>
                <input type="text" value={initForm.outcomes || ""} onChange={e => setInitForm({ ...initForm, outcomes: e.target.value })} placeholder="e.g. Accredited diploma, direct seed funding access" className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">Impact Badge Text (e.g. 2,500 graduates in 55 countries)</label>
                <input type="text" value={initForm.impact || ""} onChange={e => setInitForm({ ...initForm, impact: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              <div className="md:col-span-2 pt-2 border-t border-gray-100">
                <ImageUploadField
                  label="Initiative Photo / Cover Image"
                  value={initForm.image || ""}
                  onChange={(url) => setInitForm({ ...initForm, image: url })}
                  folder="youth_initiatives"
                  aspectRatio="video"
                  helpText="Upload a photo (PNG, JPG, WebP) or paste an image URL for this youth initiative"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSaveInit} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">Save Initiative</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
            </div>
          </motion.div>
        )}

        {showAdd && activeTab === "stats" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 border border-[#4CAF50]/30 overflow-hidden shadow-sm">
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

      {/* In-Depth View Modal for Youth Initiative */}
      <AnimatePresence>
        {viewingInitiative && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 relative">
              <button onClick={() => setViewingInitiative(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </button>

              {viewingInitiative.image && (
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 bg-gray-100 relative">
                  <img src={viewingInitiative.image} alt={viewingInitiative.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-[#0B5D3F] text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    {viewingInitiative.num}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#0B5D3F] bg-[#E6F3EB] px-3 py-1 rounded-full">
                  Initiative #{viewingInitiative.num}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {viewingInitiative.impact}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {viewingInitiative.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium bg-[#F6FBF8] p-4 rounded-xl border border-gray-100">
                {viewingInitiative.desc}
              </p>

              {viewingInitiative.details && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Detailed Program Blueprint</h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {viewingInitiative.details}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {viewingInitiative.audience && (
                  <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-emerald-100/70">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] mb-1.5 uppercase tracking-wider">
                      <Users size={14} /> Target Audience
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {viewingInitiative.audience}
                    </p>
                  </div>
                )}
                {viewingInitiative.outcomes && (
                  <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-emerald-100/70">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] mb-1.5 uppercase tracking-wider">
                      <Target size={14} /> Outcomes & Deliverables
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {viewingInitiative.outcomes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    const init = viewingInitiative;
                    setViewingInitiative(null);
                    startEditInit(init);
                  }}
                  className="flex-1 bg-[#0B5D3F] hover:bg-[#0a5237] text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={15} /> Edit This Initiative
                </button>
                <button
                  onClick={() => setViewingInitiative(null)}
                  className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-semibold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {initiatives.map(i => (
              <div key={i.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#0B5D3F]/30 hover:shadow-md transition-all flex flex-col justify-between bg-white">
                <div>
                  {i.image ? (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-3.5 bg-gray-50 border border-gray-100 relative group">
                      <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                        {i.num}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-xl mb-3.5 bg-[#F6FBF8] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={20} className="mb-1 text-gray-300" />
                      <span className="text-[11px] font-medium text-gray-400">No Photo Added</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[#0B5D3F] font-bold text-xs bg-[#E6F3EB] px-2.5 py-1 rounded-md">{i.num}</div>
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewingInitiative(i)} className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-emerald-50 rounded-lg transition-colors" title="View In-Depth Details"><Eye size={15} /></button>
                      <button onClick={() => startEditInit(i)} className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Edit3 size={15} /></button>
                      <button onClick={() => setDeleteConfirmId(i.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{i.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 font-light leading-relaxed">{i.desc}</p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                  <div className="text-xs font-semibold text-[#0B5D3F] bg-[#E6F3EB]/70 border border-[#0B5D3F]/10 px-3 py-1 rounded-lg truncate">
                    {i.impact}
                  </div>
                  <button
                    onClick={() => setViewingInitiative(i)}
                    className="text-xs font-bold text-[#0B5D3F] hover:underline shrink-0"
                  >
                    View Details →
                  </button>
                </div>
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

