import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Plus, Edit3, Trash2, Check, X, Users,
  Lock, Unlock, Eye, EyeOff, Settings, FileText, Heart,
  Globe2, Megaphone, Calendar, Image, Mail, Database,
  ChevronDown, ChevronUp, UserCheck, Key, RefreshCw,
  Search, Filter, Download, Activity, Clock, AlertCircle,
  CheckCircle2, AlertTriangle, ShieldCheck, UserPlus, Sparkles
} from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { StaffUser, getInitialStaffUsers } from "../../../../lib/staffAuthService";
import { ActivityLogItem, getInitialActivityLogs, logAdminActivity } from "../../../../lib/activityLogger";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

const allPermissions = [
  { group: "Content", items: ["Create Content", "Edit Content", "Delete Content", "Publish Content", "View Analytics"] },
  { group: "Projects", items: ["View Projects", "Create Projects", "Edit Projects", "Delete Projects", "Export Data"] },
  { group: "Campaigns", items: ["View Campaigns", "Create Campaigns", "Edit Campaigns", "Delete Campaigns", "Manage Donations"] },
  { group: "Users", items: ["View Users", "Invite Users", "Edit User Roles", "Delete Users", "Export Users"] },
  { group: "Media", items: ["Upload Media", "Delete Media", "Organize Library"] },
  { group: "Finance", items: ["View Donations", "Export Reports", "Issue Receipts", "Manage Refunds"] },
  { group: "System", items: ["Manage Settings", "View Logs", "Backup & Restore", "Manage Roles"] },
];

export interface Role {
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

export function RolesView() {
  const [activeTab, setActiveTab] = useState<"roles" | "staff" | "activity">("roles");
  
  // Roles State
  const [roles, setRoles] = useFirestoreData<Role[]>("esn_roles", getInitialRoles());
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "", color: "#0B5D3F", permissions: [] as string[] });

  // Staff Credentials State
  const [staffList, setStaffList] = useFirestoreData<StaffUser[]>("esn_staff_users", getInitialStaffUsers());
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [staffForm, setStaffForm] = useState<Partial<StaffUser>>({
    name: "",
    email: "",
    password: "",
    role: "Content Editor",
    status: "Active",
    department: "",
    avatar: "",
  });

  // Password Reset Modal State
  const [resetModalUser, setResetModalUser] = useState<StaffUser | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Activity Logs State
  const [logs, setLogs] = useFirestoreData<ActivityLogItem[]>("esn_activity_logs", getInitialActivityLogs());
  const [activitySearch, setActivitySearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Save Roles
  const saveRoles = async (list: Role[]) => {
    setRoles(list);
    await saveFirestoreData("esn_roles", list);
  };

  // Save Staff
  const saveStaff = async (list: StaffUser[]) => {
    setStaffList(list);
    await saveFirestoreData("esn_staff_users", list);
  };

  // Role Form Handlers
  const togglePermission = (perm: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const toggleGroupAll = (group: typeof allPermissions[0]) => {
    const all = group.items;
    const hasAll = all.every((p) => roleForm.permissions.includes(p));
    setRoleForm((prev) => ({
      ...prev,
      permissions: hasAll
        ? prev.permissions.filter((p) => !all.includes(p))
        : [...new Set([...prev.permissions, ...all])],
    }));
  };

  const handleRoleSubmit = async () => {
    if (!roleForm.name) return;
    if (editingRoleId !== null) {
      const updated = roles.map((r) => r.id === editingRoleId ? { ...r, ...roleForm } : r);
      await saveRoles(updated);
      await logAdminActivity("Updated Role", "Roles", `Updated role permissions and details for "${roleForm.name}".`, "info");
    } else {
      const newRole: Role = { ...roleForm, id: Date.now(), userCount: 0 };
      await saveRoles([...roles, newRole]);
      await logAdminActivity("Created Role", "Roles", `Created new role "${roleForm.name}" with ${roleForm.permissions.length} permissions.`, "success");
    }
    setShowRoleModal(false);
    setEditingRoleId(null);
    setRoleForm({ name: "", description: "", color: "#0B5D3F", permissions: [] });
  };

  const handleDeleteRole = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      const updated = roles.filter((r) => r.id !== role.id);
      await saveRoles(updated);
      await logAdminActivity("Deleted Role", "Roles", `Deleted role "${role.name}".`, "warning");
    }
  };

  // Staff Form Handlers
  const handleStaffSubmit = async () => {
    if (!staffForm.name || !staffForm.email) return;

    if (editingStaffId !== null) {
      const updated = staffList.map((s) => s.id === editingStaffId ? { ...s, ...staffForm } as StaffUser : s);
      await saveStaff(updated);
      await logAdminActivity("Updated Staff Member", "Users", `Updated staff account for ${staffForm.name} (${staffForm.role}).`, "info");
    } else {
      const newUser: StaffUser = {
        id: Date.now(),
        name: staffForm.name || "",
        email: staffForm.email || "",
        password: staffForm.password || "ESN@2026",
        role: staffForm.role || "Content Editor",
        status: staffForm.status || "Active",
        department: staffForm.department || "Staff",
        avatar: staffForm.avatar || "",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastLogin: "Never",
      };
      await saveStaff([...staffList, newUser]);
      await logAdminActivity("Created Staff Account", "Users", `Created staff login for ${newUser.name} with role "${newUser.role}".`, "success");
    }

    setShowStaffModal(false);
    setEditingStaffId(null);
    setStaffForm({ name: "", email: "", password: "", role: "Content Editor", status: "Active", department: "", avatar: "" });
  };

  const handleDeleteStaff = async (staff: StaffUser) => {
    if (window.confirm(`Are you sure you want to delete staff account for "${staff.name}"?`)) {
      const updated = staffList.filter((s) => s.id !== staff.id);
      await saveStaff(updated);
      await logAdminActivity("Deleted Staff Account", "Users", `Deleted staff account for ${staff.name} (${staff.email}).`, "danger");
    }
  };

  const handleToggleStaffStatus = async (staff: StaffUser) => {
    const nextStatus = staff.status === "Active" ? "Suspended" : "Active";
    const updated = staffList.map((s) => s.id === staff.id ? { ...s, status: nextStatus } as StaffUser : s);
    await saveStaff(updated);
    await logAdminActivity("Changed Staff Status", "Users", `Changed status of ${staff.name} to ${nextStatus}.`, nextStatus === "Active" ? "success" : "warning");
  };

  const handleResetPassword = async () => {
    if (!resetModalUser || !newPassword.trim()) return;
    const updated = staffList.map((s) => s.id === resetModalUser.id ? { ...s, password: newPassword.trim() } : s);
    await saveStaff(updated);
    await logAdminActivity("Reset Password", "Auth", `Admin reset the password for staff user ${resetModalUser.name} (${resetModalUser.email}).`, "warning");
    setResetModalUser(null);
    setNewPassword("");
    alert(`Password for ${resetModalUser.name} has been updated successfully!`);
  };

  // Activity Log Filtering
  const filteredLogs = useMemo(() => {
    return (logs || []).filter((l) => {
      if (!l) return false;
      const q = String(activitySearch || "").toLowerCase().trim();
      const userName = String(l.userName || "").toLowerCase();
      const action = String(l.action || "").toLowerCase();
      const details = String(l.details || "").toLowerCase();
      const role = String(l.userRole || "").toLowerCase();
      const matchSearch = !q || userName.includes(q) || action.includes(q) || details.includes(q) || role.includes(q);
      const matchCategory = categoryFilter === "All" || l.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [logs, activitySearch, categoryFilter]);

  const exportActivityCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Action", "Category", "Details", "Status"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp || l.isoDate}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `esn_activity_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Role-Based Access Control & Activity Audit
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage administrative roles, staff passwords, and inspect real-time system activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "roles" && (
            <button
              onClick={() => {
                setRoleForm({ name: "", description: "", color: "#0B5D3F", permissions: [] });
                setEditingRoleId(null);
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-sm"
            >
              <Plus size={16} /> Create Role
            </button>
          )}
          {activeTab === "staff" && (
            <button
              onClick={() => {
                setStaffForm({ name: "", email: "", password: "", role: "Content Editor", status: "Active", department: "", avatar: "" });
                setEditingStaffId(null);
                setShowStaffModal(true);
              }}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all shadow-sm"
            >
              <UserPlus size={16} /> Add Staff Account
            </button>
          )}
          {activeTab === "activity" && (
            <button
              onClick={exportActivityCSV}
              className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <Download size={15} /> Export Audit Log (CSV)
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-fit max-w-full overflow-x-auto border border-gray-200/60">
        {[
          { id: "roles", label: "Roles & RBAC Matrix", icon: Shield },
          { id: "staff", label: "Staff Credentials & Logins", icon: Users },
          { id: "activity", label: "Live System Activity Log", icon: Activity },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? "bg-white text-[#0B5D3F] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ROLES & RBAC MATRIX */}
      {activeTab === "roles" && (
        <div className="flex flex-col gap-6">
          {/* Roles Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: role.color }}
                      >
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{role.name}</h4>
                        <span className="text-xs text-gray-400">
                          {staffList.filter((s) => s.role === role.name).length} active users
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setRoleForm({
                            name: role.name,
                            description: role.description,
                            color: role.color,
                            permissions: [...role.permissions],
                          });
                          setEditingRoleId(role.id);
                          setShowRoleModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-50 rounded-lg transition-all"
                        title="Edit Role"
                      >
                        <Edit3 size={15} />
                      </button>
                      {role.name !== "Super Admin" && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Role"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{role.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {role.permissions.slice(0, 5).map((p) => (
                      <span
                        key={p}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-100 font-medium"
                      >
                        {p}
                      </span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="text-[11px] px-2 py-1 rounded-lg bg-[#0B5D3F]/10 text-[#0B5D3F] font-bold">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                  <span>Permissions: <strong className="text-gray-700">{role.permissions.length}</strong></span>
                  <span className="font-semibold" style={{ color: role.color }}>Configured</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Permission Matrix */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Role Permissions Matrix
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Comprehensive view of permissions granted across each system role</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-4 px-6">Permission Module</th>
                    {roles.map((r) => (
                      <th key={r.id} className="py-4 px-4 text-center">
                        <span className="font-bold" style={{ color: r.color }}>{r.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allPermissions.map((group) => (
                    <>
                      <tr key={group.group} className="bg-[#F6FBF8]/60 font-bold text-xs text-gray-800">
                        <td colSpan={roles.length + 1} className="py-2.5 px-6 uppercase tracking-wider text-[#0B5D3F]">
                          {group.group} Module
                        </td>
                      </tr>
                      {group.items.map((perm) => (
                        <tr key={perm} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-6 text-xs font-semibold text-gray-700">{perm}</td>
                          {roles.map((r) => {
                            const has = r.permissions.includes(perm);
                            return (
                              <td key={r.id} className="py-3 px-4 text-center">
                                {has ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                                    <Check size={14} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center mx-auto">
                                    <X size={13} />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF CREDENTIALS & LOGINS */}
      {activeTab === "staff" && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Staff User Accounts ({staffList.length})
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Admin portal users who can log in with specific role credentials</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">User / Staff Member</th>
                    <th className="py-4 px-4">Role</th>
                    <th className="py-4 px-4">Department</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Last Active</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staffList.map((user) => {
                    const roleColor = roles.find((r) => r.name === user.role)?.color || "#0B5D3F";
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B5D3F]/10 overflow-hidden flex items-center justify-center font-bold text-[#0B5D3F] shrink-0">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                user.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: roleColor + "15", color: roleColor }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600 font-medium">
                          {user.department || "Staff"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              user.status === "Active"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-600" : "bg-red-600"}`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-400">
                          {user.lastLogin || "Never"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setResetModalUser(user);
                                setNewPassword("");
                              }}
                              className="p-2 bg-gray-50 hover:bg-[#0B5D3F]/10 text-gray-600 hover:text-[#0B5D3F] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                              title="Reset Password"
                            >
                              <Key size={13} />
                              <span className="hidden sm:inline">Password</span>
                            </button>
                            <button
                              onClick={() => handleToggleStaffStatus(user)}
                              className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                                user.status === "Active"
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                              title={user.status === "Active" ? "Suspend Account" : "Activate Account"}
                            >
                              {user.status === "Active" ? <Lock size={13} /> : <Unlock size={13} />}
                            </button>
                            <button
                              onClick={() => {
                                setStaffForm({
                                  name: user.name,
                                  email: user.email,
                                  role: user.role,
                                  status: user.status,
                                  department: user.department,
                                  avatar: user.avatar,
                                });
                                setEditingStaffId(user.id);
                                setShowStaffModal(true);
                              }}
                              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-xl transition-all"
                              title="Edit User"
                            >
                              <Edit3 size={13} />
                            </button>
                            {user.email !== "admin@esnglobal.org" && (
                              <button
                                onClick={() => handleDeleteStaff(user)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"
                                title="Delete Account"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SYSTEM ACTIVITY & AUDIT LOGS */}
      {activeTab === "activity" && (
        <div className="flex flex-col gap-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative flex-1 w-full max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit trail by user, action, details..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Filter Category:</span>
              {["All", "Projects", "Campaigns", "Programs", "Events", "Donations", "Media", "Users", "Roles", "Settings", "Auth"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-[#0B5D3F] text-white shadow-sm"
                      : "bg-[#F6FBF8] text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const statusColors = {
                success: "bg-green-500/10 text-green-700 border-green-200",
                warning: "bg-amber-500/10 text-amber-700 border-amber-200",
                danger: "bg-red-500/10 text-red-700 border-red-200",
                info: "bg-blue-500/10 text-blue-700 border-blue-200",
              };

              return (
                <div key={log.id} className="p-5 hover:bg-[#F6FBF8]/40 transition-colors flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      <Activity size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{log.action}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold border border-gray-200/60">
                          {log.category}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusColors[log.status || "info"]}`}>
                          {log.status?.toUpperCase() || "LOG"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">{log.details}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>By: <strong className="text-gray-700">{log.userName}</strong> ({log.userRole})</span>
                        <span>•</span>
                        <span>{log.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Activity size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No activity logs match your filter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE/EDIT ROLE MODAL */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {editingRoleId ? "Edit Role & Permissions" : "Create Custom Role"}
                </h4>
                <button onClick={() => setShowRoleModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Role Title *</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    placeholder="e.g. Field Coordinator"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Role Description</label>
                  <textarea
                    rows={2}
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Describe what responsibilities this role entails..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Select Permissions Granted</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    {allPermissions.map((g) => {
                      const hasAll = g.items.every((p) => roleForm.permissions.includes(p));
                      return (
                        <div key={g.group} className="bg-white p-3.5 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-50">
                            <span className="text-xs font-bold text-gray-800">{g.group} Module</span>
                            <button
                              type="button"
                              onClick={() => toggleGroupAll(g)}
                              className="text-[11px] font-semibold text-[#0B5D3F] hover:underline"
                            >
                              {hasAll ? "Deselect All" : "Select All"}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {g.items.map((perm) => (
                              <label key={perm} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={roleForm.permissions.includes(perm)}
                                  onChange={() => togglePermission(perm)}
                                  className="w-4 h-4 rounded text-[#0B5D3F] accent-[#0B5D3F]"
                                />
                                {perm}
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleRoleSubmit}
                  className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all"
                >
                  {editingRoleId ? "Save Role Changes" : "Create Role"}
                </button>
                <button onClick={() => setShowRoleModal(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE/EDIT STAFF MODAL */}
      <AnimatePresence>
        {showStaffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowStaffModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {editingStaffId ? "Edit Staff User" : "Add Staff User Account"}
                </h4>
                <button onClick={() => setShowStaffModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Full Name *</label>
                  <input
                    type="text"
                    value={staffForm.name || ""}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Email Address (Username for Login) *</label>
                  <input
                    type="email"
                    value={staffForm.email || ""}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="e.g. sarah@esnglobal.org"
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                {!editingStaffId && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Password *</label>
                    <div className="relative">
                      <input
                        type={showPasswordText ? "text" : "password"}
                        value={staffForm.password || ""}
                        onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                        placeholder="Create strong password"
                        className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Assigned Role *</label>
                    <select
                      value={staffForm.role || "Content Editor"}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Account Status</label>
                    <select
                      value={staffForm.status || "Active"}
                      onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Department / Team</label>
                  <input
                    type="text"
                    value={staffForm.department || ""}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    placeholder="e.g. Communications, Conservation"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Profile Photo / Avatar"
                    value={staffForm.avatar || ""}
                    onChange={(url) => setStaffForm({ ...staffForm, avatar: url })}
                    folder="staff_avatars"
                    aspectRatio="square"
                    helpText="Upload a profile headshot"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleStaffSubmit}
                  className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all"
                >
                  {editingStaffId ? "Save User" : "Create Account"}
                </button>
                <button onClick={() => setShowStaffModal(false)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {resetModalUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setResetModalUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Key size={22} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-1">Reset Staff Password</h4>
              <p className="text-xs text-gray-500 mb-5">
                Set a new password for <strong className="text-gray-800">{resetModalUser.name}</strong> ({resetModalUser.email})
              </p>

              <div className="mb-5">
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">New Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (e.g. ESN@NewPass2026)"
                  className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResetPassword}
                  className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all"
                >
                  Update Password
                </button>
                <button onClick={() => setResetModalUser(null)} className="px-5 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">
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
