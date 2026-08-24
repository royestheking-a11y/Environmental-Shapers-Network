import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase, Heart, Plus, Trash2, Edit3, MapPin, Clock, Search,
  AlertTriangle, RefreshCw
} from "lucide-react";

import { useFirestoreData } from "../../../../lib/useFirestore";

const defaultJobs = [
  { id: 1, title: "Program Manager — Forest Restoration", dept: "Programs", location: "Dhaka, Bangladesh", type: "Full-time", deadline: "Aug 30, 2026", salary: "$45K–$60K", desc: "Lead our flagship forest restoration programs across South Asia, managing a team of 12 field staff and 200+ community volunteers.", requirements: "5+ years program management, NGO/environmental sector experience, Fluent in Bangla + English, PMP or equivalent preferred" },
  { id: 2, title: "Research Associate — Climate Policy", dept: "Research", location: "Remote", type: "Full-time", deadline: "Sep 5, 2026", salary: "$38K–$50K", desc: "Support ESN's policy research agenda, producing evidence briefs, policy papers, and stakeholder reports.", requirements: "Master's in environmental science/policy, Strong research & writing skills, Experience with IPCC frameworks, Quantitative analysis skills" },
];

const defaultRoles = [
  { id: 1, title: "Field Volunteer", location: "Bangladesh / Global", commitment: "4–8 hrs/week", skills: "Physical fitness, teamwork" },
  { id: 2, title: "Research Assistant", location: "Remote / Global", commitment: "6–10 hrs/week", skills: "Research, data analysis" },
  { id: 3, title: "Social Media Volunteer", location: "Remote", commitment: "4–6 hrs/week", skills: "Content creation, design" },
];

export function OpportunitiesView() {
  const [activeTab, setActiveTab] = useState<"careers" | "volunteers">("careers");
  const [jobs, setJobs, loadingJobs] = useFirestoreData<any[]>("esn_career_jobs", defaultJobs);
  const [roles, setRoles, loadingRoles] = useFirestoreData<any[]>("esn_volunteer_roles", defaultRoles);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [search, setSearch] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    if (activeTab === "careers") {
      let updatedJobs = [...jobs];
      if (editingItem) {
        updatedJobs = updatedJobs.map(j => j.id === editingItem.id ? { ...j, ...data } : j);
      } else {
        updatedJobs.unshift({ id: Date.now(), ...data });
      }
      setJobs(updatedJobs);
    } else {
      let updatedRoles = [...roles];
      if (editingItem) {
        updatedRoles = updatedRoles.map(r => r.id === editingItem.id ? { ...r, ...data } : r);
      } else {
        updatedRoles.unshift({ id: Date.now(), ...data });
      }
      setRoles(updatedRoles);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      if (activeTab === "careers") {
        const updatedJobs = jobs.filter(j => j.id !== id);
        setJobs(updatedJobs);
      } else {
        const updatedRoles = roles.filter(r => r.id !== id);
        setRoles(updatedRoles);
      }
    }
  };

  const refresh = () => {
    setJobs(defaultJobs);
    setRoles(defaultRoles);
  };

  const currentList = activeTab === "careers" ? jobs : roles;
  const filteredList = (currentList || []).filter(item => {
    if (!item) return false;
    const title = String(item.title || "").toLowerCase();
    const loc = String(item.location || "").toLowerCase();
    const s = String(search || "").toLowerCase().trim();
    return !s || title.includes(s) || loc.includes(s);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Careers & Volunteering</h3>
          <p className="text-sm text-gray-400 mt-0.5">Manage job postings and volunteer roles</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#0B5D3F] text-white rounded-xl font-semibold hover:bg-[#0a5237]">
            <Plus size={16} /> Add New {activeTab === "careers" ? "Job" : "Role"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab("careers")} className={`pb-3 text-sm font-bold flex items-center gap-2 ${activeTab === "careers" ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]" : "text-gray-400 hover:text-gray-600"}`}>
          <Briefcase size={16} /> Career Jobs
        </button>
        <button onClick={() => setActiveTab("volunteers")} className={`pb-3 text-sm font-bold flex items-center gap-2 ${activeTab === "volunteers" ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]" : "text-gray-400 hover:text-gray-600"}`}>
          <Heart size={16} /> Volunteer Posts
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={`Search ${activeTab === "careers" ? "jobs" : "roles"}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredList.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900 mb-1">{item.title}</div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                {activeTab === "careers" ? (
                  <>
                    <span className="flex items-center gap-1"><Briefcase size={12} /> {item.dept}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.deadline}</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.commitment}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(item); setShowModal(true); }} className="p-2 text-gray-400 hover:text-[#0B5D3F] hover:bg-green-50 rounded-lg">
                <Edit3 size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
            <p>No {activeTab} found.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-black text-gray-900 mb-6">{editingItem ? "Edit" : "Create"} {activeTab === "careers" ? "Job" : "Role"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4 text-sm">
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Title</label>
                  <input required name="title" defaultValue={editingItem?.title} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Location</label>
                  <input required name="location" defaultValue={editingItem?.location} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>

                {activeTab === "careers" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Department</label>
                        <input required name="dept" defaultValue={editingItem?.dept} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Type</label>
                        <input required name="type" defaultValue={editingItem?.type} placeholder="e.g. Full-time" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Deadline</label>
                        <input required name="deadline" defaultValue={editingItem?.deadline} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Salary Range</label>
                        <input required name="salary" defaultValue={editingItem?.salary} placeholder="e.g. $40k - $50k" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Description</label>
                      <textarea required name="desc" defaultValue={editingItem?.desc} rows={3} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none" />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Requirements (comma separated)</label>
                      <textarea required name="requirements" defaultValue={editingItem?.requirements} rows={2} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl resize-none" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Commitment</label>
                        <input required name="commitment" defaultValue={editingItem?.commitment} placeholder="e.g. 4-8 hrs/week" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Skills</label>
                        <input required name="skills" defaultValue={editingItem?.skills} placeholder="e.g. Teamwork" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#0B5D3F] text-white font-semibold rounded-xl hover:bg-[#0a5237]">Save {activeTab === "careers" ? "Job" : "Role"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
