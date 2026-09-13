import { fetchFirestoreData, saveFirestoreData } from "./useFirestore";
import { StaffUser } from "./staffAuthService";

export interface WorkSession {
  id: string;
  staffId: string | number;
  staffEmail: string;
  staffName: string;
  staffRole: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // ISO string
  clockOut?: string; // ISO string
  activeSeconds: number;
  idleSeconds: number;
  status: "active" | "idle" | "break" | "completed" | "offline";
  actionsCount: number;
  description?: string;
  lastHeartbeat: string;
}

export interface StaffWorkSummary {
  staffId: string | number;
  staffName: string;
  staffEmail: string;
  staffRole: string;
  department?: string;
  avatar?: string;
  isOnline: boolean;
  currentStatus: "active" | "idle" | "break" | "offline";
  currentSessionSeconds: number;
  todaySeconds: number;
  weeklySeconds: number;
  monthlySeconds: number;
  todayActions: number;
  lastActive: string;
  targetWeeklySeconds: number; // e.g. 40h = 144,000s
}

// Generate realistic past work sessions for team
export function getInitialWorkSessions(): WorkSession[] {
  const sessions: WorkSession[] = [];
  const now = new Date();

  // Helper to format YYYY-MM-DD
  const getDateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const staffProfiles = [
    { id: 2, email: "imran@esnglobal.org", name: "Imran Hossain", role: "Co-Founder & Executive Lead", hoursPerDay: [7.5, 8.0, 7.0, 8.5, 6.0], actionsPerDay: [14, 18, 15, 22, 14], task: "Global stakeholder reviews & COP climate delegation briefings" },
    { id: 3, email: "hanif@esnglobal.org", name: "Abu Hanif", role: "Co-Founder & Operations Lead", hoursPerDay: [8.0, 8.5, 8.0, 7.5, 6.5], actionsPerDay: [20, 25, 18, 19, 16], task: "Field operations audits and mangrove nursery log reviews" },
    { id: 4, email: "priya@esnglobal.org", name: "Priya Sharma", role: "Climate Policy Researcher", hoursPerDay: [6.0, 7.0, 6.5, 5.5, 5.0], actionsPerDay: [9, 14, 11, 8, 10], task: "UNFCCC policy brief drafting and regional data analysis" },
    { id: 5, email: "carlos@esnglobal.org", name: "Carlos Rodriguez", role: "Regional Director, Americas", hoursPerDay: [7.0, 6.5, 7.5, 8.0, 5.0], actionsPerDay: [14, 11, 16, 15, 8], task: "Amazon restoration partners outreach and grant allocations" },
    { id: 6, email: "amara@esnglobal.org", name: "Amara Osei", role: "Director of Community Programs", hoursPerDay: [7.5, 8.0, 7.0, 7.5, 6.5], actionsPerDay: [16, 19, 14, 18, 12], task: "Green Schools curriculum rollout and chapter coordinator training" },
  ];

  staffProfiles.forEach((staff) => {
    staff.hoursPerDay.forEach((hours, index) => {
      const daysAgo = index + 1;
      const dateStr = getDateStr(daysAgo);
      const activeSecs = Math.round(hours * 3600);
      const clockInDate = new Date(`${dateStr}T09:00:00Z`);
      const clockOutDate = new Date(clockInDate.getTime() + activeSecs * 1000);

      sessions.push({
        id: `sess-${staff.id}-${dateStr}`,
        staffId: staff.id,
        staffEmail: staff.email,
        staffName: staff.name,
        staffRole: staff.role,
        date: dateStr,
        clockIn: clockInDate.toISOString(),
        clockOut: clockOutDate.toISOString(),
        activeSeconds: activeSecs,
        idleSeconds: 1800,
        status: "completed",
        actionsCount: staff.actionsPerDay[index],
        description: staff.task,
        lastHeartbeat: clockOutDate.toISOString(),
      });
    });
  });

  return sessions;
}

// Format seconds into readable format (e.g. "7h 45m" or "02:45:10")
export function formatDuration(seconds: number, format: "short" | "digital" | "detailed" = "short"): string {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (format === "digital") {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  if (format === "detailed") {
    if (hrs === 0 && mins === 0) return `${secs}s`;
    if (hrs === 0) return `${mins}m ${secs}s`;
    return `${hrs}h ${mins}m ${secs}s`;
  }

  if (hrs === 0 && mins === 0) return `${secs}s`;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

// Calculate total staff work summaries (Today, Week, Month)
export function computeStaffSummaries(
  staffList: StaffUser[],
  sessions: WorkSession[],
  activeStaffId?: string | number,
  activeSessionElapsed: number = 0
): StaffWorkSummary[] {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Start of current week (Monday)
  const currentDay = now.getDay();
  const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return staffList.map((staff) => {
    const userSessions = (sessions || []).filter(
      (s) => String(s.staffId) === String(staff.id) || s.staffEmail.toLowerCase() === staff.email.toLowerCase()
    );
    
    // Today's sessions
    let todaySeconds = userSessions
      .filter((s) => s.date === todayStr)
      .reduce((acc, s) => acc + s.activeSeconds, 0);

    // This week's sessions
    let weeklySeconds = userSessions
      .filter((s) => new Date(s.date) >= startOfWeek)
      .reduce((acc, s) => acc + s.activeSeconds, 0);

    // This month's sessions
    let monthlySeconds = userSessions
      .filter((s) => new Date(s.date) >= startOfMonth)
      .reduce((acc, s) => acc + s.activeSeconds, 0);

    // Today's actions
    let todayActions = userSessions
      .filter((s) => s.date === todayStr)
      .reduce((acc, s) => acc + (s.actionsCount || 0), 0);

    // Precise match by ID or Email
    const isCurrentActiveUser = Boolean(
      activeStaffId &&
      (String(staff.id) === String(activeStaffId) ||
       staff.email.toLowerCase() === String(activeStaffId).toLowerCase())
    );

    if (isCurrentActiveUser) {
      if (activeSessionElapsed > 0) {
        todaySeconds += activeSessionElapsed;
        weeklySeconds += activeSessionElapsed;
        monthlySeconds += activeSessionElapsed;
      }
      todayActions = Math.max(todayActions, 6);
    }

    const latestSession = userSessions.sort(
      (a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()
    )[0];

    const isOnline = isCurrentActiveUser || (latestSession && !latestSession.clockOut && latestSession.date === todayStr);

    return {
      staffId: staff.id,
      staffName: staff.name,
      staffEmail: staff.email,
      staffRole: staff.role,
      department: staff.department,
      avatar: staff.avatar,
      isOnline: Boolean(isOnline),
      currentStatus: isCurrentActiveUser ? "active" : isOnline ? "active" : "offline",
      currentSessionSeconds: isCurrentActiveUser ? activeSessionElapsed : 0,
      todaySeconds,
      weeklySeconds,
      monthlySeconds,
      todayActions,
      lastActive: isCurrentActiveUser ? "Active Now" : latestSession?.lastHeartbeat || staff.lastLogin || "Earlier",
      targetWeeklySeconds: (staff.weeklyTargetHours || 40) * 3600,
    };
  });
}

// Export work hours to CSV report
export function exportTimesheetCSV(summaries: StaffWorkSummary[], sessions: WorkSession[]): void {
  const headers = ["Staff Name", "Email", "Role", "Department", "Status", "Today Hours", "Weekly Hours", "Monthly Hours", "Target Completion %"];
  const rows = summaries.map((s) => {
    const targetPct = Math.min(100, Math.round((s.weeklySeconds / s.targetWeeklySeconds) * 100));
    return [
      s.staffName,
      s.staffEmail,
      s.staffRole,
      s.department || "General",
      s.isOnline ? "Working Now" : "Offline",
      formatDuration(s.todaySeconds),
      formatDuration(s.weeklySeconds),
      formatDuration(s.monthlySeconds),
      `${targetPct}%`,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `esn_timesheets_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
