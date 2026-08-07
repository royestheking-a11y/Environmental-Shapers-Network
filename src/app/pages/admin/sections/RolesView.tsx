import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Plus, Edit3, Trash2, Check, X, Users,
  Lock, Unlock, Eye, Settings, FileText, Heart,
  Globe2, Megaphone, Calendar, Image, Mail, Database,
  ChevronDown, ChevronUp, UserCheck
} from "lucide-react";

const allPermissions = [
  { group: "Content", items: ["Create Content", "Edit Content", "Delete Content", "Publish Content", "View Analytics"] },
  { group: "Projects", items: ["View Projects", "Create Projects", "Edit Projects", "Delete Projects", "Export Data"] },
  { group: "Campaigns", items: ["View Campaigns", "Create Campaigns", "Edit Campaigns", "Delete Campaigns", "Manage Donations"] },
  { group: "Users", items: ["View Users", "Invite Users", "Edit User Roles", "Delete Users", "Export Users"] },
  { group: "Media", items: ["Upload Media", "Delete Media", "Organize Library"] },
  { group: "Finance", items: ["View Donations", "Export Reports", "Issue Receipts", "Manage Refunds"] },
  { group: "System", items: ["Manage Settings", "View Logs", "Backup & Restore", "Manage Roles"] },
];

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: string[];
}

function getInitialRoles(): Role[] {
  return [
    { id: 1, name: "Super Admin", description: "Full system access with all permissions", color: "#0B5D3F", userCount: 2, permissions: allPermissions.flatMap(g => g.items) },
    { id: 2, name: "Admin", description: "Full content and project management access", color: "#173B63", userCount: 5, permissions: allPermissions.flatMap(g => g.items).filter(p => !["Manage Roles", "Backup & Restore", "Manage Settings"].includes(p)) },
    { id: 3, name: "Content Editor", description: "Create and edit content, no deletion rights", color: "#4CAF50", userCount: 8, permissions: ["Create Content", "Edit Content", "Publish Content", "Upload Media", "View Projects"] },
    { id: 4, name: "Volunteer Manager", description: "Manage volunteers and events", color: "#D6A95A", userCount: 12, permissions: ["View Projects", "View Campaigns", "View Users", "Invite Users", "View Analytics", "Upload Media"] },
    { id: 5, name: "Finance Officer", description: "Access to donation and financial data", color: "#5B8DB8", userCount: 3, permissions: ["View Donations", "Export Reports", "Issue Receipts", "Manage Refunds", "View Analytics"] },
    { id: 6, name: "Researcher", description: "Read-only access to projects and reports", color: "#9E6B3C", userCount: 18, permissions: ["View Projects", "View Campaigns", "View Analytics", "Export Data"] },
  ];
}

import { useFirestoreData } from "../../../../lib/useFirestore";

export function RolesView() {
  const [roles, setRoles, loading] = useFirestoreData<Role[]>("esn_roles", getInitialRoles());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#0B5D3F", permissions: [] as string[] });
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"roles" | "matrix">("roles");

  const save = (list: Role[]) => {
    setRoles(list);
  };

  const togglePermission = (perm: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const toggleGroupAll = (group: typeof allPermissions[0]) => {
    const all = group.items;
    const hasAll = all.every((p) => form.permissions.includes(p));
    setForm((prev) => ({
      ...prev,
      permissions: hasAll
        ? prev.permissions.filter((p) => !all.includes(p))
        : [...new Set([...prev.permissions, ...all])],
    }));
  };

  const handleSubmit = () => {
    if (!form.name) return;
    if (editId !== null) {
      save(roles.map((r) => r.id === editId ? { ...r, ...form } : r));
    } else {
      save([...roles, { ...form, id: Date.now(), userCount: 0 }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", description: "", color: "#0B5D3F", permissions: [] });
  };

  const startEdit = (role: Role) => {
    setForm({ name: role.name, description: role.description, color: role.color, permissions: [...role.permissions] });
    setEditId(role.id);
    setShowForm(true);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Roles & Permissions</h3>
          <p className="text-sm text-gray-400 mt-0.5">{roles.length} roles · {roles.reduce((s, r) => s + r.userCount, 0)} total users assigned</p>
        </div>
        <button onClick={() => { setForm({ name: "", description: "", color: "#0B5D3F", permissions: [] }); setEditId(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          <Plus size={16} /> Create Role
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-gray-100 p-1 w-fit">
        {[["roles", "Roles Overview"], ["matrix", "Permission Matrix"]].map(([t, l]) => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? "bg-[#0B5D3F] text-white" : "text-gray-500 hover:text-gray-700"}`}>{l}</button>
        ))}
      </div>

      {/* Roles Overview */}
      {activeTab === "roles" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {roles.map((role) => (
            <motion.div key={role.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
              {/* Color bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: role.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: role.color + "18" }}>
                      <Shield size={20} style={{ color: role.color }} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{role.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Users size={11} />{role.userCount} users
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(role)} className="p-1.5 rounded-lg hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all"><Edit3 size={13} /></button>
                    {role.name !== "Super Admin" && (
                      <button onClick={() => save(roles.filter(r => r.id !== role.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={13} /></button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">{role.description}</p>

                {/* Permission summary */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-600">{role.permissions.length} permissions</span>
                  <button onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)} className="text-xs text-[#0B5D3F] font-semibold flex items-center gap-1">
                    {expandedRole === role.id ? <><ChevronUp size={12} /> Hide</> : <><ChevronDown size={12} /> Show</>}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedRole === role.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex flex-wrap gap-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
                        {role.permissions.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full border border-gray-100 text-gray-500">{p}</span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Permission Matrix */}
      {activeTab === "matrix" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#F6FBF8]">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase w-40">Permission</th>
                {roles.map((r) => (
                  <th key={r.id} className="px-3 py-3.5 text-center">
                    <div className="text-xs font-bold text-gray-700 whitespace-nowrap">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.userCount} users</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((group) => (
                <>
                  <tr key={group.group} className="bg-[#F6FBF8]/60">
                    <td colSpan={roles.length + 1} className="px-5 py-2 text-xs font-black text-[#0B5D3F] uppercase tracking-wider">{group.group}</td>
                  </tr>
                  {group.items.map((perm) => (
                    <tr key={perm} className="border-t border-gray-50 hover:bg-[#F6FBF8]/40 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-600">{perm}</td>
                      {roles.map((r) => (
                        <td key={r.id} className="px-3 py-3 text-center">
                          {r.permissions.includes(perm) ? (
                            <Check size={15} className="mx-auto" style={{ color: r.color }} />
                          ) : (
                            <X size={13} className="mx-auto text-gray-200" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{editId ? "Edit Role" : "Create New Role"}</h4>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Role Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Content Manager" className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Role Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-16 rounded-xl border border-gray-200 cursor-pointer" />
                    <span className="text-sm font-mono text-gray-500">{form.color}</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Description</label>
                  <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief role description..." className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-gray-600 mb-3 block">Permissions ({form.permissions.length} selected)</label>
                <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
                  {allPermissions.map((group) => {
                    const hasAll = group.items.every(p => form.permissions.includes(p));
                    const hasSome = group.items.some(p => form.permissions.includes(p));
                    return (
                      <div key={group.group}>
                        <button onClick={() => toggleGroupAll(group)} className="flex items-center gap-2 text-xs font-bold text-[#0B5D3F] mb-2 hover:underline">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${hasAll ? "bg-[#0B5D3F] border-[#0B5D3F]" : hasSome ? "bg-[#4CAF50]/30 border-[#4CAF50]" : "border-gray-300"}`}>
                            {hasAll && <Check size={10} className="text-white" />}
                          </div>
                          {group.group}
                        </button>
                        <div className="grid grid-cols-2 gap-2 pl-2">
                          {group.items.map((perm) => (
                            <button key={perm} onClick={() => togglePermission(perm)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${form.permissions.includes(perm) ? "bg-[#0B5D3F]/10 border-[#0B5D3F]/30 text-[#0B5D3F]" : "bg-[#F6FBF8] border-gray-100 text-gray-500 hover:border-gray-200"}`}>
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${form.permissions.includes(perm) ? "bg-[#0B5D3F] border-[#0B5D3F]" : "border-gray-300"}`}>
                                {form.permissions.includes(perm) && <Check size={9} className="text-white" />}
                              </div>
                              {perm}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSubmit} className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">{editId ? "Save Changes" : "Create Role"}</button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
