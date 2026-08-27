import { fetchFirestoreData, saveFirestoreData } from "./useFirestore";
import { getInitialStaffUsers, StaffUser } from "./staffAuthService";

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
  lastHeartbeat: string;
}

export interface StaffWorkSummary {
  staffId: string | number;
  staffName: string;
  staffEmail: string;
  staffRole: string;
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

// Generate realistic past 30-day work sessions for team
export function getInitialWorkSessions(): WorkSession[] {
  return [];
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
    const userSessions = sessions.filter((s) => String(s.staffId) === String(staff.id) || s.staffEmail === staff.email);
    
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
    const todayActions = userSessions
      .filter((s) => s.date === todayStr)
      .reduce((acc, s) => acc + (s.actionsCount || 0), 0);

    const isCurrentActiveUser = String(staff.id) === String(activeStaffId);
    if (isCurrentActiveUser && activeSessionElapsed > 0) {
      todaySeconds += activeSessionElapsed;
      weeklySeconds += activeSessionElapsed;
      monthlySeconds += activeSessionElapsed;
    }

    const latestSession = userSessions.sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime())[0];

    const isOnline = isCurrentActiveUser || (latestSession && !latestSession.clockOut && latestSession.date === todayStr);

    return {
      staffId: staff.id,
      staffName: staff.name,
      staffEmail: staff.email,
      staffRole: staff.role,
      avatar: staff.avatar,
      isOnline: Boolean(isOnline),
      currentStatus: isCurrentActiveUser ? "active" : isOnline ? "active" : "offline",
      currentSessionSeconds: isCurrentActiveUser ? activeSessionElapsed : 0,
      todaySeconds,
      weeklySeconds,
      monthlySeconds,
      todayActions: Math.max(todayActions, isCurrentActiveUser ? 8 : 0),
      lastActive: latestSession?.lastHeartbeat || staff.lastLogin || "Recently",
      targetWeeklySeconds: 40 * 3600, // 40 hours standard weekly target
    };
  });
}

// Export work hours to CSV report
export function exportTimesheetCSV(summaries: StaffWorkSummary[], sessions: WorkSession[]): void {
  const headers = ["Staff Name", "Email", "Role", "Status", "Today Hours", "Weekly Hours", "Monthly Hours", "Weekly Target (40h) %"];
  const rows = summaries.map((s) => [
    `"${s.staffName}"`,
    `"${s.staffEmail}"`,
    `"${s.staffRole}"`,
    `"${s.isOnline ? "Active / Online" : "Offline"}"`,
    `"${formatDuration(s.todaySeconds)}"`,
    `"${formatDuration(s.weeklySeconds)}"`,
    `"${formatDuration(s.monthlySeconds)}"`,
    `"${Math.min(100, Math.round((s.weeklySeconds / s.targetWeeklySeconds) * 100))}%"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ESN_Staff_Timesheet_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
