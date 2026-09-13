import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, Calendar, Users, TrendingUp, Download, Search, Filter,
  CheckCircle2, Play, Pause, AlertCircle, X, ChevronRight, BarChart2,
  Activity, Shield, User, ArrowUpRight, ArrowDownRight, RefreshCw, Zap,
  Plus, Edit3, Trash2, Check, Coffee, FileText, CheckCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";
import { getInitialStaffUsers, StaffUser } from "../../../../lib/staffAuthService";
import {
  getInitialWorkSessions, WorkSession, StaffWorkSummary,
  computeStaffSummaries, formatDuration, exportTimesheetCSV
} from "../../../../lib/workHoursService";

interface WorkHoursViewProps {
  currentStaffId?: string | number;
  currentSessionElapsed?: number;
}

// Generates role-based luxury gradient colors for staff avatar monograms
function getStaffAvatarTheme(role: string, name: string) {
  const r = role.toLowerCase();
  if (r.includes("super admin") || r.includes("executive")) {
    return { bg: "from-[#0B5D3F] to-[#16835B]", ring: "ring-[#0B5D3F]/20", text: "text-white" };
  }
  if (r.includes("operation") || r.includes("director")) {
    return { bg: "from-[#073623] to-[#0F6B47]", ring: "ring-[#073623]/20", text: "text-white" };
  }
  if (r.includes("research") || r.includes("policy") || r.includes("science")) {
    return { bg: "from-[#173B63] to-[#2B6CB0]", ring: "ring-[#173B63]/20", text: "text-white" };
  }
  if (r.includes("finance") || r.includes("grants")) {
    return { bg: "from-[#B45309] to-[#D97706]", ring: "ring-[#B45309]/20", text: "text-white" };
  }
  if (r.includes("community") || r.includes("volunteer")) {
    return { bg: "from-[#047857] to-[#10B981]", ring: "ring-[#047857]/20", text: "text-white" };
  }
  return { bg: "from-[#374151] to-[#4B5563]", ring: "ring-gray-200", text: "text-white" };
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WorkHoursView({ currentStaffId, currentSessionElapsed = 0 }: WorkHoursViewProps) {
  const [staffUsers, setStaffUsers] = useFirestoreData<StaffUser[]>("esn_staff_users", getInitialStaffUsers());
  const [sessions, setSessions] = useFirestoreData<WorkSession[]>("esn_staff_work_hours", getInitialWorkSessions());
  
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<StaffWorkSummary | null>(null);

  // Break state for current user
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    role: "Program Coordinator",
    department: "Operations",
    weeklyTargetHours: 40,
  });

  const [logHoursForm, setLogHoursForm] = useState({
    staffId: "",
    date: new Date().toISOString().split("T")[0],
    hours: 4,
    minutes: 0,
    description: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute live summaries for all staff
  const staffSummaries = useMemo(() => {
    const elapsed = isOnBreak ? 0 : currentSessionElapsed;
    return computeStaffSummaries(staffUsers, sessions, currentStaffId, elapsed);
  }, [staffUsers, sessions, currentStaffId, currentSessionElapsed, isOnBreak]);

  // Overall KPI statistics
  const stats = useMemo(() => {
    const totalToday = staffSummaries.reduce((acc, s) => acc + s.todaySeconds, 0);
    const totalWeekly = staffSummaries.reduce((acc, s) => acc + s.weeklySeconds, 0);
    const totalMonthly = staffSummaries.reduce((acc, s) => acc + s.monthlySeconds, 0);
    const onlineCount = staffSummaries.filter((s) => s.isOnline).length;
    const totalActionsToday = staffSummaries.reduce((acc, s) => acc + s.todayActions, 0);

    return {
      totalToday,
      totalWeekly,
      totalMonthly,
      onlineCount,
      totalStaff: staffSummaries.length,
      totalActionsToday,
    };
  }, [staffSummaries]);

  // Weekly day-by-day aggregated chart data (Mon-Sun)
  const weeklyChartData = useMemo(() => {
    const dayMap: Record<number, string> = { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun" };
    const dayTotals: Record<string, { seconds: number; actions: number }> = {
      Mon: { seconds: 0, actions: 0 },
      Tue: { seconds: 0, actions: 0 },
      Wed: { seconds: 0, actions: 0 },
      Thu: { seconds: 0, actions: 0 },
      Fri: { seconds: 0, actions: 0 },
      Sat: { seconds: 0, actions: 0 },
      Sun: { seconds: 0, actions: 0 },
    };

    (sessions || []).forEach((s) => {
      if (!s.date) return;
      const dayOfWeek = new Date(s.date).getDay();
      const name = dayMap[dayOfWeek];
      if (name && dayTotals[name]) {
        dayTotals[name].seconds += s.activeSeconds || 0;
        dayTotals[name].actions += s.actionsCount || 0;
      }
    });

    // Add current session if today is active
    const todayName = dayMap[new Date().getDay()];
    if (todayName && currentSessionElapsed > 0 && !isOnBreak) {
      dayTotals[todayName].seconds += currentSessionElapsed;
    }

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      hours: Number((dayTotals[day].seconds / 3600).toFixed(1)),
      actions: dayTotals[day].actions,
    }));
  }, [sessions, currentSessionElapsed, isOnBreak]);

  // Filter staff rows
  const filteredStaff = staffSummaries.filter((s) => {
    const matchSearch =
      s.staffName.toLowerCase().includes(search.toLowerCase()) ||
      s.staffEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.staffRole.toLowerCase().includes(search.toLowerCase()) ||
      (s.department || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || s.staffRole === roleFilter;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "online" && s.isOnline) ||
      (statusFilter === "offline" && !s.isOnline);
    return matchSearch && matchRole && matchStatus;
  });

  const staffRoles = useMemo(() => {
    return ["All", ...Array.from(new Set(staffSummaries.map((s) => s.staffRole)))];
  }, [staffSummaries]);

  // Active current staff member details
  const currentStaffUser = useMemo(() => {
    if (!currentStaffId) return staffSummaries[0];
    return staffSummaries.find(
      (s) => String(s.staffId) === String(currentStaffId) || s.staffEmail.toLowerCase() === String(currentStaffId).toLowerCase()
    ) || staffSummaries[0];
  }, [staffSummaries, currentStaffId]);

  // Individual session records for selected staff member
  const selectedStaffSessions = useMemo(() => {
    if (!selectedStaff) return [];
    return sessions
      .filter((sess) => String(sess.staffId) === String(selectedStaff.staffId) || sess.staffEmail.toLowerCase() === selectedStaff.staffEmail.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
  }, [selectedStaff, sessions]);

  // Save new or edited staff user
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;

    let updatedStaff: StaffUser[];
    if (editingStaff) {
      updatedStaff = staffUsers.map((u) =>
        u.id === editingStaff.id
          ? { ...u, ...staffForm, weeklyTargetHours: Number(staffForm.weeklyTargetHours) || 40 }
          : u
      );
      showToast(`Updated staff profile for ${staffForm.name}`);
    } else {
      const newStaff: StaffUser = {
        id: Date.now(),
        name: staffForm.name.trim(),
        email: staffForm.email.trim().toLowerCase(),
        role: staffForm.role.trim(),
        department: staffForm.department.trim(),
        weeklyTargetHours: Number(staffForm.weeklyTargetHours) || 40,
        status: "Active",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastLogin: "Never",
      };
      updatedStaff = [...staffUsers, newStaff];
      showToast(`Added ${staffForm.name} to ESN team`);
    }

    setStaffUsers(updatedStaff);
    await saveFirestoreData("esn_staff_users", updatedStaff);
    await logAdminActivity(
      editingStaff ? "Updated Staff Profile" : "Added Staff Member",
      "Users",
      `${editingStaff ? "Updated" : "Added"} staff profile for ${staffForm.name} (${staffForm.role}).`,
      "success"
    );
    setShowAddStaffModal(false);
    setEditingStaff(null);
    setStaffForm({ name: "", email: "", role: "Program Coordinator", department: "Operations", weeklyTargetHours: 40 });
  };

  // Delete staff user
  const handleDeleteStaff = async (staffId: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the staff list?`)) return;
    const updated = staffUsers.filter((u) => String(u.id) !== String(staffId));
    setStaffUsers(updated);
    await saveFirestoreData("esn_staff_users", updated);
    await logAdminActivity("Removed Staff User", "Users", `Removed staff member ${name}.`, "warning");
    showToast(`Removed ${name} from staff list`);
    if (selectedStaff && String(selectedStaff.staffId) === String(staffId)) {
      setSelectedStaff(null);
    }
  };

  // Log manual work hours
  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStaff = staffUsers.find((s) => String(s.id) === String(logHoursForm.staffId) || s.email === logHoursForm.staffId);
    if (!targetStaff) return;

    const totalSeconds = Math.round(((Number(logHoursForm.hours) || 0) * 3600) + ((Number(logHoursForm.minutes) || 0) * 60));
    if (totalSeconds <= 0) return;

    const newSession: WorkSession = {
      id: `manual-${Date.now()}`,
      staffId: targetStaff.id,
      staffEmail: targetStaff.email,
      staffName: targetStaff.name,
      staffRole: targetStaff.role,
      date: logHoursForm.date,
      clockIn: new Date(`${logHoursForm.date}T09:00:00Z`).toISOString(),
      clockOut: new Date(new Date(`${logHoursForm.date}T09:00:00Z`).getTime() + totalSeconds * 1000).toISOString(),
      activeSeconds: totalSeconds,
      idleSeconds: 0,
      status: "completed",
      actionsCount: Math.max(1, Math.round(totalSeconds / 1800)),
      description: logHoursForm.description.trim() || "Manual timesheet log entry",
      lastHeartbeat: new Date().toISOString(),
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    await saveFirestoreData("esn_staff_work_hours", updatedSessions);
    await logAdminActivity(
      "Logged Work Hours",
      "System",
      `Logged ${formatDuration(totalSeconds)} for ${targetStaff.name} on ${logHoursForm.date}.`,
      "info"
    );

    setShowLogHoursModal(false);
    showToast(`Logged ${formatDuration(totalSeconds)} for ${targetStaff.name}`);
    setLogHoursForm({
      staffId: "",
      date: new Date().toISOString().split("T")[0],
      hours: 4,
      minutes: 0,
      description: "",
    });
  };

  // Delete an individual logged session
  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm("Delete this timesheet work session entry?")) return;
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    await saveFirestoreData("esn_staff_work_hours", updated);
    await logAdminActivity("Deleted Work Session", "System", "Deleted a timesheet work session entry.", "warning");
    showToast("Work session entry removed");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2.5 bg-emerald-900 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-lg"
          >
            <CheckCircle size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-gray-900 text-xl sm:text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Staff Working Hours & Timesheets
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Pulse
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time organizational attendance, team work sessions, target tracking, and automated timesheets.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex bg-[#F6FBF8] p-1 rounded-xl border border-gray-200 text-xs font-bold">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  timeframe === t
                    ? "bg-[#0B5D3F] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLogHoursModal(true)}
            className="flex items-center gap-2 bg-[#F6FBF8] border border-[#0B5D3F]/30 text-[#0B5D3F] hover:bg-[#0B5D3F] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Clock size={14} /> Log Work Hours
          </button>

          <button
            onClick={() => {
              setEditingStaff(null);
              setStaffForm({ name: "", email: "", role: "Program Lead", department: "Operations", weeklyTargetHours: 40 });
              setShowAddStaffModal(true);
            }}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white hover:bg-[#0a5237] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Add Employee
          </button>

          <button
            onClick={() => exportTimesheetCSV(staffSummaries, sessions)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
            title="Download CSV report of team timesheets"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Current Active Staff Member Live Status Card */}
      {currentStaffUser && (
        <div className="bg-gradient-to-r from-[#072418] via-[#0B5D3F] to-[#124230] rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getStaffAvatarTheme(currentStaffUser.staffRole, currentStaffUser.staffName).bg} flex items-center justify-center font-black text-lg shadow-md border-2 border-white/20 shrink-0`}>
              {getInitials(currentStaffUser.staffName)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-black text-lg">{currentStaffUser.staffName}</span>
                <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-200">
                  {currentStaffUser.staffRole}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${
                  isOnBreak ? "bg-amber-400/20 text-amber-300" : "bg-emerald-400/20 text-emerald-300"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnBreak ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                  {isOnBreak ? "On Break" : "Active Work Session"}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Your time is automatically recorded while navigating and updating the platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 relative z-10 w-full md:w-auto justify-between md:justify-end">
            <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Session Timer</div>
              <div className="font-mono text-xl font-black text-white mt-0.5 tracking-wider">
                {formatDuration(currentSessionElapsed, "digital")}
              </div>
            </div>

            <button
              onClick={() => {
                setIsOnBreak(!isOnBreak);
                showToast(isOnBreak ? "Resumed work session" : "Session paused for break");
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                isOnBreak
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              {isOnBreak ? <Play size={14} /> : <Pause size={14} />}
              {isOnBreak ? "Resume Session" : "Take Break"}
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Team Time</span>
            <div className="w-9 h-9 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatDuration(stats.totalToday)}
          </div>
          <p className="text-xs text-gray-400">Across {stats.onlineCount} active staff today</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">This Week's Total</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatDuration(stats.totalWeekly)}
          </div>
          <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> {(stats.totalWeekly / 3600).toFixed(1)} hrs logged
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">This Month's Total</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatDuration(stats.totalMonthly)}
          </div>
          <p className="text-xs text-gray-400">{stats.totalStaff} staff members</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Working</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mb-1 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {stats.onlineCount}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-gray-400">{stats.totalActionsToday} platform updates recorded</p>
        </div>
      </div>

      {/* Weekly Team Trend Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Weekly Team Hours Distribution</h4>
            <p className="text-xs text-gray-400">Total active employee hours and platform updates (Mon–Sun)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#0B5D3F]">
              <span className="w-3 h-3 rounded-full bg-[#0B5D3F]" /> Active Work Hours
            </span>
            <span className="flex items-center gap-1.5 text-[#4CAF50]">
              <span className="w-3 h-3 rounded-full bg-[#4CAF50]" /> Actions & Updates
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={weeklyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit="h" />
            <Tooltip
              formatter={(val: any, name: string) => [
                name === "hours" ? `${val} hours` : `${val} updates`,
                name === "hours" ? "Work Hours" : "Platform Updates",
              ]}
            />
            <Bar dataKey="hours" fill="#0B5D3F" radius={[6, 6, 0, 0]} name="hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Staff Timesheet Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Table Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100 bg-[#F6FBF8]/40">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#0B5D3F] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 focus:outline-none"
            >
              {staffRoles.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All Roles" : r}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="online">🟢 Working Now</option>
              <option value="offline">⚪ Offline</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F6FBF8] text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Employee</th>
                <th className="text-left px-4 py-3.5">Role & Department</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">
                  {timeframe === "daily" ? "Today's Hours" : timeframe === "weekly" ? "Weekly Hours" : "Monthly Hours"}
                </th>
                <th className="text-left px-4 py-3.5">Weekly Target</th>
                <th className="text-left px-4 py-3.5">Updates Today</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((staff) => {
                const targetPct = Math.min(100, Math.round((staff.weeklySeconds / staff.targetWeeklySeconds) * 100));
                const avatarTheme = getStaffAvatarTheme(staff.staffRole, staff.staffName);
                
                return (
                  <tr key={staff.staffId} className="hover:bg-[#F6FBF8]/60 transition-colors">
                    {/* Employee Monogram Profile Badge */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {staff.avatar ? (
                            <img src={staff.avatar} alt={staff.staffName} className="w-11 h-11 rounded-2xl object-cover shadow-xs border border-gray-200" />
                          ) : (
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarTheme.bg} ${avatarTheme.text} flex items-center justify-center font-black text-sm shadow-xs tracking-wider border border-white/20`}>
                              {getInitials(staff.staffName)}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              staff.isOnline ? "bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{staff.staffName}</div>
                          <div className="text-xs text-gray-400">{staff.staffEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Department */}
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0B5D3F]/10 text-[#0B5D3F] inline-block">
                          {staff.staffRole}
                        </span>
                        {staff.department && (
                          <div className="text-[11px] text-gray-400 mt-1 font-medium">{staff.department}</div>
                        )}
                      </div>
                    </td>

                    {/* Live Status */}
                    <td className="px-4 py-4">
                      {staff.isOnline ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Working Now
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                          Offline
                        </div>
                      )}
                    </td>

                    {/* Selected Timeframe Hours */}
                    <td className="px-4 py-4">
                      <div className="font-mono text-sm font-black text-gray-900">
                        {timeframe === "daily"
                          ? formatDuration(staff.todaySeconds)
                          : timeframe === "weekly"
                          ? formatDuration(staff.weeklySeconds)
                          : formatDuration(staff.monthlySeconds)}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {timeframe === "daily" ? `Week: ${formatDuration(staff.weeklySeconds)}` : `Today: ${formatDuration(staff.todaySeconds)}`}
                      </div>
                    </td>

                    {/* Weekly Target Progress */}
                    <td className="px-4 py-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>{targetPct}%</span>
                          <span className="text-[10px] text-gray-400">{(staff.weeklySeconds / 3600).toFixed(1)} / {(staff.targetWeeklySeconds / 3600)}h</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              targetPct >= 100 ? "bg-purple-600" : targetPct >= 75 ? "bg-[#4CAF50]" : "bg-[#0B5D3F]"
                            }`}
                            style={{ width: `${targetPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Updates Today */}
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        <Activity size={13} className="text-[#4CAF50]" />
                        {staff.todayActions} actions
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-[#0B5D3F]/10 text-gray-700 hover:text-[#0B5D3F] text-xs font-bold transition-all border border-gray-200 hover:border-[#0B5D3F]/30 cursor-pointer"
                        >
                          Timesheet <ChevronRight size={13} />
                        </button>
                        <button
                          onClick={() => {
                            const u = staffUsers.find((x) => String(x.id) === String(staff.staffId));
                            if (u) {
                              setEditingStaff(u);
                              setStaffForm({
                                name: u.name,
                                email: u.email,
                                role: u.role,
                                department: u.department || "Operations",
                                weeklyTargetHours: u.weeklyTargetHours || 40,
                              });
                              setShowAddStaffModal(true);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#0B5D3F] hover:bg-gray-100 rounded-lg cursor-pointer transition-all"
                          title="Edit staff profile"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.staffId, staff.staffName)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all"
                          title="Remove staff member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-bold text-gray-700">No staff members found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Try clearing your search query or role filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Staff Timesheet Drawer */}
      <AnimatePresence>
        {selectedStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end"
          >
            <div className="fixed inset-0" onClick={() => setSelectedStaff(null)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 bg-[#F6FBF8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getStaffAvatarTheme(selectedStaff.staffRole, selectedStaff.staffName).bg} text-white flex items-center justify-center font-black text-base shadow-sm border border-white/20`}>
                    {getInitials(selectedStaff.staffName)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{selectedStaff.staffName}</h4>
                    <p className="text-xs text-gray-500">{selectedStaff.staffRole} · {selectedStaff.staffEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Summary Chips */}
              <div className="grid grid-cols-3 gap-3 p-6 border-b border-gray-100">
                <div className="bg-[#F6FBF8] p-3.5 rounded-2xl border border-gray-100 text-center">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">Today</div>
                  <div className="text-base font-black text-gray-900 font-mono mt-0.5">
                    {formatDuration(selectedStaff.todaySeconds)}
                  </div>
                </div>
                <div className="bg-[#F6FBF8] p-3.5 rounded-2xl border border-gray-100 text-center">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">This Week</div>
                  <div className="text-base font-black text-[#0B5D3F] font-mono mt-0.5">
                    {formatDuration(selectedStaff.weeklySeconds)}
                  </div>
                </div>
                <div className="bg-[#F6FBF8] p-3.5 rounded-2xl border border-gray-100 text-center">
                  <div className="text-[11px] font-bold text-gray-400 uppercase">This Month</div>
                  <div className="text-base font-black text-blue-600 font-mono mt-0.5">
                    {formatDuration(selectedStaff.monthlySeconds)}
                  </div>
                </div>
              </div>

              {/* Day-by-day punch card log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                    Recent Work Sessions ({selectedStaffSessions.length} logged)
                  </h5>
                  <button
                    onClick={() => {
                      setLogHoursForm({
                        staffId: String(selectedStaff.staffId),
                        date: new Date().toISOString().split("T")[0],
                        hours: 4,
                        minutes: 0,
                        description: "",
                      });
                      setShowLogHoursModal(true);
                    }}
                    className="text-xs font-bold text-[#0B5D3F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Entry
                  </button>
                </div>

                {selectedStaffSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-white flex items-center justify-between gap-3 shadow-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0B5D3F] flex flex-col items-center justify-center text-center font-bold shrink-0">
                        <span className="text-[9px] uppercase leading-none opacity-70">
                          {new Date(sess.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-sm font-black leading-none mt-0.5">
                          {new Date(sess.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {new Date(sess.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          {sess.description || "Platform session & maintenance"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className="text-sm font-black text-[#0B5D3F]">
                          {formatDuration(sess.activeSeconds)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {sess.actionsCount || 0} updates
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(sess.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove session log"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedStaffSessions.length === 0 && (
                  <div className="py-12 text-center text-xs text-gray-400">
                    No past session history recorded for this staff member yet.
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-400">ESN Verified Timesheet System</span>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-5 py-2 rounded-xl bg-[#0B5D3F] text-white font-bold hover:bg-[#0a5237] transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Staff Modal */}
      <AnimatePresence>
        {showAddStaffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <h4 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {editingStaff ? "Edit Employee" : "Add New Employee"}
                  </h4>
                </div>
                <button
                  onClick={() => { setShowAddStaffModal(false); setEditingStaff(null); }}
                  className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="e.g. Imran Hossain"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="e.g. imran@esnglobal.org"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Role / Position *</label>
                    <input
                      type="text"
                      required
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      placeholder="e.g. Program Lead"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Department</label>
                    <input
                      type="text"
                      value={staffForm.department}
                      onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                      placeholder="e.g. Operations"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Weekly Hours Target (Hours)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={staffForm.weeklyTargetHours}
                    onChange={(e) => setStaffForm({ ...staffForm, weeklyTargetHours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0a5237] transition-all cursor-pointer shadow-md"
                  >
                    {editingStaff ? "Save Profile Changes" : "Create Staff Account"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddStaffModal(false); setEditingStaff(null); }}
                    className="px-5 py-3 rounded-xl text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Log Hours Modal */}
      <AnimatePresence>
        {showLogHoursModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <h4 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Log Work Hours
                  </h4>
                </div>
                <button
                  onClick={() => setShowLogHoursModal(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleLogHours} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Staff Member *</label>
                  <select
                    required
                    value={logHoursForm.staffId}
                    onChange={(e) => setLogHoursForm({ ...logHoursForm, staffId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                  >
                    <option value="">Select an employee...</option>
                    {staffUsers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={logHoursForm.date}
                    onChange={(e) => setLogHoursForm({ ...logHoursForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Hours</label>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      required
                      value={logHoursForm.hours}
                      onChange={(e) => setLogHoursForm({ ...logHoursForm, hours: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Minutes</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={5}
                      value={logHoursForm.minutes}
                      onChange={(e) => setLogHoursForm({ ...logHoursForm, minutes: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Work Summary / Accomplishments</label>
                  <textarea
                    rows={3}
                    value={logHoursForm.description}
                    onChange={(e) => setLogHoursForm({ ...logHoursForm, description: e.target.value })}
                    placeholder="Brief description of work done (e.g. Coastal program coordination, news article writing, application reviews)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#0B5D3F] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0B5D3F] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0a5237] transition-all cursor-pointer shadow-md"
                  >
                    Save Timesheet Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogHoursModal(false)}
                    className="px-5 py-3 rounded-xl text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
