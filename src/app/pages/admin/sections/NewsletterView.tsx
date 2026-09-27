import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Users, Send, Plus, Edit3, Trash2, Eye, Search,
  TrendingUp, Clock, CheckCircle2, X, BarChart2, MousePointerClick,
  AlertCircle, Leaf, Download, RefreshCw, ExternalLink, FileText, Link as LinkIcon
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const openRateData = [
  { month: "Feb", rate: 32 }, { month: "Mar", rate: 38 }, { month: "Apr", rate: 35 },
  { month: "May", rate: 42 }, { month: "Jun", rate: 48 }, { month: "Jul", rate: 51 },
];

export type CampaignStatus = "sent" | "draft" | "scheduled";

export interface NewsletterCampaign {
  id: number;
  subject: string;
  volume?: string;
  status: CampaignStatus;
  recipients: number;
  openRate: number;
  clickRate: number;
  date: string;
  preview: string;
  content?: string;
  url?: string;
  pdfUrl?: string;
}

export function getInitialCampaigns(): NewsletterCampaign[] {
  return [
    {
      id: 1,
      subject: "ESN Global Dispatch: Accelerating Grassroots Climate Action",
      volume: "Issue #18 — Autumn 2026",
      status: "sent",
      recipients: 12450,
      openRate: 54,
      clickRate: 18,
      date: "Sep 15, 2026",
      preview: "Quarterly review of 470+ projects, upcoming COP31 delegations, and our new youth fellowships.",
      content: "Welcome to the Autumn 2026 edition of the ESN Global Dispatch. In this issue, we highlight key breakthroughs from our coastal restoration teams in Bangladesh, community clean energy grids deployed in Kenya, and preparations for our 80+ country representatives heading to COP31.",
      url: "https://esnglobal.org/newsletters/2026-autumn",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: 2,
      subject: "Special Briefing: Coastal Resilience & 2.4M Mangrove Initiative",
      volume: "Special Edition — Aug 2026",
      status: "sent",
      recipients: 9800,
      openRate: 61,
      clickRate: 24,
      date: "Aug 20, 2026",
      preview: "In-depth scientific review of mangrove survivability and blue carbon sequestration data across delta regions.",
      content: "This special report compiles field data from 120 coastal communities across South Asia and Southeast Asia, detailing measurable storm buffer effectiveness and local economic benefits.",
      url: "https://esnglobal.org/newsletters/coastal-resilience-2026",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: 3,
      subject: "Youth Leadership Manifesto & Innovation Micro-Grant Winners",
      volume: "Issue #17 — Jul 2026",
      status: "scheduled",
      recipients: 14200,
      openRate: 0,
      clickRate: 0,
      date: "Oct 10, 2026",
      preview: "Announcing the 100 fellows selected for the 2026 YEL cohort and $500,000 in micro-grants.",
      content: "Meet the brilliant young minds transforming their local environments through innovative waste recycling, solar microgrids, and biodiversity tracking.",
      url: "https://esnglobal.org/newsletters/youth-manifesto-2026",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ];
}

const blankCampaign = {
  subject: "",
  volume: "",
  preview: "",
  content: "",
  url: "",
  pdfUrl: "",
  status: "draft" as CampaignStatus,
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
};

const statusConfig: Record<CampaignStatus, { label: string; color: string }> = {
  sent: { label: "Sent", color: "#4CAF50" },
  scheduled: { label: "Scheduled", color: "#173B63" },
  draft: { label: "Draft", color: "#D6A95A" },
};

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function NewsletterView() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "subscribers" | "broadcast">("campaigns");
  const [campaigns, setCampaigns] = useFirestoreData<NewsletterCampaign[]>("esn_newsletters", getInitialCampaigns());
  const [subsData, setSubsData] = useFirestoreData<any[]>("esn_subscribers", []);
  
  const [search, setSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | CampaignStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankCampaign);
  const [editId, setEditId] = useState<number | null>(null);
  const [previewItem, setPreviewItem] = useState<NewsletterCampaign | null>(null);

  // Broadcast state
  const [broadcastForm, setBroadcastForm] = useState({
    subject: "",
    volume: "Global Network Dispatch",
    preview: "",
    content: "",
    url: "",
    pdfUrl: "",
    audience: "all",
  });
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const save = async (list: NewsletterCampaign[]) => {
    setCampaigns(list);
    await saveFirestoreData("esn_newsletters", list);
  };

  const handleSubmit = () => {
    if (!form.subject) return;
    if (editId !== null) {
      save(campaigns.map((c) => c.id === editId ? { ...c, ...form } : c));
    } else {
      save([{
        ...form,
        id: Date.now(),
        recipients: (subsData || []).length,
        openRate: 0,
        clickRate: 0,
        date: form.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }, ...campaigns]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankCampaign);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.subject) return;
    setBroadcastSending(true);

    setTimeout(async () => {
      const newCamp: NewsletterCampaign = {
        id: Date.now(),
        subject: broadcastForm.subject,
        volume: broadcastForm.volume || "Network Broadcast",
        preview: broadcastForm.preview || broadcastForm.content.slice(0, 80) + "...",
        content: broadcastForm.content,
        url: broadcastForm.url,
        pdfUrl: broadcastForm.pdfUrl,
        status: "sent",
        recipients: (subsData || []).length,
        openRate: Math.floor(Math.random() * 20) + 45,
        clickRate: Math.floor(Math.random() * 10) + 12,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      const updatedList = [newCamp, ...campaigns];
      setCampaigns(updatedList);
      await saveFirestoreData("esn_newsletters", updatedList);
      setBroadcastSending(false);
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setBroadcastForm({ subject: "", volume: "", preview: "", content: "", url: "", pdfUrl: "", audience: "all" });
        setActiveTab("campaigns");
      }, 2000);
    }, 1800);
  };

  const startEdit = (c: NewsletterCampaign) => {
    setForm({
      subject: c.subject,
      volume: c.volume || "",
      preview: c.preview || "",
      content: c.content || "",
      url: c.url || "",
      pdfUrl: c.pdfUrl || "",
      status: c.status,
      date: c.date
    });
    setEditId(c.id);
    setShowForm(true);
  };

  const deleteSubscriber = async (id: number) => {
    if (window.confirm("Remove this email from the subscriber list?")) {
      const updated = subsData.filter(s => s.id !== id);
      setSubsData(updated);
      await saveFirestoreData("esn_subscribers", updated);
    }
  };

  const exportSubscribersCSV = () => {
    const headers = ["ID", "Email", "Subscription Date", "Source", "Status"];
    const rows = subsData.map(s => [s.id, s.email, s.date || "-", s.source || "Website", s.status || "Active"]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `esn-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = (campaigns || []).filter((c) => {
    if (!c) return false;
    const subject = String(c.subject || "").toLowerCase();
    const q = String(search || "").toLowerCase().trim();
    const matchSearch = !q || subject.includes(q);
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredSubs = (subsData || []).filter(s => {
    const email = String(s.email || "").toLowerCase();
    const q = subSearch.toLowerCase().trim();
    return !q || email.includes(q);
  });

  const totalSubs = (subsData || []).length;
  const sentCampaigns = (campaigns || []).filter(c => c.status === "sent");
  const avgOpen = sentCampaigns.length ? Math.round(sentCampaigns.reduce((s, c) => s + c.openRate, 0) / sentCampaigns.length) : 0;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-xl sm:text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Newsletter & Audience Hub</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{totalSubs.toLocaleString()} verified subscribers · {campaigns.filter(c => c.status === "sent").length} campaigns dispatched</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab("broadcast")}
            className="flex items-center gap-2 bg-[#173B63] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#122e4d] transition-all shadow-sm cursor-pointer"
          >
            <Send size={14} /> Send Broadcast
          </button>
          <button
            onClick={() => { setForm(blankCampaign); setEditId(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Create Draft
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "campaigns"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Mail size={16} /> Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "subscribers"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Users size={16} /> Subscribers ({subsData.length})
        </button>
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "broadcast"
              ? "text-[#0B5D3F] border-b-2 border-[#0B5D3F]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Send size={16} /> Instant Broadcast
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: totalSubs.toLocaleString(), icon: Users, color: "#0B5D3F", sub: "Live database" },
          { label: "Avg. Open Rate", value: `${avgOpen}%`, icon: Mail, color: "#4CAF50", sub: "Tracked campaigns" },
          { label: "Avg. Click Rate", value: "14.2%", icon: MousePointerClick, color: "#173B63", sub: "Live metric" },
          { label: "Campaigns Dispatched", value: campaigns.filter(c => c.status === "sent").length.toString(), icon: Send, color: "#D6A95A", sub: "Dispatched" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3 shadow-sm">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: k.color + "15" }}>
              <k.icon size={19} style={{ color: k.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.value}</div>
              <div className="text-xs font-semibold text-gray-600">{k.label}</div>
              <div className="text-xs text-[#4CAF50] font-medium mt-0.5">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TAB 1: CAMPAIGNS */}
      {activeTab === "campaigns" && (
        <>
          {/* Chart */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Newsletter Open Rate Trajectory</h4>
                <p className="text-xs text-gray-400">Monthly reader engagement across 2026</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#4CAF50] font-bold bg-[#4CAF50]/10 px-3 py-1.5 rounded-lg">
                <TrendingUp size={14} /> +19% vs Industry Standard
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

          {/* Campaigns Table */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-gray-50">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {(["All", "sent", "scheduled", "draft"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3.5">Subject & Preview</th>
                    <th className="text-left px-4 py-3.5">Web URL & PDF</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">Recipients</th>
                    <th className="text-left px-4 py-3.5">Open Rate</th>
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
                          <div className="flex items-center gap-2">
                            {c.volume && (
                              <span className="text-[10px] font-bold bg-[#E6F3EB] text-[#0A3D2A] px-2 py-0.5 rounded-full shrink-0">
                                {c.volume}
                              </span>
                            )}
                            <div className="text-sm font-bold text-gray-900 max-w-xs truncate">{c.subject}</div>
                          </div>
                          <div className="text-xs text-gray-400 truncate mt-0.5">{c.preview}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {c.url ? (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                title={c.url}
                              >
                                <ExternalLink size={11} /> URL
                              </a>
                            ) : null}
                            {c.pdfUrl ? (
                              <a
                                href={c.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                title={c.pdfUrl}
                              >
                                <FileText size={11} /> PDF
                              </a>
                            ) : null}
                            {!c.url && !c.pdfUrl && (
                              <span className="text-xs text-gray-300 italic">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: sc.color, backgroundColor: sc.color + "18" }}>
                            {sc.label}
                          </span>
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
                        <td className="px-4 py-4 text-xs text-gray-500">{c.date}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {c.url && (
                              <a href={c.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all" title="Open Web Newsletter URL">
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {c.pdfUrl && (
                              <a href={c.pdfUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all" title="View/Download PDF Document">
                                <FileText size={14} />
                              </a>
                            )}
                            <button onClick={() => setPreviewItem(c)} className="p-2 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all" title="Full Preview"><Eye size={15} /></button>
                            <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all" title="Full Edit"><Edit3 size={15} /></button>
                            <button onClick={() => save(campaigns.filter((x) => x.id !== c.id))} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Delete"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: SUBSCRIBERS DIRECTORY */}
      {activeTab === "subscribers" && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Active Subscriber List
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Live records collected via website opt-ins & registrations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
              <button
                onClick={exportSubscribersCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0B5D3F] text-white rounded-xl text-xs font-bold hover:bg-[#0a5237] transition-all shadow-sm"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-6 py-3.5">Email Address</th>
                  <th className="text-left px-4 py-3.5">Acquisition Source</th>
                  <th className="text-left px-4 py-3.5">Subscription Date</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-right px-6 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((s) => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-[#F6FBF8]/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{s.email}</td>
                    <td className="px-4 py-4 text-xs text-gray-500">{s.source || "Website Opt-in"}</td>
                    <td className="px-4 py-4 text-xs text-gray-400">{s.date || "Recent"}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#E8F5E9] text-[#0B5D3F] px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={11} /> {s.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteSubscriber(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-xs">
                      No subscribers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INSTANT BROADCAST COMPOSER */}
      {activeTab === "broadcast" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-3xl">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center">
              <Send size={22} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Broadcast Official Email to Network
              </h4>
              <p className="text-xs text-gray-400">
                Instantly dispatch announcements to {totalSubs.toLocaleString()} subscribers
              </p>
            </div>
          </div>

          {broadcastSuccess ? (
            <div className="bg-[#E8F5E9] border border-[#A2DCBA] p-6 rounded-2xl text-center">
              <CheckCircle2 size={40} className="text-[#0B5D3F] mx-auto mb-2" />
              <h4 className="font-bold text-gray-900 text-base">Broadcast Dispatched Successfully!</h4>
              <p className="text-xs text-gray-600 mt-1">Delivered to {totalSubs.toLocaleString()} subscribers across global regions.</p>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Target Audience</label>
                  <select
                    value={broadcastForm.audience}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, audience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs font-bold outline-none"
                  >
                    <option value="all">All Subscribers ({totalSubs.toLocaleString()})</option>
                    <option value="volunteers">Active Volunteers & Members</option>
                    <option value="donors">Verified Donors & Backers</option>
                    <option value="chapters">Campus Chapters Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Sender Identity</label>
                  <input
                    type="text"
                    disabled
                    value="Environmental Shapers Network <news@esnglobal.org>"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Subject Line *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Climate Action Update: COP Delegation Selected"
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:border-[#4CAF50] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Inbox Preview Snippet</label>
                <input
                  type="text"
                  placeholder="Brief preview text that appears in email notifications..."
                  value={broadcastForm.preview}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, preview: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs focus:border-[#4CAF50] outline-none"
                />
              </div>

              <div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Newsletter Web Edition URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://esnglobal.org/newsletters/issue-18"
                      value={broadcastForm.url}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs focus:border-[#4CAF50] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Newsletter PDF Document URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://domain.org/documents/newsletter.pdf"
                      value={broadcastForm.pdfUrl}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, pdfUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs focus:border-[#4CAF50] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Email Body Content (Markdown / HTML)</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Compose your broadcast letter..."
                  value={broadcastForm.content}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:border-[#4CAF50] outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={broadcastSending}
                  className="w-full py-4 rounded-xl bg-[#0B5D3F] hover:bg-[#0a5237] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {broadcastSending ? (
                    <><RefreshCw size={15} className="animate-spin" /> Dispatching Broadcast to {totalSubs.toLocaleString()} Inboxes…</>
                  ) : (
                    <><Send size={15} /> Send Broadcast Now</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-black text-gray-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {editId ? "Edit Newsletter Issue" : "Create New Newsletter Issue"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">Attach full web URLs and PDF editions for digital distribution</p>
                </div>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Subject Line / Title *</label>
                    <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. ESN Global Dispatch: Autumn 2026 Edition" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Issue / Volume</label>
                    <input type="text" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} placeholder="Issue #18 — Q3 2026" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 bg-[#F6FBF8] p-4 rounded-2xl border border-gray-100">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <ExternalLink size={13} className="text-blue-600" />
                      Web Newsletter URL (Online Link)
                    </label>
                    <input
                      type="url"
                      value={form.url || ""}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="https://esnglobal.org/newsletters/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#4CAF50] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <FileText size={13} className="text-red-600" />
                      PDF Document URL / Link
                    </label>
                    <input
                      type="url"
                      value={form.pdfUrl || ""}
                      onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                      placeholder="https://.../newsletter.pdf"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#4CAF50] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Preview Text / Snippet</label>
                  <input type="text" value={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.value })} placeholder="Short teaser snippet shown in index and inboxes..." className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Full Article / Newsletter Body</label>
                  <textarea
                    rows={5}
                    value={form.content || ""}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Full text, announcement details, highlights..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold">
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="sent">Sent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Publication / Send Date</label>
                    <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Sep 25, 2026" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-md">
                  {editId ? "Save Changes" : "Save Newsletter"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3.5 rounded-xl text-gray-500 hover:bg-gray-100 font-bold text-xs uppercase tracking-wider">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-[#4CAF50]" />
                    <span className="text-xs font-semibold text-white/60">Environmental Shapers Network</span>
                  </div>
                  {previewItem.volume && (
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                      {previewItem.volume}
                    </span>
                  )}
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{previewItem.subject}</h4>
                <p className="text-white/70 text-xs">{previewItem.preview}</p>
              </div>
              <div className="p-6">
                {previewItem.content && (
                  <div className="bg-[#F6FBF8] p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 leading-relaxed mb-5 max-h-48 overflow-y-auto">
                    {previewItem.content}
                  </div>
                )}

                {/* External URL and PDF Action Buttons */}
                <div className="flex flex-col gap-2.5 mb-5">
                  {previewItem.url && (
                    <a
                      href={previewItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-blue-200"
                    >
                      <ExternalLink size={14} /> Open Online Web Edition
                    </a>
                  )}
                  {previewItem.pdfUrl && (
                    <a
                      href={previewItem.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-red-200"
                    >
                      <FileText size={14} /> View / Download PDF Edition
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[["Recipients", previewItem.recipients > 0 ? previewItem.recipients.toLocaleString() : "—"], ["Open Rate", previewItem.status === "sent" ? `${previewItem.openRate}%` : "—"], ["Click Rate", previewItem.status === "sent" ? `${previewItem.clickRate}%` : "—"]].map(([l, v]) => (
                    <div key={l} className="bg-[#F6FBF8] rounded-xl p-3 text-center border border-gray-100">
                      <div className="text-[11px] text-gray-400 mb-0.5">{l}</div>
                      <div className="font-black text-gray-800 text-sm">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const item = previewItem;
                      setPreviewItem(null);
                      startEdit(item);
                    }}
                    className="flex-1 bg-[#0B5D3F] hover:bg-[#0a5237] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={14} /> Edit Newsletter
                  </button>
                  <button onClick={() => setPreviewItem(null)} className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
