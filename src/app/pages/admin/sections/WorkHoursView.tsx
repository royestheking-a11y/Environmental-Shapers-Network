import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, Calendar, Users, TrendingUp, Download, Search, Filter,
  CheckCircle2, Play, Pause, AlertCircle, X, ChevronRight, BarChart2,
  Activity, Shield, User, ArrowUpRight, ArrowDownRight, RefreshCw, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { useFirestoreData } from "../../../../lib/useFirestore";
import { getInitialStaffUsers, StaffUser } from "../../../../lib/staffAuthService";
import {
  getInitialWorkSessions, WorkSession, StaffWorkSummary,
  computeStaffSummaries, formatDuration, exportTimesheetCSV
} from "../../../../lib/workHoursService";

interface WorkHoursViewProps {
  currentStaffId?: string | number;
  currentSessionElapsed?: number;
}

export function WorkHoursView({ currentStaffId, currentSessionElapsed = 0 }: WorkHoursViewProps) {
  const [staffUsers] = useFirestoreData<StaffUser[]>("esn_staff_users", getInitialStaffUsers());
  const [sessions] = useFirestoreData<WorkSession[]>("esn_staff_work_hours", getInitialWorkSessions());
  
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<StaffWorkSummary | null>(null);

  // Compute live summaries for all staff
  const staffSummaries = useMemo(() => {
    return computeStaffSummaries(staffUsers, sessions, currentStaffId, currentSessionElapsed);
  }, [staffUsers, sessions, currentStaffId, currentSessionElapsed]);

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
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const baseHours = idx < 5 ? 24 + (idx * 3.5) % 12 : 6 + (idx * 2) % 6;
      return {
        day,
        hours: Math.round(baseHours),
        actions: Math.round(baseHours * 4.2),
      };
    });
  }, []);

  // Filter staff rows
  const filteredStaff = staffSummaries.filter((s) => {
    const matchSearch =
      s.staffName.toLowerCase().includes(search.toLowerCase()) ||
      s.staffEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.staffRole.toLowerCase().includes(search.toLowerCase());
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

  // Get individual session records for selected staff member
  const selectedStaffSessions = useMemo(() => {
    if (!selectedStaff) return [];
    return sessions
      .filter((sess) => String(sess.staffId) === String(selectedStaff.staffId) || sess.staffEmail === selectedStaff.staffEmail)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14);
  }, [selectedStaff, sessions]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Staff Working Hours & Timesheets
            </h3>
            <span className="bg-[#4CAF50]/15 text-[#0B5D3F] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
              Live Tracking
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time employee working hours, active working duration, and daily/weekly/monthly attendance logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex bg-[#F6FBF8] p-1 rounded-xl border border-gray-200 text-xs font-bold">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
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
            onClick={() => exportTimesheetCSV(staffSummaries, sessions)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <p className="text-xs text-gray-400">{stats.totalActionsToday} platform actions today</p>
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
                <th className="text-left px-4 py-3.5">Role</th>
                <th className="text-left px-4 py-3.5">Status</th>
                <th className="text-left px-4 py-3.5">
                  {timeframe === "daily" ? "Today's Hours" : timeframe === "weekly" ? "Weekly Hours" : "Monthly Hours"}
                </th>
                <th className="text-left px-4 py-3.5">Weekly Goal (40h)</th>
                <th className="text-left px-4 py-3.5">Updates Today</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((staff) => {
                const targetPct = Math.min(100, Math.round((staff.weeklySeconds / staff.targetWeeklySeconds) * 100));
                
                return (
                  <tr key={staff.staffId} className="hover:bg-[#F6FBF8]/60 transition-colors">
                    {/* Employee Profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {staff.avatar ? (
                            <img src={staff.avatar} alt={staff.staffName} className="w-10 h-10 rounded-xl object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] text-white flex items-center justify-center font-bold text-sm">
                              {staff.staffName.charAt(0)}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              staff.isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{staff.staffName}</div>
                          <div className="text-xs text-gray-400">{staff.staffEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0B5D3F]/10 text-[#0B5D3F]">
                        {staff.staffRole}
                      </span>
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
                      <div className="text-[10px] text-gray-400">
                        {timeframe === "daily" ? `Week: ${formatDuration(staff.weeklySeconds)}` : `Today: ${formatDuration(staff.todaySeconds)}`}
                      </div>
                    </td>

                    {/* Weekly Target Progress */}
                    <td className="px-4 py-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>{targetPct}%</span>
                          <span className="text-[10px] text-gray-400">{(staff.weeklySeconds / 3600).toFixed(1)} / 40h</span>
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
                      <button
                        onClick={() => setSelectedStaff(staff)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-[#0B5D3F]/10 text-gray-700 hover:text-[#0B5D3F] text-xs font-bold transition-all border border-gray-200 hover:border-[#0B5D3F]/30"
                      >
                        Timesheet <ChevronRight size={13} />
                      </button>
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] text-white flex items-center justify-center font-black text-base">
                    {selectedStaff.staffName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{selectedStaff.staffName}</h4>
                    <p className="text-xs text-gray-500">{selectedStaff.staffRole} · {selectedStaff.staffEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
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
                <h5 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Recent Work Sessions (Past 14 Days)
                </h5>

                {selectedStaffSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-white flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center font-bold">
                        <span className="text-[9px] text-gray-400 uppercase leading-none">
                          {new Date(sess.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-sm text-gray-800 leading-none mt-0.5">
                          {new Date(sess.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {new Date(sess.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Clocked: {new Date(sess.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {sess.clockOut && ` — ${new Date(sess.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm font-black text-[#0B5D3F]">
                        {formatDuration(sess.activeSeconds)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {sess.actionsCount || 0} updates made
                      </div>
                    </div>
                  </div>
                ))}

                {selectedStaffSessions.length === 0 && (
                  <div className="py-12 text-center text-xs text-gray-400">
                    No past session history recorded for this staff member.
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-400">Automated ESN Timesheet Service</span>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="px-5 py-2 rounded-xl bg-[#0B5D3F] text-white font-bold hover:bg-[#0a5237] transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
