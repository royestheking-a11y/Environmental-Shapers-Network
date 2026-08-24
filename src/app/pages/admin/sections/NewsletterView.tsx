import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Users, Send, Plus, Edit3, Trash2, Eye, Search,
  TrendingUp, Clock, CheckCircle2, X, BarChart2, MousePointerClick,
  AlertCircle, Leaf
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const openRateData = [
  { month: "Feb", rate: 32 }, { month: "Mar", rate: 38 }, { month: "Apr", rate: 35 },
  { month: "May", rate: 42 }, { month: "Jun", rate: 48 }, { month: "Jul", rate: 51 },
];

type CampaignStatus = "sent" | "draft" | "scheduled";

interface NewsletterCampaign {
  id: number;
  subject: string;
  status: CampaignStatus;
  recipients: number;
  openRate: number;
  clickRate: number;
  date: string;
  preview: string;
}

function getInitialCampaigns(): NewsletterCampaign[] {
  return [
    { id: 1, subject: "ESN July Impact Report: 2.4M Trees & Counting", status: "sent", recipients: 48291, openRate: 54, clickRate: 12, date: "Jul 25, 2026", preview: "This month we crossed a historic milestone..." },
    { id: 2, subject: "Youth Climate Summit Registration is Now Open!", status: "sent", recipients: 48291, openRate: 61, clickRate: 18, date: "Jul 18, 2026", preview: "Join 500+ delegates from 80 countries in Dhaka..." },
    { id: 3, subject: "New Report: Nature-Based Solutions for 2030 Goals", status: "sent", recipients: 47100, openRate: 44, clickRate: 9, date: "Jul 10, 2026", preview: "Our latest research shows a 30% mitigation potential..." },
    { id: 4, subject: "August Newsletter: Ocean Conservation Week", status: "scheduled", recipients: 48500, openRate: 0, clickRate: 0, date: "Aug 1, 2026", preview: "A preview of what's happening in ocean conservation..." },
    { id: 5, subject: "Partner Spotlight: TechCorp x ESN Partnership", status: "draft", recipients: 0, openRate: 0, clickRate: 0, date: "—", preview: "We are thrilled to announce our new corporate partner..." },
  ];
}

const blankCampaign = { subject: "", preview: "", status: "draft" as CampaignStatus, date: "" };

const statusConfig: Record<CampaignStatus, { label: string; color: string }> = {
  sent: { label: "Sent", color: "#4CAF50" },
  scheduled: { label: "Scheduled", color: "#173B63" },
  draft: { label: "Draft", color: "#D6A95A" },
};

import { useFirestoreData } from "../../../../lib/useFirestore";

export function NewsletterView() {
  const [campaigns, setCampaigns, loadingCamps] = useFirestoreData<NewsletterCampaign[]>("esn_newsletters", getInitialCampaigns());
  const [subsData, setSubsData, loadingSubs] = useFirestoreData<any[]>("esn_subscribers", []);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | CampaignStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankCampaign);
  const [editId, setEditId] = useState<number | null>(null);
  const [previewItem, setPreviewItem] = useState<NewsletterCampaign | null>(null);

  const save = (list: NewsletterCampaign[]) => {
    setCampaigns(list);
  };

  const handleSubmit = () => {
    if (!form.subject) return;
    if (editId !== null) {
      save(campaigns.map((c) => c.id === editId ? { ...c, ...form } : c));
    } else {
      save([{ ...form, id: Date.now(), recipients: 0, openRate: 0, clickRate: 0 }, ...campaigns]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankCampaign);
  };

  const startEdit = (c: NewsletterCampaign) => {
    setForm({ subject: c.subject, preview: c.preview, status: c.status, date: c.date });
    setEditId(c.id);
    setShowForm(true);
  };

  const filtered = (campaigns || []).filter((c) => {
    if (!c) return false;
    const subject = String(c.subject || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    const matchSearch = !q || subject.includes(q);
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const storedSubs = subsData.length;
  const totalSubs = 48291 + storedSubs;
  const avgOpen = Math.round(campaigns.filter(c => c.status === "sent").reduce((s, c) => s + c.openRate, 0) / (campaigns.filter(c => c.status === "sent").length || 1));

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Newsletter Manager</h3>
          <p className="text-sm text-gray-400 mt-0.5">{totalSubs.toLocaleString()} subscribers · {campaigns.filter(c => c.status === "sent").length} campaigns sent</p>
        </div>
        <button onClick={() => { setForm(blankCampaign); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: totalSubs.toLocaleString(), icon: Users, color: "#0B5D3F", sub: "+2.4K this month" },
          { label: "Avg. Open Rate", value: `${avgOpen}%`, icon: Mail, color: "#4CAF50", sub: "Industry avg: 21%" },
          { label: "Avg. Click Rate", value: "13%", icon: MousePointerClick, color: "#173B63", sub: "Industry avg: 2.6%" },
          { label: "Campaigns Sent", value: campaigns.filter(c => c.status === "sent").length.toString(), icon: Send, color: "#D6A95A", sub: "This year" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: k.color + "15" }}>
              <k.icon size={19} style={{ color: k.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.value}</div>
              <div className="text-xs font-semibold text-gray-600">{k.label}</div>
              <div className="text-xs text-[#4CAF50] mt-0.5">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-gray-900">Open Rate Trend</h4>
            <p className="text-xs text-gray-400">Monthly email open rates (2026)</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#4CAF50] font-semibold">
            <TrendingUp size={14} /> +19% since Feb
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={openRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, "Open Rate"]} />
            <Bar dataKey="rate" fill="#0B5D3F" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Campaign" : "New Campaign"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subject Line *</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Campaign subject..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Preview Text</label>
                  <input type="text" value={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.value })} placeholder="Preview shown in inbox..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="sent">Sent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Send Date</label>
                    <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Aug 1, 2026" className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
                  {editId ? "Save Changes" : "Create Campaign"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
          </div>
          <div className="flex gap-2">
            {(["All", "sent", "scheduled", "draft"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Subject</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">Recipients</th>
                <th className="text-left px-4 py-3.5">Open Rate</th>
                <th className="text-left px-4 py-3.5">Click Rate</th>
                <th className="text-left px-4 py-3.5">Date</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = statusConfig[c.status];
                return (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-[#F6FBF8]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-800 max-w-xs truncate">{c.subject}</div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">{c.preview}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: sc.color, backgroundColor: sc.color + "18" }}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700">{c.recipients > 0 ? c.recipients.toLocaleString() : "—"}</td>
                    <td className="px-4 py-4">
                      {c.status === "sent" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#4CAF50] rounded-full" style={{ width: `${c.openRate}%` }} />
                          </div>
                          <span className="text-xs font-bold text-[#4CAF50]">{c.openRate}%</span>
                        </div>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      {c.status === "sent" ? (
                        <span className="text-xs font-bold text-[#173B63]">{c.clickRate}%</span>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{c.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPreviewItem(c)} className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all"><Eye size={14} /></button>
                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all"><Edit3 size={14} /></button>
                        <button onClick={() => save(campaigns.filter((x) => x.id !== c.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf size={16} className="text-[#4CAF50]" />
                  <span className="text-xs font-semibold text-white/60">Environmental Shapers Network</span>
                </div>
                <h4 className="text-white font-bold mb-1">{previewItem.subject}</h4>
                <p className="text-white/60 text-sm">{previewItem.preview}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[["Recipients", previewItem.recipients > 0 ? previewItem.recipients.toLocaleString() : "—"], ["Open Rate", previewItem.status === "sent" ? `${previewItem.openRate}%` : "—"], ["Click Rate", previewItem.status === "sent" ? `${previewItem.clickRate}%` : "—"]].map(([l, v]) => (
                    <div key={l} className="bg-[#F6FBF8] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                      <div className="font-bold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPreviewItem(null)} className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">Close Preview</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
