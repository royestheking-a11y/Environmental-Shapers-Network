import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit3, Trash2, AlertCircle, Sparkles, Check, Target, Save, CheckCircle2 } from "lucide-react";
import { resolveIcon } from "./ProgramsView";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export interface MissionValue {
  id: number;
  iconName: string;
  title: string;
  description: string;
  color: string;
}

export interface MissionGoal {
  id: number;
  text: string;
  metric?: string;
}

export interface MissionSectionData {
  targetYear: string;
  targetSubtitle: string;
  headline: string;
  subtext: string;
  goals: MissionGoal[];
}

export function getInitialMissionSection(): MissionSectionData {
  return {
    targetYear: "2050",
    targetSubtitle: "Net-Zero Carbon Goal",
    headline: "A Greener World Is Possible",
    subtext: "We believe that with the right science, the right partnerships, and the right political will, a net-zero carbon future is achievable by 2050.",
    goals: [
      { id: 1, text: "Restore 500 million hectares of degraded land globally", metric: "500M ha" },
      { id: 2, text: "Eliminate single-use plastics in 50+ partner nations", metric: "50+ Nations" },
      { id: 3, text: "Transition 100 communities to 100% renewable energy", metric: "100 Sites" },
      { id: 4, text: "Train 1 million environmental stewards by 2030", metric: "1M Stewards" },
      { id: 5, text: "Protect 30% of the world's oceans and forests", metric: "30x30 Target" },
    ],
  };
}

export function getInitialMissionValues(): MissionValue[] {
  return [
    { id: 1, iconName: "Sprout", title: "Sustainability First", description: "Every action we take is grounded in environmental responsibility and long-term ecological thinking.", color: "#0B5D3F" },
    { id: 2, iconName: "Globe2", title: "Global Collaboration", description: "We bridge borders, cultures, and disciplines to address planetary challenges with collective intelligence.", color: "#173B63" },
    { id: 3, iconName: "Users", title: "Community-Led", description: "Local communities are the heart of our work — we amplify grassroots voices to drive systemic change.", color: "#4CAF50" },
    { id: 4, iconName: "Target", title: "Action-Oriented", description: "We translate research and policy into tangible, on-the-ground environmental impact.", color: "#D6A95A" },
  ];
}

export default function MissionAdminView() {
  const [activeTab, setActiveTab] = useState<"homepage" | "values">("homepage");

  // Homepage Mission Section Data
  const [missionSection, setMissionSection] = useFirestoreData<MissionSectionData>("esn_mission_section_admin", getInitialMissionSection());
  const [sectionForm, setSectionForm] = useState<MissionSectionData>(missionSection || getInitialMissionSection());
  const [savedSectionSuccess, setSavedSectionSuccess] = useState(false);

  // Goal Modal State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<MissionGoal | null>(null);
  const [goalText, setGoalText] = useState("");
  const [goalMetric, setGoalMetric] = useState("");

  // Mission Values (About Page) Data
  const [values, setValues] = useFirestoreData<MissionValue[]>("esn_mission_admin", getInitialMissionValues());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MissionValue>>({ title: "", description: "", iconName: "Sprout", color: "#0B5D3F" });

  // Sync sectionForm when missionSection loads
  const currentSection = missionSection || getInitialMissionSection();

  const handleSaveSection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMissionSection(sectionForm);
    await saveFirestoreData("esn_mission_section_admin", sectionForm);
    setSavedSectionSuccess(true);
    setTimeout(() => setSavedSectionSuccess(false), 3000);
  };

  const handleOpenGoalModal = (goal?: MissionGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalText(goal.text);
      setGoalMetric(goal.metric || "");
    } else {
      setEditingGoal(null);
      setGoalText("");
      setGoalMetric("");
    }
    setShowGoalModal(true);
  };

  const handleSaveGoal = () => {
    if (!goalText.trim()) return;
    const existingGoals = sectionForm.goals || currentSection.goals;
    let updatedGoals: MissionGoal[];

    if (editingGoal) {
      updatedGoals = existingGoals.map((g) =>
        g.id === editingGoal.id ? { ...g, text: goalText.trim(), metric: goalMetric.trim() } : g
      );
    } else {
      const newId = existingGoals.length > 0 ? Math.max(...existingGoals.map((g) => g.id)) + 1 : 1;
      updatedGoals = [...existingGoals, { id: newId, text: goalText.trim(), metric: goalMetric.trim() }];
    }

    const updated = { ...sectionForm, goals: updatedGoals };
    setSectionForm(updated);
    setMissionSection(updated);
    saveFirestoreData("esn_mission_section_admin", updated);
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (id: number) => {
    const existingGoals = sectionForm.goals || currentSection.goals;
    const updatedGoals = existingGoals.filter((g) => g.id !== id);
    const updated = { ...sectionForm, goals: updatedGoals };
    setSectionForm(updated);
    setMissionSection(updated);
    saveFirestoreData("esn_mission_section_admin", updated);
  };

  // Values Handlers
  const saveValues = async (newData: MissionValue[]) => {
    setValues(newData);
    await saveFirestoreData("esn_mission_admin", newData);
  };

  const handleSaveValue = () => {
    if (!formData.title || !formData.description) return;
    if (editingId !== null) {
      saveValues(values.map((v) => (v.id === editingId ? ({ ...v, ...formData } as MissionValue) : v)));
      setEditingId(null);
    } else {
      const newId = values.length > 0 ? Math.max(...values.map((v) => v.id)) + 1 : 1;
      saveValues([...values, { ...formData, id: newId } as MissionValue]);
    }
    setShowAdd(false);
  };

  const startEditValue = (v: MissionValue) => {
    setFormData(v);
    setEditingId(v.id);
    setShowAdd(true);
  };

  const confirmDeleteValue = () => {
    if (deleteConfirmId !== null) {
      saveValues(values.filter((v) => v.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filteredValues = (values || []).filter((v) => {
    if (!v) return false;
    const title = String(v.title || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    return !q || title.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Mission & Goals Manager
          </h3>
          <p className="text-sm text-gray-400">
            Control the live Homepage Mission Section showcase and Organization Core Values.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#F6FBF8] p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab("homepage")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "homepage" ? "bg-[#0B5D3F] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Homepage Mission Section
          </button>
          <button
            onClick={() => setActiveTab("values")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "values" ? "bg-[#0B5D3F] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Core Values (About Page)
          </button>
        </div>
      </div>

      {/* TAB 1: HOMEPAGE MISSION SECTION */}
      {activeTab === "homepage" && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSection} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center text-[#0B5D3F]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Showcase Headline & Target Counter</h4>
                  <p className="text-xs text-gray-400">Updates the animated 2050 concentric circle and text on the homepage.</p>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#0B5D3F] hover:bg-[#08452e] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow transition-all"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>

            {savedSectionSuccess && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" /> Homepage Mission section successfully updated and live!
              </motion.div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Target Milestone Year *</label>
                <input
                  type="text"
                  value={sectionForm.targetYear}
                  onChange={(e) => setSectionForm({ ...sectionForm, targetYear: e.target.value })}
                  placeholder="2050"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Target Subtitle / Label *</label>
                <input
                  type="text"
                  value={sectionForm.targetSubtitle}
                  onChange={(e) => setSectionForm({ ...sectionForm, targetSubtitle: e.target.value })}
                  placeholder="Net-Zero Carbon Goal"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Section Main Headline *</label>
              <input
                type="text"
                value={sectionForm.headline}
                onChange={(e) => setSectionForm({ ...sectionForm, headline: e.target.value })}
                placeholder="A Greener World Is Possible"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Subtext Paragraph *</label>
              <textarea
                rows={3}
                value={sectionForm.subtext}
                onChange={(e) => setSectionForm({ ...sectionForm, subtext: e.target.value })}
                placeholder="We believe that with the right science..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm leading-relaxed focus:outline-none focus:border-[#4CAF50]"
                required
              />
            </div>
          </form>

          {/* Mission Goals Checklist */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Key Mission Goals Checklist</h4>
                <p className="text-xs text-gray-400">Manage the 5 checklist targets displayed beside the 2050 target.</p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenGoalModal()}
                className="flex items-center gap-1.5 bg-[#0B5D3F]/10 hover:bg-[#0B5D3F]/20 text-[#0B5D3F] px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Mission Goal
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {(sectionForm.goals || currentSection.goals).map((g, idx) => (
                <div key={g.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-300 text-[#0B5D3F] flex items-center justify-center shrink-0">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{g.text}</p>
                      {g.metric && <span className="text-[11px] font-bold text-[#0B5D3F] uppercase tracking-wider">{g.metric}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenGoalModal(g)}
                      className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-50 rounded-lg transition-all"
                      title="Edit Goal"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Goal"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Add/Edit Modal */}
          <AnimatePresence>
            {showGoalModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                  <h4 className="font-bold text-gray-900 text-lg mb-4">{editingGoal ? "Edit Goal" : "Add Mission Goal"}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Goal Description *</label>
                      <input
                        type="text"
                        value={goalText}
                        onChange={(e) => setGoalText(e.target.value)}
                        placeholder="e.g. Restore 500 million hectares of degraded land globally"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Metric / Badge (Optional)</label>
                      <input
                        type="text"
                        value={goalMetric}
                        onChange={(e) => setGoalMetric(e.target.value)}
                        placeholder="e.g. 500M ha or 30x30 Target"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSaveGoal}
                      className="flex-1 bg-[#0B5D3F] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#08452e] transition-all"
                    >
                      {editingGoal ? "Update Goal" : "Add Goal"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGoalModal(false)}
                      className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: CORE VALUES (ABOUT PAGE) */}
      {activeTab === "values" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", description: "", iconName: "Sprout", color: "#0B5D3F" });
                setShowAdd(true);
              }}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
            >
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
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description *</label>
                    <textarea
                      rows={2}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Lucide Icon Name *</label>
                      <input
                        type="text"
                        value={formData.iconName || ""}
                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 block">Color (Hex) *</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.color || "#0B5D3F"}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-12 h-12 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color || ""}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveValue} className="bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">
                    Save Value
                  </button>
                  <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">
                    Cancel
                  </button>
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
                    <button onClick={confirmDeleteValue} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600">
                      Yes, Delete
                    </button>
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="relative max-w-sm mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search values..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredValues.map((v) => {
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
                      <button onClick={() => startEditValue(v)} className="flex-1 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg hover:text-[#0B5D3F] flex justify-center">
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
      )}
    </div>
  );
}

