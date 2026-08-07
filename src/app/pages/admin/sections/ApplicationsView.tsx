import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Users, Handshake, Briefcase, Search, RefreshCw, Download,
  Check, X, Clock, Eye, ChevronDown, ChevronUp, Filter, AlertTriangle,
  Mail, Phone, Globe2, MapPin, Calendar, Star, CheckCircle2
} from "lucide-react";

type AppType = "volunteer" | "partner" | "member" | "career";
type AppStatus = "Pending" | "Approved" | "Rejected";

interface Application {
  id: number;
  type: AppType;
  status: AppStatus;
  submittedAt: string;
  name?: string;
  contactName?: string;
  orgName?: string;
  email?: string;
  phone?: string;
  country?: string;
  role?: string;
  tier?: string;
  jobTitle?: string;
  dept?: string;
  location?: string;
  motivation?: string;
  skills?: string;
  availability?: string;
  description?: string;
  coverLetter?: string;
  reason?: string;
  budget?: string;
  type_label?: string;
  [key: string]: any;
}

const APP_KEYS: Record<AppType, string> = {
  volunteer: "esn_apps_volunteer",
  partner: "esn_apps_partner",
  member: "esn_apps_member",
  career: "esn_apps_career",
};

const TYPE_CONFIG = {
  volunteer: { label: "Volunteers", icon: Heart, color: "#0B5D3F", bg: "#F0FBF4" },
  partner: { label: "Partners", icon: Handshake, color: "#173B63", bg: "#F0F4FF" },
  member: { label: "Members", icon: Users, color: "#4CAF50", bg: "#F0FFF4" },
  career: { label: "Careers", icon: Briefcase, color: "#D6A95A", bg: "#FFF8F0" },
};

const STATUS_CONFIG = {
  Pending: { color: "#D97706", bg: "#FEF3C7", icon: Clock },
  Approved: { color: "#059669", bg: "#D1FAE5", icon: CheckCircle2 },
  Rejected: { color: "#DC2626", bg: "#FEE2E2", icon: X },
};

import { fetchFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

async function loadAllApps(): Promise<Application[]> {
  const all: Application[] = [];
  for (const type of Object.keys(APP_KEYS) as AppType[]) {
    try {
      const stored = await fetchFirestoreData<Application[]>(APP_KEYS[type], []);
      stored.forEach((a: Application) => all.push({ ...a, type }));
    } catch {}
  }
  return all.sort((a, b) => b.id - a.id);
}

async function saveAppStatus(app: Application, status: AppStatus) {
  try {
    const key = APP_KEYS[app.type];
    const stored = await fetchFirestoreData<Application[]>(key, []);
    const updated = stored.map((a) => a.id === app.id ? { ...a, status } : a);
    await saveFirestoreData(key, updated);
  } catch {}
}

async function seedDemoApps() {
  const demos: { type: AppType; data: Partial<Application> }[] = [
    { type: "volunteer", data: { name: "Anika Rahman", email: "anika@gmail.com", phone: "+880 171234567", country: "Bangladesh", role: "Field Volunteer", skills: "Biology graduate, 3 years tree planting exp", availability: "5–10 hours/week", motivation: "I grew up near the Sundarbans and want to give back." } },
    { type: "volunteer", data: { name: "James Osei", email: "james.o@yahoo.com", phone: "+233 241234567", country: "Ghana", role: "Research Assistant", skills: "MSc Environmental Science, data analysis, R/Python", availability: "10+ hours/week", motivation: "I've followed ESN's work for years and want to contribute to climate research." } },
    { type: "career", data: { name: "Priya Singh", email: "priya.singh@outlook.com", phone: "+91 9876543210", country: "India", jobTitle: "Research Associate — Climate Policy", dept: "Research", location: "Remote", coverLetter: "With my PhD in Environmental Policy from IIT Delhi, I am eager to contribute to ESN's research agenda..." } },
    { type: "partner", data: { orgName: "GreenTech Solutions Ltd", contactName: "Mohammed Al-Farsi", email: "mfarsi@greentech.ae", phone: "+971 501234567", type: "Corporate Partners", website: "https://greentech.ae", description: "We seek to offset 10,000 tons of CO₂ through ESN's reforestation programs as part of our 2030 sustainability pledge.", budget: "$100,000 – $500,000", timeline: "Short-term (1–3 months)" } },
    { type: "member", data: { name: "Sofia Hernandez", email: "sofia.h@eco.mx", phone: "+52 5551234567", country: "Mexico", tier: "Advocate", occupation: "Environmental Consultant", reason: "I want to be part of the global movement and contribute to ESN's mission from Latin America." } },
    { type: "career", data: { name: "David Kimura", email: "d.kimura@mail.jp", phone: "+81 9012345678", country: "Japan", jobTitle: "Digital Marketing Specialist", dept: "Marketing", location: "Remote", coverLetter: "I have 5 years experience running digital campaigns for NGOs and am passionate about ESN's mission..." } },
  ];

  for (const [idx, { type, data }] of demos.entries()) {
    const key = APP_KEYS[type];
    const existing = await fetchFirestoreData<Application[]>(key, []);
    if (existing.length === 0) {
      const app = { id: Date.now() + idx, type, status: "Pending", submittedAt: new Date(Date.now() - idx * 86400000).toISOString(), ...data };
      await saveFirestoreData(key, [app]);
    }
  }
}

export function ApplicationsView() {
  const [apps, setApps] = useState<Application[]>([]);
  const [activeType, setActiveType] = useState<AppType | "all">("all");
  const [activeStatus, setActiveStatus] = useState<AppStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ app: Application; status: AppStatus } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const reload = () => {
    setRefreshing(true);
    loadAllApps().then((data) => {
      setApps(data);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    seedDemoApps().then(() => {
      loadAllApps().then(setApps);
    });
  }, []);

  const updateStatus = async (app: Application, status: AppStatus) => {
    setApps(apps.map((a) => (a.id === app.id && a.type === app.type ? { ...a, status } : a)));
    await saveAppStatus(app, status);
    setConfirmAction(null);
  };

  const exportCSV = () => {
    const headers = ["ID", "Type", "Name/Org", "Email", "Role/Position", "Country", "Status", "Submitted"];
    const rows = filtered.map((a) => [
      a.id, TYPE_CONFIG[a.type].label,
      a.name || a.contactName || a.orgName || "-",
      a.email || "-",
      a.role || a.jobTitle || a.tier || a.type_label || "-",
      a.country || "-",
      a.status,
      new Date(a.submittedAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "esn-applications.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const q = search.toLowerCase();
  const filtered = apps.filter((a) => {
    const typeOk = activeType === "all" || a.type === activeType;
    const statusOk = activeStatus === "all" || a.status === activeStatus;
    const searchOk = !q || (a.name || a.contactName || a.orgName || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q) || (a.role || a.jobTitle || "").toLowerCase().includes(q);
    return typeOk && statusOk && searchOk;
  });

  const counts = {
    all: apps.length,
    volunteer: apps.filter((a) => a.type === "volunteer").length,
    partner: apps.filter((a) => a.type === "partner").length,
    member: apps.filter((a) => a.type === "member").length,
    career: apps.filter((a) => a.type === "career").length,
    pending: apps.filter((a) => a.status === "Pending").length,
    approved: apps.filter((a) => a.status === "Approved").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  const getDisplayName = (a: Application) => a.name || a.contactName || a.orgName || "—";
  const getRole = (a: Application) => a.role || a.jobTitle || (a.tier ? `${a.tier} Membership` : a.type_label || "—");

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.4rem" }}>Applications</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage all volunteer, career, partnership, and membership applications</p>
        </div>
        <div className="flex gap-3">
          <button onClick={reload} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#0B5D3F] text-white rounded-xl text-sm font-semibold hover:bg-[#0a5237] transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: counts.all, color: "#0B5D3F" },
          { label: "Pending", value: counts.pending, color: "#D97706" },
          { label: "Approved", value: counts.approved, color: "#059669" },
          { label: "Rejected", value: counts.rejected, color: "#DC2626" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: k.color + "15" }}>
              <span className="font-black text-sm" style={{ color: k.color }}>{k.value}</span>
            </div>
            <span className="text-sm text-gray-500 font-medium">{k.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-5 flex flex-wrap gap-3 items-center">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveType("all")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeType === "all" ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>All ({counts.all})</button>
          {(Object.keys(TYPE_CONFIG) as AppType[]).map((t) => {
            const cfg = TYPE_CONFIG[t];
            return (
              <button key={t} onClick={() => setActiveType(t)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeType === t ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`} style={activeType === t ? { backgroundColor: cfg.color } : {}}>
                <cfg.icon size={11} />{cfg.label} ({counts[t]})
              </button>
            );
          })}
        </div>
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
        {/* Status filter */}
        <div className="flex gap-2">
          {(["all", "Pending", "Approved", "Rejected"] as const).map((s) => (
            <button key={s} onClick={() => setActiveStatus(s as AppStatus | "all")} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeStatus === s ? "bg-[#0B5D3F] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s === "all" ? "All Status" : s}</button>
          ))}
        </div>
        {/* Search */}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm w-48 transition-all" placeholder="Search applicants…" />
        </div>
      </div>

      {/* Application List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No applications found</p>
          <p className="text-sm mt-1">Applications submitted via the website will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((app) => {
            const tc = TYPE_CONFIG[app.type];
            const sc = STATUS_CONFIG[app.status];
            const isOpen = expanded === app.id;

            return (
              <motion.div key={`${app.type}-${app.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                {/* Row */}
                <div className="flex items-center gap-4 p-5">
                  {/* Type icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                    <tc.icon size={18} style={{ color: tc.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{getDisplayName(app)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: tc.bg, color: tc.color }}>{tc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      {app.email && <span className="flex items-center gap-1"><Mail size={10} />{app.email}</span>}
                      {(app.country) && <span className="flex items-center gap-1"><Globe2 size={10} />{app.country}</span>}
                      <span className="flex items-center gap-1"><Calendar size={10} />{new Date(app.submittedAt).toLocaleDateString()}</span>
                      {getRole(app) !== "—" && <span className="italic text-gray-400">{getRole(app)}</span>}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
                    <sc.icon size={11} />
                    {app.status}
                  </div>

                  {/* Action buttons */}
                  {app.status === "Pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setConfirmAction({ app, status: "Approved" })} className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-all border border-green-200">
                        <Check size={12} /> Approve
                      </button>
                      <button onClick={() => setConfirmAction({ app, status: "Rejected" })} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-200">
                        <X size={12} /> Reject
                      </button>
                    </div>
                  )}
                  {app.status !== "Pending" && (
                    <button onClick={() => setConfirmAction({ app, status: "Pending" })} className="px-3 py-2 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all border border-gray-200 shrink-0">
                      Reset
                    </button>
                  )}

                  {/* Expand */}
                  <button onClick={() => setExpanded(isOpen ? null : app.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 transition-all shrink-0">
                    {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                  </button>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
                      <div className="p-5 grid sm:grid-cols-2 gap-6">
                        {/* Left — basic info */}
                        <div className="flex flex-col gap-3">
                          <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Applicant Details</div>
                          {[
                            ["Type", tc.label],
                            ["Name", getDisplayName(app)],
                            ["Email", app.email],
                            ["Phone", app.phone],
                            ["Country", app.country],
                            ["Role / Position", getRole(app)],
                            ["Submitted", new Date(app.submittedAt).toLocaleString()],
                          ].filter(([, v]) => v).map(([l, v]) => (
                            <div key={l as string} className="flex justify-between text-sm">
                              <span className="text-gray-400 shrink-0">{l}</span>
                              <span className="font-medium text-gray-800 text-right max-w-[60%] break-words">{v}</span>
                            </div>
                          ))}
                          {app.availability && (
                            <div className="flex justify-between text-sm"><span className="text-gray-400">Availability</span><span className="font-medium text-gray-800">{app.availability}</span></div>
                          )}
                          {app.budget && (
                            <div className="flex justify-between text-sm"><span className="text-gray-400">Budget</span><span className="font-medium text-gray-800">{app.budget}</span></div>
                          )}
                        </div>
                        {/* Right — free text */}
                        <div className="flex flex-col gap-4">
                          {(app.motivation || app.coverLetter || app.reason || app.description || app.skills) && (
                            <div>
                              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                {app.coverLetter ? "Cover Letter" : app.motivation ? "Motivation" : app.description ? "Vision" : app.reason ? "Reason" : "Skills"}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
                                {app.coverLetter || app.motivation || app.description || app.reason || app.skills}
                              </p>
                            </div>
                          )}
                          {app.skills && app.motivation && (
                            <div>
                              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Skills</div>
                              <p className="text-sm text-gray-600 bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">{app.skills}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmAction.status === "Approved" ? "bg-green-100" : confirmAction.status === "Rejected" ? "bg-red-100" : "bg-gray-100"}`}>
                <AlertTriangle size={26} className={confirmAction.status === "Approved" ? "text-green-600" : confirmAction.status === "Rejected" ? "text-red-600" : "text-gray-500"} />
              </div>
              <h3 className="font-black text-gray-900 text-center mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {confirmAction.status === "Approved" ? "Approve Application?" : confirmAction.status === "Rejected" ? "Reject Application?" : "Reset to Pending?"}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                {confirmAction.status === "Approved"
                  ? `This will mark ${getDisplayName(confirmAction.app)}'s application as Approved.`
                  : confirmAction.status === "Rejected"
                  ? `This will reject ${getDisplayName(confirmAction.app)}'s application.`
                  : `This will reset the application status back to Pending.`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={() => updateStatus(confirmAction.app, confirmAction.status)} className={`flex-1 text-white py-3 rounded-xl font-semibold transition-all ${confirmAction.status === "Approved" ? "bg-green-600 hover:bg-green-700" : confirmAction.status === "Rejected" ? "bg-red-600 hover:bg-red-700" : "bg-[#0B5D3F] hover:bg-[#0a5237]"}`}>
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
