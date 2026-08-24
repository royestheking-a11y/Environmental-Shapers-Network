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

export function getInitialActivityLogs(): ActivityLogItem[] {
  return [
    {
      id: 1,
      userName: "Admin User",
      userRole: "Super Admin",
      userEmail: "admin@esnglobal.org",
      action: "System Initialized",
      category: "System",
      details: "ESN Cloud Management Platform & Storage engine online",
      timestamp: "Just now",
      isoDate: new Date().toISOString(),
      status: "success",
    },
    {
      id: 2,
      userName: "Editor User",
      userRole: "Content Editor",
      userEmail: "editor@esnglobal.org",
      action: "Updated Project",
      category: "Projects",
      details: "Added new high-resolution cover image to Amazon Reforestation Hub",
      timestamp: "12 mins ago",
      isoDate: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      status: "info",
    },
    {
      id: 3,
      userName: "Admin User",
      userRole: "Super Admin",
      userEmail: "admin@esnglobal.org",
      action: "Created Campaign",
      category: "Campaigns",
      details: "Launched 'Clean Ocean Initiative' with $500,000 goal",
      timestamp: "45 mins ago",
      isoDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: "success",
    },
    {
      id: 4,
      userName: "Carlos Rodriguez",
      userRole: "Finance Officer",
      userEmail: "finance@esnglobal.org",
      action: "Approved Donation",
      category: "Donations",
      details: "Approved $2,500 contribution from EcoFoundation Germany (Receipt #ESN-8841)",
      timestamp: "2 hours ago",
      isoDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      status: "success",
    },
    {
      id: 5,
      userName: "Sarah Jenkins",
      userRole: "Volunteer Manager",
      userEmail: "sarah@esnglobal.org",
      action: "Created Event",
      category: "Events",
      details: "Published 'Global Youth Climate Summit 2026' with 500 attendee capacity",
      timestamp: "4 hours ago",
      isoDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      status: "info",
    },
  ];
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

    const currentLogs = await fetchFirestoreData<ActivityLogItem[]>("esn_activity_logs", getInitialActivityLogs());
    
    const newLog: ActivityLogItem = {
      id: Date.now(),
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
    const updatedLogs = [newLog, ...currentLogs.slice(0, 199)];
    await saveFirestoreData("esn_activity_logs", updatedLogs);
    
    // Dispatch an event so components listening can update instantly
    window.dispatchEvent(new CustomEvent("esn_activity_logged", { detail: newLog }));
  } catch (err) {
    console.warn("Failed to log activity:", err);
  }
}
