import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Plus, Search, MapPin, Users, Clock, Edit3,
  Trash2, Eye, Video, Globe2, CheckCircle2, AlertCircle,
  ChevronRight, QrCode, Download, X, Leaf, AlertTriangle
} from "lucide-react";

type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface ESNEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  mode: "In-Person" | "Virtual" | "Hybrid";
  capacity: number;
  registered: number;
  status: EventStatus;
  description: string;
  speaker: string;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

function getInitialEvents(): ESNEvent[] {
  return [
    { id: 1, title: "Global Youth Climate Summit 2026", type: "Summit", date: "Aug 15, 2026", time: "09:00 AM", location: "Dhaka, Bangladesh", mode: "Hybrid", capacity: 500, registered: 423, status: "upcoming", description: "Annual gathering of youth climate leaders from 80+ countries.", speaker: "Dr. Priya Sharma" },
    { id: 2, title: "Forest Restoration Volunteer Day", type: "Field", date: "Aug 8, 2026", time: "07:00 AM", location: "Sundarbans, Bangladesh", mode: "In-Person", capacity: 200, registered: 187, status: "upcoming", description: "Community mangrove planting event at the Sundarbans delta.", speaker: "Rizwan Ahmed" },
    { id: 3, title: "Climate Policy Webinar Series #12", type: "Webinar", date: "Jul 30, 2026", time: "03:00 PM", location: "Online", mode: "Virtual", capacity: 2000, registered: 1847, status: "ongoing", description: "Deep-dive into UNFCCC COP31 outcomes and what they mean for NGOs.", speaker: "Carlos Rodriguez" },
    { id: 4, title: "ESN Annual Gala & Awards Night", type: "Gala", date: "Sep 20, 2026", time: "06:00 PM", location: "Geneva, Switzerland", mode: "In-Person", capacity: 150, registered: 112, status: "upcoming", description: "Celebrating environmental champions and impact milestones.", speaker: "Board of Directors" },
    { id: 5, title: "Biodiversity Hackathon 2026", type: "Hackathon", date: "Jul 5, 2026", time: "10:00 AM", location: "Online", mode: "Virtual", capacity: 800, registered: 800, status: "completed", description: "48-hour innovation sprint for biodiversity conservation tech.", speaker: "Multiple Judges" },
    { id: 6, title: "Water Security Field Training", type: "Training", date: "Jun 20, 2026", time: "08:00 AM", location: "Nairobi, Kenya", mode: "In-Person", capacity: 80, registered: 78, status: "completed", description: "Hands-on training for watershed management practitioners.", speaker: "Amara Osei" },
  ];
}

const statusConfig: Record<EventStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: "Upcoming", color: "#173B63", bg: "#173B63" },
  ongoing: { label: "Live Now", color: "#4CAF50", bg: "#4CAF50" },
  completed: { label: "Completed", color: "#6b7280", bg: "#6b7280" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#ef4444" },
};

const modeIcon = { "In-Person": MapPin, "Virtual": Video, "Hybrid": Globe2 };

const blankEvent: Omit<ESNEvent, "id"> = {
  title: "", type: "Webinar", date: "", time: "", location: "", mode: "Virtual",
  capacity: 100, registered: 0, status: "upcoming", description: "", speaker: "",
};

function exportRegistrations(ev: ESNEvent) {
  const rows = [
    ["#", "Name", "Email", "Status", "Registered Date"],
    ...Array.from({ length: Math.min(ev.registered, 8) }, (_, i) => [
      String(i + 1),
      `Registrant ${i + 1}`,
      `registrant${i + 1}@example.com`,
      "Confirmed",
      ev.date,
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations_${ev.title.replace(/\s+/g, "_").toLowerCase()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function QRGrid({ size = 120 }: { size?: number }) {
  const cells = 10;
  const seed = Math.floor(size / 10);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} style={{ imageRendering: "pixelated" }}>
      {Array.from({ length: cells }, (_, row) =>
        Array.from({ length: cells }, (_, col) => {
          const edge = row === 0 || row === cells - 1 || col === 0 || col === cells - 1;
          const corner = (row < 3 && col < 3) || (row < 3 && col > cells - 4) || (row > cells - 4 && col < 3);
          const filled = corner || edge || ((row * 3 + col * 7 + seed) % 4 < 2);
          return filled ? <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill="#000" /> : null;
        })
      )}
    </svg>
  );
}

export function EventsView() {
  const [events, setEvents, loading] = useFirestoreData<ESNEvent[]>("esn_events", getInitialEvents());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | EventStatus>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<ESNEvent, "id">>(blankEvent);
  const [editId, setEditId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ESNEvent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<ESNEvent | null>(null);

  const save = async (list: ESNEvent[]) => {
    setEvents(list);
    await saveFirestoreData("esn_events", list);
  };

  const handleSubmit = () => {
    if (!form.title || !form.date) return;
    if (editId !== null) {
      save(events.map((e) => e.id === editId ? { ...form, id: editId } : e));
    } else {
      save([{ ...form, id: Date.now() }, ...events]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankEvent);
  };

  const startEdit = (ev: ESNEvent) => {
    const { id, ...rest } = ev;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  };

  const confirmDelete = (id: number) => setDeleteConfirmId(id);
  const doDelete = () => {
    if (deleteConfirmId === null) return;
    save(events.filter((e) => e.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setDetail(null);
  };

  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    upcoming: events.filter(e => e.status === "upcoming").length,
    ongoing: events.filter(e => e.status === "ongoing").length,
    completed: events.filter(e => e.status === "completed").length,
  };

  const eventToDelete = events.find(e => e.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Events Manager</h3>
          <p className="text-sm text-gray-400 mt-0.5">{events.length} events total · {counts.upcoming} upcoming · {counts.ongoing} live</p>
        </div>
        <button
          onClick={() => { setForm(blankEvent); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: events.length, icon: Calendar, color: "#0B5D3F" },
          { label: "Upcoming", value: counts.upcoming, icon: Clock, color: "#173B63" },
          { label: "Live Now", value: counts.ongoing, icon: CheckCircle2, color: "#4CAF50" },
          { label: "Total Registered", value: events.reduce((s, e) => s + e.registered, 0).toLocaleString(), icon: Users, color: "#D6A95A" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
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

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Event" : "Create New Event"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Event Title *", key: "title", type: "text", placeholder: "Summit title..." },
                  { label: "Speaker / Host", key: "speaker", type: "text", placeholder: "Speaker name" },
                  { label: "Date *", key: "date", type: "text", placeholder: "Aug 15, 2026" },
                  { label: "Time", key: "time", type: "text", placeholder: "09:00 AM" },
                  { label: "Location", key: "location", type: "text", placeholder: "City, Country or Online" },
                  { label: "Capacity", key: "capacity", type: "number", placeholder: "100" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Summit", "Webinar", "Field", "Gala", "Hackathon", "Training", "Workshop", "Conference"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Virtual", "In-Person", "Hybrid"].map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["upcoming", "ongoing", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" placeholder="Brief event description..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
                  {editId ? "Save Changes" : "Create Event"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all font-semibold">Cancel</button>
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
              <h4 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Event?</h4>
              <p className="text-sm text-gray-500 mb-1">This will permanently delete:</p>
              <p className="text-sm font-bold text-gray-800 mb-6">"{eventToDelete?.title}"</p>
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
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>QR Attendance Code</h4>
                <button onClick={() => setShowQR(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={15} /></button>
              </div>
              <div className="flex justify-center mb-4 p-6 bg-[#F6FBF8] rounded-2xl">
                <QRGrid size={160} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{showQR.title}</p>
              <p className="text-xs text-gray-400 mb-5">{showQR.date} · {showQR.location}</p>
              <p className="text-xs text-gray-400 bg-[#F6FBF8] rounded-xl px-4 py-2 font-mono">
                https://esnglobal.org/attend/{showQR.id}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 p-5 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", "upcoming", "ongoing", "completed", "cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
        <div className="divide-y divide-gray-50">
          {filtered.map((ev) => {
            const sc = statusConfig[ev.status];
            const ModeIcon = modeIcon[ev.mode];
            const fillPct = Math.round((ev.registered / ev.capacity) * 100);
            return (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-5 p-5 hover:bg-[#F6FBF8]/50 transition-colors">
                <div className="w-16 shrink-0 text-center bg-[#F6FBF8] rounded-2xl py-3 border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase">{ev.date.split(",")[0].split(" ")[0]}</div>
                  <div className="text-2xl font-black text-[#0B5D3F]">{ev.date.split(",")[0].split(" ")[1]}</div>
                  <div className="text-xs text-gray-400">{ev.date.split(",")[1]?.trim()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg }}>{sc.label}</span>
                    <span className="text-xs text-gray-400 bg-[#F6FBF8] px-2.5 py-1 rounded-full border border-gray-100">{ev.type}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <ModeIcon size={11} />{ev.mode}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ev.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={11} />{ev.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{ev.registered}/{ev.capacity} registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[180px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4CAF50] rounded-full transition-all" style={{ width: `${fillPct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{fillPct}% full</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setDetail(ev)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="View Details">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => startEdit(ev)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all" title="Edit">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => confirmDelete(ev.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-300">
              <Calendar size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No events match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={() => setDetail(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Event Details</h4>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><X size={16} /></button>
              </div>
              <div className="p-6 flex-1">
                <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-2xl p-6 text-white mb-6">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">{detail.type}</span>
                  <h3 className="text-white mb-1 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{detail.title}</h3>
                  <p className="text-white/60 text-sm">{detail.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    ["Date", detail.date], ["Time", detail.time],
                    ["Mode", detail.mode], ["Location", detail.location],
                    ["Speaker", detail.speaker], ["Capacity", `${detail.registered}/${detail.capacity}`],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-[#F6FBF8] rounded-xl p-3">
                      <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                      <div className="text-sm font-semibold text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setShowQR(detail); }}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
                  >
                    <QrCode size={16} /> Generate QR Attendance
                  </button>
                  <button
                    onClick={() => exportRegistrations(detail)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    <Download size={16} /> Export Registrations
                  </button>
                  <button
                    onClick={() => { setDetail(null); confirmDelete(detail.id); }}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} /> Delete Event
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
