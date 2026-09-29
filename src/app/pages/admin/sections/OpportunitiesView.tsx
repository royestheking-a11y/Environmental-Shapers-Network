import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase, Heart, Plus, Trash2, Edit3, MapPin, Clock, Search,
  AlertTriangle, RefreshCw, Globe2, CheckCircle2, Save, Sparkles, Layers
} from "lucide-react";

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { defaultVolunteerPageContent, VolunteerPageContent, VolunteerStatItem } from "../../GetInvolvedPage";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

export const defaultJobs = [
  { id: 1, title: "Program Manager — Forest Restoration", dept: "Programs", location: "Dhaka, Bangladesh", type: "Full-time", deadline: "Aug 30, 2026", salary: "$45K–$60K", desc: "Lead our flagship forest restoration programs across South Asia, managing a team of 12 field staff and 200+ community volunteers.", requirements: "5+ years program management, NGO/environmental sector experience, Fluent in Bangla + English, PMP or equivalent preferred" },
  { id: 2, title: "Research Associate — Climate Policy", dept: "Research", location: "Remote", type: "Full-time", deadline: "Sep 5, 2026", salary: "$38K–$50K", desc: "Support ESN's policy research agenda, producing evidence briefs, policy papers, and stakeholder reports.", requirements: "Master's in environmental science/policy, Strong research & writing skills, Experience with IPCC frameworks, Quantitative analysis skills" },
];

export const defaultRoles = [
  { id: 1, title: "Field Volunteer", location: "Bangladesh / Global", commitment: "4–8 hrs/week", skills: "Physical fitness, teamwork" },
  { id: 2, title: "Research Assistant", location: "Remote / Global", commitment: "6–10 hrs/week", skills: "Research, data analysis" },
  { id: 3, title: "Social Media Volunteer", location: "Remote", commitment: "4–6 hrs/week", skills: "Content creation, design" },
];

export function OpportunitiesView() {
  const [activeTab, setActiveTab] = useState<"careers" | "volunteers" | "volunteer_page">("careers");
  const [jobs, setJobs, loadingJobs] = useFirestoreData<any[]>("esn_career_jobs", defaultJobs);
  const [roles, setRoles, loadingRoles] = useFirestoreData<any[]>("esn_volunteer_roles", defaultRoles);
  const [careerApps] = useFirestoreData<any[]>("esn_apps_career", []);
  const [volApps] = useFirestoreData<any[]>("esn_apps_volunteer", []);

  // Volunteer Page Content & Stats CMS
  const [volPageContent, setVolPageContent] = useFirestoreData<VolunteerPageContent>(
    "esn_volunteer_page_content",
    defaultVolunteerPageContent
  );
  const [volForm, setVolForm] = useState<VolunteerPageContent>(() => ({
    ...defaultVolunteerPageContent,
    ...(volPageContent || {})
  }));

  useEffect(() => {
    if (volPageContent) {
      setVolForm(prev => ({
        ...defaultVolunteerPageContent,
        ...volPageContent,
        stats: (volPageContent.stats && volPageContent.stats.length > 0) ? volPageContent.stats : defaultVolunteerPageContent.stats,
        benefits: (volPageContent.benefits && volPageContent.benefits.length > 0) ? volPageContent.benefits : defaultVolunteerPageContent.benefits
      }));
    }
  }, [volPageContent]);

  const [savingPage, setSavingPage] = useState(false);
  const [savedPageSuccess, setSavedPageSuccess] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [search, setSearch] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    if (activeTab === "careers") {
      let updatedJobs = [...jobs];
      if (editingItem) {
        updatedJobs = updatedJobs.map(j => j.id === editingItem.id ? { ...j, ...data } : j);
      } else {
        updatedJobs.unshift({ id: Date.now(), status: "Active", ...data });
      }
      setJobs(updatedJobs);
      await saveFirestoreData("esn_career_jobs", updatedJobs);
    } else if (activeTab === "volunteers") {
      let updatedRoles = [...roles];
      if (editingItem) {
        updatedRoles = updatedRoles.map(r => r.id === editingItem.id ? { ...r, ...data } : r);
      } else {
        updatedRoles.unshift({ id: Date.now(), status: "Active", ...data });
      }
      setRoles(updatedRoles);
      await saveFirestoreData("esn_volunteer_roles", updatedRoles);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveVolunteerPage = async () => {
    setSavingPage(true);
    try {
      await saveFirestoreData("esn_volunteer_page_content", volForm);
      setVolPageContent(volForm);
      setSavedPageSuccess(true);
      setTimeout(() => setSavedPageSuccess(false), 3500);
    } catch (err) {
      console.error("Save volunteer page error:", err);
      alert("Failed to save volunteer page settings.");
    } finally {
      setSavingPage(false);
    }
  };

  const updateVolStat = (index: number, field: "val" | "label", value: string) => {
    const currentStats = [...(volForm.stats || defaultVolunteerPageContent.stats)];
    currentStats[index] = { ...currentStats[index], [field]: value };
    setVolForm({ ...volForm, stats: currentStats });
  };

  const handleBenefitChange = (index: number, val: string) => {
    const list = [...(volForm.benefits || defaultVolunteerPageContent.benefits)];
    list[index] = val;
    setVolForm({ ...volForm, benefits: list });
  };

  const addBenefit = () => {
    const list = [...(volForm.benefits || defaultVolunteerPageContent.benefits)];
    list.push("New volunteer benefit or certificate");
    setVolForm({ ...volForm, benefits: list });
  };

  const removeBenefit = (index: number) => {
    const list = [...(volForm.benefits || defaultVolunteerPageContent.benefits)].filter((_, i) => i !== index);
    setVolForm({ ...volForm, benefits: list });
  };

  const toggleStatus = async (id: number) => {
    if (activeTab === "careers") {
      const updated = jobs.map(j => j.id === id ? { ...j, status: j.status === "Closed" ? "Active" : "Closed" } : j);
      setJobs(updated);
      await saveFirestoreData("esn_career_jobs", updated);
    } else {
      const updated = roles.map(r => r.id === id ? { ...r, status: r.status === "Closed" ? "Active" : "Closed" } : r);
      setRoles(updated);
      await saveFirestoreData("esn_volunteer_roles", updated);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this posting?")) {
      if (activeTab === "careers") {
        const updated = jobs.filter(j => j.id !== id);
        setJobs(updated);
        await saveFirestoreData("esn_career_jobs", updated);
      } else {
        const updated = roles.filter(r => r.id !== id);
        setRoles(updated);
        await saveFirestoreData("esn_volunteer_roles", updated);
      }
    }
  };

  const refresh = async () => {
    if (window.confirm("Reset jobs and volunteer roles to default values?")) {
      setJobs(defaultJobs);
      setRoles(defaultRoles);
      await saveFirestoreData("esn_career_jobs", defaultJobs);
      await saveFirestoreData("esn_volunteer_roles", defaultRoles);
    }
  };

  const currentList = activeTab === "careers" ? jobs : roles;
  const filteredList = (currentList || []).filter(item => {
    if (!item) return false;
    const title = String(item.title || "").toLowerCase();
    const loc = String(item.location || "").toLowerCase();
    const s = String(search || "").toLowerCase().trim();
    return !s || title.includes(s) || loc.includes(s);
  });

  const getApplicantCount = (title: string) => {
    if (activeTab === "careers") {
      return (careerApps || []).filter(a => a.jobTitle?.toLowerCase().includes(title.toLowerCase())).length;
    }
    return (volApps || []).filter(a => a.role?.toLowerCase().includes(title.toLowerCase())).length;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Careers & Volunteering</h3>
          <p className="text-sm text-gray-400 mt-0.5">Manage live job vacancies, volunteer opportunities & public volunteer page</p>
        </div>
        <div className="flex gap-3 items-center">
          {activeTab !== "volunteer_page" ? (
            <>
              <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 text-xs font-bold transition-all">
                <RefreshCw size={13} /> Reset Defaults
              </button>
              <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#0B5D3F] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-sm">
                <Plus size={15} /> Add New {activeTab === "careers" ? "Career Job" : "Volunteer Role"}
              </button>
            </>
          ) : (
            <button
              onClick={handleSaveVolunteerPage}
              disabled={savingPage}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5D3F] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-md disabled:opacity-50"
            >
              <Save size={15} /> {savingPage ? "Saving..." : "Save Volunteer Page Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("careers")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "careers"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Briefcase size={16} /> Career Positions ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("volunteers")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "volunteers"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Heart size={16} /> Volunteer Posts ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab("volunteer_page")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "volunteer_page"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Globe2 size={16} /> Volunteer Page & Stats (CMS)
        </button>
      </div>

      {/* ─── Volunteer Page CMS & Stats Editor Tab ─── */}
      {activeTab === "volunteer_page" ? (
        <div className="flex flex-col gap-6">
          {savedPageSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 text-[#0B5D3F] rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
              <CheckCircle2 size={18} /> Volunteer page content and statistics updated successfully! Live site is synchronized.
            </motion.div>
          )}

          {/* 1. Volunteer Stats Section (specifically addressing "190+ countries volunteer" request) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center text-[#0B5D3F]">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Volunteer Page Metric Stats (Top 4 Cards on /volunteer)
                </h4>
                <p className="text-xs text-gray-400">
                  Update the volunteer statistics, including active countries count, volunteers, and project metrics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {(volForm.stats || defaultVolunteerPageContent.stats).map((st, i) => {
                const isCountryStat = st.label.toLowerCase().includes("countr");
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCountryStat
                        ? "bg-emerald-50/60 border-[#4CAF50] shadow-sm"
                        : "bg-[#F6FBF8] border-gray-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Stat Card #{i + 1}
                      </span>
                      {isCountryStat && (
                        <span className="text-[10px] bg-[#4CAF50] text-white px-2 py-0.5 rounded-full font-bold">
                          Countries Stat
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">
                          Display Value (e.g. 190+, 48K+)
                        </label>
                        <input
                          type="text"
                          value={st.val || ""}
                          onChange={(e) => updateVolStat(i, "val", e.target.value)}
                          placeholder="e.g. 190+"
                          className="w-full px-3 py-2 text-sm font-black text-[#0B5D3F] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-600 block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={st.label || ""}
                          onChange={(e) => updateVolStat(i, "label", e.target.value)}
                          placeholder="e.g. Countries"
                          className="w-full px-3 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Hero Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Volunteer Page Hero Header
            </h4>
            <p className="text-xs text-gray-400 mb-5">Customize the main banner headline, description, and cover photo of the volunteer page.</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Hero Title</label>
                <input
                  type="text"
                  value={volForm.heroTitle || ""}
                  onChange={(e) => setVolForm({ ...volForm, heroTitle: e.target.value })}
                  placeholder="Volunteer With ESN"
                  className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Hero Subtitle</label>
                <input
                  type="text"
                  value={volForm.heroSub || ""}
                  onChange={(e) => setVolForm({ ...volForm, heroSub: e.target.value })}
                  placeholder="Give your time, skills, and passion to protect the planet..."
                  className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none"
                />
              </div>
            </div>

            <ImageUploadField
              label="Volunteer Page Banner Cover Image"
              value={volForm.heroImage}
              onChange={(url) => setVolForm({ ...volForm, heroImage: url })}
              folder="volunteers"
              helpText="Upload a high-resolution hero photo for the volunteer portal"
            />
          </div>

          {/* 3. Why Volunteer & Benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  "Why Volunteer" Section
                </h4>
                <p className="text-xs text-gray-400 mb-4">Explain the core purpose and impact volunteers drive.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Section Badge Tag</label>
                    <input
                      type="text"
                      value={volForm.whyBadge || "Why Volunteer"}
                      onChange={(e) => setVolForm({ ...volForm, whyBadge: e.target.value })}
                      placeholder="Why Volunteer"
                      className="w-full px-4 py-2 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Heading Title</label>
                    <input
                      type="text"
                      value={volForm.whyTitle || ""}
                      onChange={(e) => setVolForm({ ...volForm, whyTitle: e.target.value })}
                      placeholder="Make a Real Difference"
                      className="w-full px-4 py-2 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Description Paragraph</label>
                    <textarea
                      rows={4}
                      value={volForm.whyDesc || ""}
                      onChange={(e) => setVolForm({ ...volForm, whyDesc: e.target.value })}
                      placeholder="ESN volunteers are at the heart of everything we do..."
                      className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Volunteer Benefits
                    </h4>
                    <p className="text-xs text-gray-400">List of perks, certificates, and opportunities.</p>
                  </div>
                  <button
                    onClick={addBenefit}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B5D3F]/10 text-[#0B5D3F] rounded-xl text-xs font-bold hover:bg-[#0B5D3F]/20"
                  >
                    <Plus size={14} /> Add Benefit
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {(volForm.benefits || defaultVolunteerPageContent.benefits).map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#4CAF50] shrink-0" />
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => handleBenefitChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-800 bg-[#F6FBF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                      />
                      <button
                        onClick={() => removeBenefit(idx)}
                        type="button"
                        className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveVolunteerPage}
              disabled={savingPage}
              className="flex items-center gap-2 px-8 py-3 bg-[#0B5D3F] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-lg disabled:opacity-50"
            >
              <Save size={16} /> {savingPage ? "Saving..." : "Save Volunteer Page Changes"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === "careers" ? "jobs" : "roles"}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredList.map((item) => {
              const appCount = getApplicantCount(item.title);
              const isClosed = item.status === "Closed";
              return (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {item.title}
                      </h4>
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isClosed ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {isClosed ? "Closed" : "Active"}
                      </button>
                      <span className="text-xs text-gray-400">
                        {appCount} {appCount === 1 ? "applicant" : "applicants"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={13} className="text-[#0B5D3F]" /> {item.location}</span>
                      {activeTab === "careers" ? (
                        <>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-600">{item.dept}</span>
                          <span className="text-emerald-700 font-bold">{item.salary}</span>
                          <span className="text-gray-400">Deadline: {item.deadline}</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1"><Clock size={13} className="text-[#0B5D3F]" /> {item.commitment}</span>
                          <span className="bg-emerald-50 text-[#0B5D3F] px-2 py-0.5 rounded-md font-semibold">{item.skills}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => { setEditingItem(item); setShowModal(true); }}
                      className="p-2.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-[#0B5D3F]/10 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredList.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-gray-100">
                <AlertTriangle size={32} className="mx-auto mb-2 opacity-30 text-[#0B5D3F]" />
                <p className="font-semibold text-sm">No {activeTab} found matching your query.</p>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="font-black text-gray-900 text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {editingItem ? "Edit Posting" : "Create New Posting"} ({activeTab === "careers" ? "Job" : "Role"})
              </h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4 text-sm">
                <div>
                  <label className="block font-bold text-xs text-gray-700 mb-1">Title *</label>
                  <input required name="title" defaultValue={editingItem?.title} placeholder="e.g. Environmental Data Analyst" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                </div>
                
                <div>
                  <label className="block font-bold text-xs text-gray-700 mb-1">Location *</label>
                  <input required name="location" defaultValue={editingItem?.location} placeholder="e.g. Dhaka, Bangladesh / Remote" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                </div>

                {activeTab === "careers" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Department</label>
                        <input required name="dept" defaultValue={editingItem?.dept || "Programs"} className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Employment Type</label>
                        <input required name="type" defaultValue={editingItem?.type || "Full-time"} placeholder="e.g. Full-time, Remote" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Application Deadline</label>
                        <input required name="deadline" defaultValue={editingItem?.deadline || "Sep 30, 2026"} className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Salary Range</label>
                        <input required name="salary" defaultValue={editingItem?.salary || "$40K–$55K"} placeholder="e.g. $40k - $50k" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-xs text-gray-700 mb-1">Job Overview</label>
                      <textarea required name="desc" defaultValue={editingItem?.desc} rows={3} placeholder="Describe the role mission and responsibilities..." className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block font-bold text-xs text-gray-700 mb-1">Candidate Requirements</label>
                      <textarea required name="requirements" defaultValue={editingItem?.requirements} rows={2} placeholder="Key qualifications, degree, language proficiencies..." className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none resize-none" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Time Commitment</label>
                        <input required name="commitment" defaultValue={editingItem?.commitment || "4–8 hrs/week"} placeholder="e.g. 4-8 hrs/week" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                      <div>
                        <label className="block font-bold text-xs text-gray-700 mb-1">Required Skills</label>
                        <input required name="skills" defaultValue={editingItem?.skills || "Teamwork, Communication"} placeholder="e.g. Research, Tree Planting" className="w-full px-4 py-2.5 bg-[#F6FBF8] border border-gray-200 rounded-xl text-sm focus:border-[#4CAF50] outline-none" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-100 font-bold text-xs uppercase tracking-wider text-gray-600 rounded-xl hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 bg-[#0B5D3F] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#0a5237] shadow-md">Save Posting</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
