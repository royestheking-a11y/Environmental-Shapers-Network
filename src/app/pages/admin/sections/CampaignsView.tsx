import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Megaphone, Plus, Search, Target, Users, Calendar, Edit3,
  Trash2, Eye, Heart, TreePine, Droplets, Wind, X,
  TrendingUp, CheckCircle2, Clock, AlertCircle, Share2, QrCode,
  AlertTriangle, Copy, Check
} from "lucide-react";

type CampaignStatus = "active" | "draft" | "completed" | "paused";

export interface Campaign {
  id: number;
  title: string;
  category: string;
  status: CampaignStatus;
  goal: number;
  raised: number;
  volunteers: number;
  startDate: string;
  endDate: string;
  description: string;
  sdgs: string[];
  lead: string;
  image: string;
  color: string;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function getInitialCampaigns(): Campaign[] {
  return [
    { id: 1, title: "Plant A Million Trees", category: "Forest Restoration", status: "active", goal: 1000000, raised: 847000, volunteers: 4200, startDate: "Jan 1, 2026", endDate: "Dec 31, 2026", description: "Restoring degraded lands through community-driven tree planting.", sdgs: ["SDG 13", "SDG 15"], lead: "Rizwan Ahmed", image: "/Climate Reality Leadership Corps Training | Representing Bangladesh.jpeg", color: "#0B5D3F" },
    { id: 2, title: "Clean Ocean Initiative", category: "Marine Conservation", status: "active", goal: 500000, raised: 312000, volunteers: 2800, startDate: "Mar 1, 2026", endDate: "Nov 30, 2026", description: "Removing plastic waste from coastlines globally.", sdgs: ["SDG 14", "SDG 6"], lead: "Carlos Rodriguez", image: "/Commonwealth Secretariat at COP27.jpeg", color: "#173B63" },
    { id: 3, title: "Youth Climate Action", category: "Climate Advocacy", status: "active", goal: 250000, raised: 198000, volunteers: 8900, startDate: "Feb 1, 2026", endDate: "Sep 30, 2026", description: "Mobilizing youth leaders in 50+ countries.", sdgs: ["SDG 13", "SDG 4"], lead: "Priya Sharma", image: "/Speaking on Climate Adaptation and Resilience in South Asia- CEPCA 2024, Ottawa, Canada.jpeg", color: "#0B5D3F" },
    { id: 4, title: "Solar Villages Africa", category: "Renewable Energy", status: "active", goal: 320000, raised: 189000, volunteers: 450, startDate: "Apr 1, 2026", endDate: "Mar 31, 2027", description: "Bringing solar power to off-grid communities.", sdgs: ["SDG 7", "SDG 11"], lead: "Amara Osei", image: "/meeting time.jpeg", color: "#D6A95A" },
    { id: 5, title: "Biodiversity Hackathon 2025", category: "Innovation", status: "completed", goal: 50000, raised: 51200, volunteers: 800, startDate: "Jun 1, 2025", endDate: "Jun 30, 2025", description: "48-hour tech sprint for biodiversity solutions.", sdgs: ["SDG 15"], lead: "Admin Team", image: "/canada journey.jpeg", color: "#4CAF50" },
    { id: 6, title: "Himalayan Watershed Revival", category: "Water Security", status: "draft", goal: 180000, raised: 0, volunteers: 0, startDate: "Sep 1, 2026", endDate: "Aug 31, 2027", description: "Restoring watershed ecosystems in the Himalayas.", sdgs: ["SDG 6", "SDG 15"], lead: "Priya Sharma", image: "/represent bangladesh.jpeg", color: "#173B63" },
  ];
}

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ComponentType<any> }> = {
  active: { label: "Active", color: "#4CAF50", icon: CheckCircle2 },
  draft: { label: "Draft", color: "#D6A95A", icon: Clock },
  completed: { label: "Completed", color: "#6b7280", icon: CheckCircle2 },
  paused: { label: "Paused", color: "#ef4444", icon: AlertCircle },
};

const blankCampaign: Omit<Campaign, "id"> = {
  title: "", category: "Forest Restoration", status: "draft",
  goal: 0, raised: 0, volunteers: 0, startDate: "", endDate: "",
  description: "", sdgs: [], lead: "", image: "", color: "#0B5D3F",
};

function QRGrid({ size = 120 }: { size?: number }) {
  const cells = 10;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} style={{ imageRendering: "pixelated" }}>
      {Array.from({ length: cells }, (_, row) =>
        Array.from({ length: cells }, (_, col) => {
          const corner = (row < 3 && col < 3) || (row < 3 && col > cells - 4) || (row > cells - 4 && col < 3);
          const edge = row === 0 || row === cells - 1 || col === 0 || col === cells - 1;
          const filled = corner || edge || ((row * 5 + col * 3) % 3 < 1);
          return filled ? <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill="#0B5D3F" /> : null;
        })
      )}
    </svg>
  );
}

export function CampaignsView() {
  const [campaigns, setCampaigns, loading] = useFirestoreData<Campaign[]>("esn_campaigns_admin", getInitialCampaigns());
  
  useEffect(() => {
    if (campaigns.length > 0 && campaigns.some(c => c.image.includes('unsplash'))) {
      saveFirestoreData("esn_campaigns_admin", getInitialCampaigns());
    }
  }, [campaigns]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | CampaignStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Campaign, "id">>(blankCampaign);
  const [editId, setEditId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<Campaign | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const save = async (list: Campaign[]) => {
    setCampaigns(list);
    await saveFirestoreData("esn_campaigns_admin", list);
  };

  const handleSubmit = () => {
    if (!form.title) return;
    if (editId !== null) {
      save(campaigns.map((c) => c.id === editId ? { ...form, id: editId } : c));
    } else {
      save([{ ...form, id: Date.now() }, ...campaigns]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankCampaign);
  };

  const startEdit = (c: Campaign) => {
    const { id, ...rest } = c;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  };

  const confirmDelete = (id: number) => setDeleteConfirmId(id);
  const doDelete = () => {
    if (deleteConfirmId === null) return;
    save(campaigns.filter((c) => c.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setDetail(null);
  };

  const shareCampaign = (c: Campaign) => {
    const url = `https://esnbd.org/campaigns/${c.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const totalVolunteers = campaigns.reduce((s, c) => s + c.volunteers, 0);
  const campaignToDelete = campaigns.find(c => c.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaigns Manager</h3>
          <p className="text-sm text-gray-400 mt-0.5">{campaigns.length} campaigns · {activeCampaigns} active</p>
        </div>
        <button onClick={() => { setForm(blankCampaign); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: campaigns.length, icon: Megaphone, color: "#0B5D3F" },
          { label: "Active", value: activeCampaigns, icon: TrendingUp, color: "#4CAF50" },
          { label: "Total Raised", value: `$${(totalRaised / 1000).toFixed(0)}K`, icon: Heart, color: "#173B63" },
          { label: "Volunteers Mobilized", value: totalVolunteers.toLocaleString(), icon: Users, color: "#D6A95A" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Campaign" : "New Campaign"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Campaign Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Campaign name..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                {[
                  { label: "Category", key: "category", type: "select", opts: ["Forest Restoration", "Marine Conservation", "Climate Advocacy", "Renewable Energy", "Water Security", "Biodiversity", "Innovation", "Community"] },
                  { label: "Status", key: "status", type: "select", opts: ["draft", "active", "paused", "completed"] },
                  { label: "Fundraising Goal ($)", key: "goal", type: "number" },
                  { label: "Campaign Lead", key: "lead", type: "text" },
                  { label: "Start Date", key: "startDate", type: "text" },
                  { label: "End Date", key: "endDate", type: "text" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                    {f.type === "select" ? (
                      <select value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none capitalize">
                        {f.opts!.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Campaign description..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">{editId ? "Save Changes" : "Create Campaign"}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Campaign?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{campaignToDelete?.title}"</p>
              <div className="flex gap-3">
                <button onClick={doDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">Yes, Delete</button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaign QR Code</h4>
                <button onClick={() => setShowQR(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={15} /></button>
              </div>
              <div className="flex justify-center mb-4 p-6 bg-[#F6FBF8] rounded-2xl">
                <QRGrid size={160} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{showQR.title}</p>
              <p className="text-xs text-gray-400 mb-5">{showQR.category}</p>
              <p className="text-xs text-gray-400 bg-[#F6FBF8] rounded-xl px-4 py-2 font-mono">
                https://esnbd.org/campaigns/{showQR.id}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["All", "active", "draft", "completed", "paused"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-[#0B5D3F]/10"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((c) => {
          const sc = statusConfig[c.status];
          const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
              <div className="h-1.5 w-full" style={{ backgroundColor: sc.color + "30" }}>
                <div className="h-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: sc.color }} />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: sc.color, backgroundColor: sc.color + "18" }}>
                        {sc.label}
                      </span>
                      <span className="text-xs text-gray-400 bg-[#F6FBF8] px-2 py-1 rounded-full border border-gray-100">{c.category}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.title}</h4>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Fundraising Progress</span>
                    <span className="font-bold" style={{ color: sc.color }}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: sc.color }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                    <span>${c.raised.toLocaleString()} raised</span>
                    <span>Goal: ${c.goal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-50 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-black text-gray-800">{c.volunteers.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Volunteers</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-sm font-black text-gray-800">{c.sdgs.length}</div>
                    <div className="text-xs text-gray-400">SDGs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-600 truncate">{c.lead.split(" ")[0]}</div>
                    <div className="text-xs text-gray-400">Lead</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
                  <Calendar size={11} />
                  {c.startDate} → {c.endDate || "Ongoing"}
                </div>
                <div className="flex gap-1.5 mb-5">
                  {c.sdgs.map((sdg) => (
                    <span key={sdg} className="text-xs font-bold bg-[#D6A95A]/15 text-[#D6A95A] px-2 py-1 rounded-full">{sdg}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDetail(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-[#F6FBF8] border border-gray-100 text-gray-600 hover:bg-[#0B5D3F] hover:text-white hover:border-[#0B5D3F] transition-all">
                    <Eye size={13} /> View
                  </button>
                  <button onClick={() => startEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-[#F6FBF8] border border-gray-100 text-gray-600 hover:bg-[#173B63] hover:text-white hover:border-[#173B63] transition-all">
                    <Edit3 size={13} /> Edit
                  </button>
                  <button onClick={() => confirmDelete(c.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F6FBF8] border border-gray-100 text-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={() => setDetail(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="h-full w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaign Details</h4>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-6 flex-1">
                <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-2xl p-6 text-white mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone size={18} className="text-[#4CAF50]" />
                    <span className="text-xs text-white/60">{detail.category}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2 text-sm">{detail.title}</h4>
                  <p className="text-white/60 text-xs">{detail.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    ["Goal", `$${detail.goal.toLocaleString()}`],
                    ["Raised", `$${detail.raised.toLocaleString()}`],
                    ["Volunteers", detail.volunteers.toLocaleString()],
                    ["Lead", detail.lead],
                    ["Start", detail.startDate],
                    ["End", detail.endDate || "Ongoing"],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-[#F6FBF8] rounded-xl p-3">
                      <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                      <div className="text-sm font-bold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => shareCampaign(detail)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
                  >
                    {shareSuccess ? <><Check size={15} /> Link Copied!</> : <><Share2 size={15} /> Share Campaign</>}
                  </button>
                  <button
                    onClick={() => setShowQR(detail)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    <QrCode size={15} /> Generate QR Code
                  </button>
                  <button
                    onClick={() => { setDetail(null); confirmDelete(detail.id); }}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={15} /> Delete Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
