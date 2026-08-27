import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, TrendingUp, TrendingDown, Download, Filter, Search,
  Eye, RefreshCw, CreditCard, ChevronDown, CheckCircle2,
  Clock, XCircle, DollarSign, Users, Calendar, ArrowUpRight,
  TreePine, Droplets, Leaf, Globe2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function getInitialDonations() {
  return [];
}

function exportToCSV(donations: any[]) {
  const headers = ["Receipt", "Donor", "Email", "Amount", "Project", "Method", "Date", "Status", "Recurring"];
  const rows = (donations || []).map((d: any) =>
    [
      d?.receipt || "—",
      d?.donor || d?.name || "Anonymous",
      d?.email || "—",
      `$${d?.amount || 0}`,
      d?.project || "General Donation",
      d?.method || "—",
      d?.date || "—",
      d?.status || "Completed",
      d?.recurring ? "Yes" : "No"
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `esn_donations_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadReceipt(donation: any) {
  if (!donation) return;
  const lines = [
    "====================================",
    "  ENVIRONMENTAL SHAPERS NETWORK",
    "       DONATION RECEIPT",
    "====================================",
    "",
    `Receipt No:    ${donation.receipt || "—"}`,
    `Date:          ${donation.date || "—"}`,
    "",
    "------------------------------------",
    "DONOR INFORMATION",
    "------------------------------------",
    `Name:          ${donation.donor || donation.name || "Anonymous"}`,
    `Email:         ${donation.email || "—"}`,
    "",
    "------------------------------------",
    "DONATION DETAILS",
    "------------------------------------",
    `Amount:        $${donation.amount || 0}`,
    `Project:       ${donation.project || "General Donation"}`,
    `Payment:       ${donation.method || "—"}`,
    `Type:          ${donation.recurring ? "Monthly Recurring" : "One-Time"}`,
    `Status:        ${String(donation.status || "Completed").toUpperCase()}`,
    "",
    "------------------------------------",
    "Thank you for your generous support!",
    "Your contribution makes a difference.",
    "",
    "Environmental Shapers Network",
    "info@esnglobal.org | esnglobal.org",
    "====================================",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${donation.receipt || "receipt"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<any> }> = {
  approved: { label: "Completed", color: "#4CAF50", bg: "#4CAF50/10", icon: CheckCircle2 },
  completed: { label: "Completed", color: "#4CAF50", bg: "#4CAF50/10", icon: CheckCircle2 },
  pending: { label: "Pending", color: "#D6A95A", bg: "#D6A95A/15", icon: Clock },
  rejected: { label: "Failed", color: "#ef4444", bg: "#ef4444/10", icon: XCircle },
  failed: { label: "Failed", color: "#ef4444", bg: "#ef4444/10", icon: XCircle },
};

function getStatusConfig(status?: string) {
  const normalized = String(status || "completed").toLowerCase();
  return statusConfig[normalized] || statusConfig.completed;
}

export function DonationsView() {
  const [donations, setDonations, loading] = useFirestoreData<any[]>("esn_donations", getInitialDonations());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  const refresh = () => setDonations(getInitialDonations());

  const updateStatus = async (id: number, newStatus: string) => {
    const updated = (donations || []).map((d: any) => (d && d.id === id ? { ...d, status: newStatus } : d));
    setDonations(updated);
    await saveFirestoreData("esn_donations", updated);
  };

  const safeDonations = Array.isArray(donations) ? donations : [];

  const filtered = safeDonations.filter((d: any) => {
    if (!d) return false;
    const donor = String(d.donor || d.name || "Anonymous").toLowerCase();
    const project = String(d.project || "General Donation").toLowerCase();
    const receipt = String(d.receipt || "").toLowerCase();
    const s = String(search || "").toLowerCase().trim();

    const matchSearch = !s || donor.includes(s) || project.includes(s) || receipt.includes(s);
    const dStatus = String(d.status || "completed").toLowerCase();
    const normalizedFilter = filterStatus.toLowerCase();
    
    const matchStatus =
      filterStatus === "All" ||
      dStatus === normalizedFilter ||
      (normalizedFilter === "completed" && (dStatus === "approved" || dStatus === "completed")) ||
      (normalizedFilter === "failed" && (dStatus === "rejected" || dStatus === "failed"));

    return matchSearch && matchStatus;
  });

  const totalRaised = safeDonations
    .filter((d: any) => {
      const st = String(d?.status || "").toLowerCase();
      return st === "approved" || st === "completed";
    })
    .reduce((s: number, d: any) => s + (Number(d?.amount) || 0), 0);

  const pendingCount = safeDonations.filter((d: any) => String(d?.status || "").toLowerCase() === "pending").length;
  const approvedCount = safeDonations.filter((d: any) => {
    const st = String(d?.status || "").toLowerCase();
    return st === "approved" || st === "completed";
  }).length;
  const avgDonation = approvedCount > 0 ? Math.round(totalRaised / approvedCount) : 0;
  const recurringCount = safeDonations.filter((d: any) => Boolean(d?.recurring)).length;

  const currentMonthIdx = new Date().getMonth();
  const currentMonthName = new Date().toLocaleDateString("en-US", { month: "short" });
  const thisMonthTotal = safeDonations
    .filter((d: any) => {
      if (!d?.date) return false;
      const dt = new Date(d.date);
      return !isNaN(dt.getTime()) && dt.getMonth() === currentMonthIdx;
    })
    .reduce((s: number, d: any) => s + (Number(d?.amount) || 0), 0);

  const monthlyData = [
    { month: "Jan", amount: 0, donors: 0 },
    { month: "Feb", amount: 0, donors: 0 },
    { month: "Mar", amount: 0, donors: 0 },
    { month: "Apr", amount: 0, donors: 0 },
    { month: "May", amount: 0, donors: 0 },
    { month: "Jun", amount: 0, donors: 0 },
    { month: "Jul", amount: 0, donors: 0 },
    { month: "Aug", amount: 0, donors: 0 },
  ].map((item, idx) => {
    const matchDonations = safeDonations.filter((d: any) => {
      if (!d?.date) return false;
      const dt = new Date(d.date);
      return !isNaN(dt.getTime()) && dt.getMonth() === idx;
    });
    return {
      month: item.month,
      amount: matchDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
      donors: matchDonations.length,
    };
  });

  const channelData = (() => {
    const methods: Record<string, number> = {};
    safeDonations.forEach((d: any) => {
      const m = d?.method || "Card";
      methods[m] = (methods[m] || 0) + 1;
    });
    const total = safeDonations.length || 1;
    const colors: Record<string, string> = {
      Card: "#0B5D3F",
      PayPal: "#4CAF50",
      Transfer: "#173B63",
      Mobile: "#D6A95A",
      Crypto: "#5B8DB8",
    };
    const entries = Object.entries(methods);
    if (entries.length === 0) {
      return [{ name: "No Donations", value: 100, color: "#E5E7EB" }];
    }
    return entries.map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[name] || "#0B5D3F",
    }));
  })();

  return (
    <div className="flex flex-col gap-6 sm:gap-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-xl sm:text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Donations Manager</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Track, manage and export all donation transactions</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={refresh}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 border border-gray-200 bg-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => exportToCSV(safeDonations)}
            className="flex items-center gap-2 text-xs sm:text-sm text-white bg-[#0B5D3F] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-[#0a5237] transition-all font-semibold cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, sub: "All time", change: `${approvedCount} completed`, up: true, icon: DollarSign, color: "#0B5D3F" },
          { label: "This Month", value: `$${thisMonthTotal.toLocaleString()}`, sub: `${currentMonthName} 2026`, change: "+100%", up: true, icon: TrendingUp, color: "#4CAF50" },
          { label: "Avg. Donation", value: `$${avgDonation}`, sub: "Per transaction", change: "Live", up: true, icon: Heart, color: "#173B63" },
          { label: "Recurring Donors", value: recurringCount.toString(), sub: `${pendingCount} pending`, change: `${safeDonations.length} total`, up: true, icon: Users, color: "#D6A95A" },
        ].map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/80 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: k.color + "15" }}>
                <k.icon size={20} style={{ color: k.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${k.up ? "bg-[#4CAF50]/10 text-[#4CAF50]" : "bg-red-50 text-red-500"}`}>
                {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{k.change}
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.value}</div>
            <div className="text-xs text-gray-400">{k.label} · {k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-bold text-gray-900">Revenue Trend</h4>
              <p className="text-xs text-gray-400">Monthly donations & donor count (2026)</p>
            </div>
            <button className="text-xs text-[#0B5D3F] font-semibold flex items-center gap-1 hover:underline">
              Full Report <ArrowUpRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="donationsAmountGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5D3F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0B5D3F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="donationsDonorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number, name: string) => [name === "amount" ? `$${v.toLocaleString()}` : v, name === "amount" ? "Revenue" : "Donors"]} />
              <Area type="monotone" dataKey="amount" stroke="#0B5D3F" strokeWidth={2.5} fill="url(#donationsAmountGrad)" />
              <Area type="monotone" dataKey="donors" stroke="#4CAF50" strokeWidth={1.5} fill="url(#donationsDonorsGrad)" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-1">By Payment Channel</h4>
          <p className="text-xs text-gray-400 mb-4">Transaction share breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={2}>
                {channelData.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {channelData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-bold text-gray-700">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor, project, receipt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "Completed", "Pending", "Failed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"}`}
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
                <th className="text-left px-5 py-3.5">Donor</th>
                <th className="text-left px-4 py-3.5">Project</th>
                <th className="text-left px-4 py-3.5">Amount</th>
                <th className="text-left px-4 py-3.5">Method</th>
                <th className="text-left px-4 py-3.5">Date</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">Recurring</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any) => {
                const sc = getStatusConfig(d?.status);
                const donorName = d?.donor || d?.name || "Anonymous";
                const donorEmail = d?.email || "—";
                const projectTitle = d?.project || "General Donation";
                const amountVal = Number(d?.amount) || 0;
                const methodVal = d?.method || "—";
                const dateVal = d?.date || "—";
                const receiptVal = d?.receipt || "—";

                return (
                  <motion.tr
                    key={d?.id || Math.random()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-50 hover:bg-[#F6FBF8]/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedDonation(d)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4CAF50]/20 to-[#0B5D3F]/20 flex items-center justify-center text-xs font-black text-[#0B5D3F]">
                          {donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{donorName}</div>
                          <div className="text-xs text-gray-400">{donorEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 max-w-[140px]">
                      <div className="truncate">{projectTitle}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-black text-[#0B5D3F]">${amountVal.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CreditCard size={12} className="text-gray-400" />
                        {methodVal}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{dateVal}</td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: sc.color, backgroundColor: sc.color + "18" }}
                      >
                        <sc.icon size={11} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {d?.recurring ? (
                        <span className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] font-semibold px-2.5 py-1 rounded-full">Monthly</span>
                      ) : (
                        <span className="text-xs text-gray-400">One-time</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs font-mono text-gray-400 mr-1">{receiptVal}</span>
                        {String(d?.status || "").toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(d.id, "completed"); }}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(d.id, "failed"); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDonation(d); }}
                          className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} of {safeDonations.length} transactions shown</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === 1 ? "bg-[#0B5D3F] text-white" : "text-gray-400 hover:bg-gray-100"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDonation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Donation Receipt</h4>
                <button onClick={() => setSelectedDonation(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all text-gray-500">
                  ×
                </button>
              </div>
              <div className="bg-[#F6FBF8] rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] flex items-center justify-center text-white text-xl font-black">
                    {String(selectedDonation.donor || selectedDonation.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{selectedDonation.donor || selectedDonation.name || "Anonymous"}</div>
                    <div className="text-sm text-gray-400">{selectedDonation.email || "—"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ["Receipt No.", selectedDonation.receipt || "—"],
                    ["Amount", `$${selectedDonation.amount || 0}`],
                    ["Project", selectedDonation.project || "General Donation"],
                    ["Payment", selectedDonation.method || "—"],
                    ["Date", selectedDonation.date || "—"],
                    ["Type", selectedDonation.recurring ? "Monthly Recurring" : "One-Time"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                      <div className="font-semibold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              {String(selectedDonation.status || "").toLowerCase() === "pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { updateStatus(selectedDonation.id, "completed"); setSelectedDonation(null); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4CAF50] text-white py-3.5 rounded-xl font-semibold hover:bg-green-600 transition-all"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    onClick={() => { updateStatus(selectedDonation.id, "failed"); setSelectedDonation(null); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-xl font-semibold hover:bg-red-600 transition-all"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => downloadReceipt(selectedDonation)}
                  className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3.5 rounded-xl font-semibold hover:bg-[#0a5237] transition-all"
                >
                  <Download size={16} /> Download Receipt
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
