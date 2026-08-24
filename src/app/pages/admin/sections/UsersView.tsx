import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Plus, Search, Edit3, Trash2, X, AlertTriangle,
  Mail, Globe2, Shield, UserCheck, UserX, Download, Filter
} from "lucide-react";

interface AdminUserEntry {
  id: number;
  name: string;
  email: string;
  role: string;
  country: string;
  status: "Active" | "Inactive" | "Suspended";
  joinDate: string;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function getInitialUsers(): AdminUserEntry[] {
  return [
    { id: 1, name: "Rizwan Ahmed", email: "rizwan@esnglobal.org", role: "Super Admin", country: "Bangladesh", status: "Active", joinDate: "Jan 2023" },
    { id: 2, name: "Priya Sharma", email: "priya@esnglobal.org", role: "Researcher", country: "India", status: "Active", joinDate: "Mar 2023" },
    { id: 3, name: "Carlos Rodriguez", email: "carlos@esnglobal.org", role: "Regional Manager", country: "Colombia", status: "Active", joinDate: "Jun 2023" },
    { id: 4, name: "Amara Osei", email: "amara@esnglobal.org", role: "Volunteer Manager", country: "Ghana", status: "Active", joinDate: "Sep 2023" },
    { id: 5, name: "Sarah Chen", email: "sarah@example.com", role: "Donor", country: "Singapore", status: "Active", joinDate: "Nov 2023" },
    { id: 6, name: "Kenji Tanaka", email: "kenji@esnglobal.org", role: "Content Editor", country: "Japan", status: "Inactive", joinDate: "Feb 2024" },
    { id: 7, name: "Fatima Al-Hassan", email: "fatima@esnglobal.org", role: "Program Officer", country: "Nigeria", status: "Active", joinDate: "Apr 2024" },
  ];
}

const roleColors: Record<string, string> = {
  "Super Admin": "#0B5D3F",
  "Researcher": "#173B63",
  "Regional Manager": "#4CAF50",
  "Volunteer Manager": "#D6A95A",
  "Content Editor": "#5B8DB8",
  "Program Officer": "#8B5CF6",
  "Donor": "#6b7280",
};

const statusConfig = {
  Active: { color: "#4CAF50", label: "Active" },
  Inactive: { color: "#D6A95A", label: "Inactive" },
  Suspended: { color: "#ef4444", label: "Suspended" },
};

const blankUser: Omit<AdminUserEntry, "id"> = {
  name: "", email: "", role: "Volunteer Manager", country: "", status: "Active", joinDate: "",
};

function downloadCSV(data: AdminUserEntry[]) {
  const headers = ["Name", "Email", "Role", "Country", "Status", "Join Date"];
  const rows = data.map(u => [u.name, u.email, u.role, u.country, u.status, u.joinDate].map(v => `"${v}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `esn_users_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function UsersView() {
  const [users, setUsers, loading] = useFirestoreData<AdminUserEntry[]>("esn_users_admin", getInitialUsers());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | AdminUserEntry["status"]>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<AdminUserEntry, "id">>(blankUser);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const save = async (list: AdminUserEntry[]) => {
    setUsers(list);
    await saveFirestoreData("esn_users_admin", list);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    if (editId !== null) {
      save(users.map((u) => (u.id === editId ? { ...form, id: editId } : u)));
    } else {
      save([{ ...form, id: Date.now() }, ...users]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(blankUser);
  };

  const startEdit = (u: AdminUserEntry) => {
    const { id, ...rest } = u;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
  };

  const toggleStatus = (id: number) => {
    save(users.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  const executeDelete = () => {
    if (deleteConfirmId !== null) {
      save(users.filter((u) => u.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const filtered = (users || []).filter((u) => {
    if (!u) return false;
    const q = String(search || "").toLowerCase().trim();
    const name = String(u.name || "").toLowerCase();
    const email = String(u.email || "").toLowerCase();
    const role = String(u.role || "").toLowerCase();
    const country = String(u.country || "").toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q) || role.includes(q) || country.includes(q);
    const matchStatus = filterStatus === "All" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Members & Users</h3>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} users · {activeCount} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCSV(users)}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => { setForm(blankUser); setEditId(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "#0B5D3F" },
          { label: "Active", value: activeCount, icon: UserCheck, color: "#4CAF50" },
          { label: "Inactive", value: users.filter(u => u.status === "Inactive").length, icon: UserX, color: "#D6A95A" },
          { label: "Suspended", value: users.filter(u => u.status === "Suspended").length, icon: Shield, color: "#ef4444" },
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Active", "Inactive", "Suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? "bg-[#0B5D3F] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-[#0B5D3F]/10"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">User</th>
                <th className="text-left px-4 py-3.5">Email</th>
                <th className="text-left px-4 py-3.5">Role</th>
                <th className="text-left px-4 py-3.5">Country</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">Joined</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const sc = statusConfig[u.status];
                const roleColor = roleColors[u.role] || "#6b7280";
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-50 hover:bg-[#F6FBF8]/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail size={11} className="text-gray-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ color: roleColor, backgroundColor: roleColor + "18" }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Globe2 size={11} className="text-gray-400" />
                        {u.country}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="text-xs font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80"
                        style={{ color: sc.color, backgroundColor: sc.color + "18" }}
                        title="Click to toggle Active/Inactive"
                      >
                        {sc.label}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">{u.joinDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startEdit(u)}
                          className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-300">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No users match your filters</p>
          </div>
        )}
        <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} of {users.length} users shown</p>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {editId ? "Edit User" : "Add New User"}
                </h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {([
                  { label: "Full Name *", key: "name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address *", key: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Country", key: "country", type: "text", placeholder: "Bangladesh" },
                  { label: "Join Date", key: "joinDate", type: "text", placeholder: "Jan 2024" },
                ] as const).map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
                    >
                      {["Super Admin", "Regional Manager", "Program Officer", "Content Editor", "Researcher", "Volunteer Manager", "Donor", "Member"].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as AdminUserEntry["status"] })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
                    >
                      {["Active", "Inactive", "Suspended"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#0B5D3F] text-white py-3.5 rounded-xl font-semibold hover:bg-[#0a5237] transition-all"
                >
                  {editId ? "Save Changes" : "Create User"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h4 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete User?</h4>
              <p className="text-sm text-gray-500 mb-6">
                Permanently delete <strong>{users.find(u => u.id === deleteConfirmId)?.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={executeDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
