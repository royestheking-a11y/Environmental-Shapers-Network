import { fetchFirestoreData, saveFirestoreData } from "./useFirestore";

export interface ActivityLogItem {
  id: string | number;
  userName: string;
  userRole: string;
  userEmail: string;
  action: string;
  category: "Projects" | "Campaigns" | "Programs" | "Events" | "Media" | "Donations" | "Users" | "Roles" | "Settings" | "CMS" | "Auth" | "System";
  details: string;
  timestamp: string;
  isoDate: string;
  status: "success" | "warning" | "danger" | "info";
  ip?: string;
}

export function isMockActivityLog(item: any): boolean {
  if (!item || typeof item !== "object") return false;
  // Specific legacy mock identifiers
  if (item.id === 1 || item.id === 2 || item.id === 3 || item.id === 4 || item.id === 5) {
    return true;
  }
  const details = String(item.details || "");
  if (
    details.includes("EcoFoundation Germany") ||
    details.includes("Amazon Reforestation Hub") ||
    details.includes("Clean Ocean Initiative") ||
    details.includes("Global Youth Climate Summit 2026") ||
    details.includes("ESN Cloud Management Platform & Storage engine online")
  ) {
    return true;
  }
  return false;
}

export function sanitizeRealActivityLogs(logs: any[]): ActivityLogItem[] {
  if (!Array.isArray(logs)) return [];
  return logs.filter((log) => !isMockActivityLog(log));
}

/**
 * Returns initial activity logs. Kept empty to ensure only 100% REAL system activities appear.
 */
export function getInitialActivityLogs(): ActivityLogItem[] {
  return [];
}

/**
 * Clears all activity logs
 */
export async function clearActivityLogs(): Promise<void> {
  await saveFirestoreData("esn_activity_logs", []);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("esn_activity_cleared"));
  }
}

/**
 * Automatically logs an administrative or staff activity to Firestore & Local Cache
 */
export async function logAdminActivity(
  action: string,
  category: ActivityLogItem["category"],
  details: string,
  status: ActivityLogItem["status"] = "info",
  customUser?: { name?: string; role?: string; email?: string }
): Promise<void> {
  try {
    let currentUser = { name: "Admin User", role: "Super Admin", email: "admin@esnglobal.org" };
    try {
      const stored = localStorage.getItem("esn_admin_user");
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    } catch {}

    if (customUser) {
      currentUser = { ...currentUser, ...customUser };
    }

    const rawLogs = await fetchFirestoreData<ActivityLogItem[]>("esn_activity_logs", []);
    const currentLogs = sanitizeRealActivityLogs(rawLogs);
    
    const newLog: ActivityLogItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userName: currentUser.name || "Admin User",
      userRole: currentUser.role || "Admin",
      userEmail: currentUser.email || "admin@esnglobal.org",
      action,
      category,
      details,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      isoDate: new Date().toISOString(),
      status,
    };

    // Keep the latest 200 logs
    const updatedLogs = [newLog, ...currentLogs.filter((l) => l.id !== newLog.id)].slice(0, 199);
    await saveFirestoreData("esn_activity_logs", updatedLogs);
    
    // Dispatch an event so components listening can update instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("esn_activity_logged", { detail: newLog }));
    }
  } catch (err) {
    console.warn("Failed to log activity:", err);
  }
}

