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
  const [careerApps] = useFirestoreData<any[]>("esn_apps_career", []);
  const [volApps] = useFirestoreData<any[]>("esn_apps_volunteer", []);

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
        updatedJobs.unshift({ id: Date.now(), status: "Active", ...data });
      }
      setJobs(updatedJobs);
    } else {
      let updatedRoles = [...roles];
      if (editingItem) {
        updatedRoles = updatedRoles.map(r => r.id === editingItem.id ? { ...r, ...data } : r);
      } else {
        updatedRoles.unshift({ id: Date.now(), status: "Active", ...data });
      }
      setRoles(updatedRoles);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const toggleStatus = (id: number) => {
    if (activeTab === "careers") {
      setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === "Closed" ? "Active" : "Closed" } : j));
    } else {
      setRoles(roles.map(r => r.id === id ? { ...r, status: r.status === "Closed" ? "Active" : "Closed" } : r));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this posting?")) {
      if (activeTab === "careers") {
        setJobs(jobs.filter(j => j.id !== id));
      } else {
        setRoles(roles.filter(r => r.id !== id));
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
          <p className="text-sm text-gray-400 mt-0.5">Manage live job vacancies, volunteer opportunities & application funnels</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 text-xs font-bold transition-all">
            <RefreshCw size={13} /> Reset Defaults
          </button>
          <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#0B5D3F] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-sm">
            <Plus size={15} /> Add New {activeTab === "careers" ? "Career Job" : "Volunteer Role"}
          </button>
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
      </div>

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
                  <span className="text-xs font-bold text-[#0B5D3F] bg-[#0B5D3F]/10 px-2.5 py-0.5 rounded-full">
                    {appCount} {appCount === 1 ? "applicant" : "applicants"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-medium"><MapPin size={13} className="text-gray-400" /> {item.location}</span>
                  {activeTab === "careers" ? (
                    <>
                      <span className="flex items-center gap-1 font-medium"><Briefcase size={13} className="text-gray-400" /> {item.dept} · {item.type || "Full-time"}</span>
                      {item.salary && <span className="font-bold text-gray-700">{item.salary}</span>}
                      {item.deadline && <span className="flex items-center gap-1"><Clock size={13} className="text-gray-400" /> Deadline: {item.deadline}</span>}
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 font-medium"><Clock size={13} className="text-gray-400" /> {item.commitment}</span>
                      {item.skills && <span className="text-gray-500">Skills: {item.skills}</span>}
                    </>
                  )}
                </div>

                {item.desc && (
                  <p className="text-xs text-gray-500 line-clamp-1 pt-1">{item.desc}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => { setEditingItem(item); setShowModal(true); }}
                  className="p-2.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-green-50 rounded-xl transition-all border border-gray-100"
                  title="Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
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
