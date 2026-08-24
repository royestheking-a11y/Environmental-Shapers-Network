import { fetchFirestoreData, saveFirestoreData } from "./useFirestore";

export interface AdminNotification {
  id: string | number;
  title: string;
  message: string;
  category: "Donation" | "Application" | "Message" | "Project" | "Campaign" | "Security" | "System";
  timestamp: string;
  isoDate: string;
  read: boolean;
  link?: string;
  iconType: "heart" | "user" | "mail" | "shield" | "alert" | "sparkles" | "bell";
  priority?: "high" | "normal" | "low";
}

export function getInitialNotifications(): AdminNotification[] {
  return [
    {
      id: 1,
      title: "New Major Donation",
      message: "Received $2,500 contribution for the Amazon Reforestation Project.",
      category: "Donation",
      timestamp: "5 mins ago",
      isoDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      link: "/admin/dashboard/donations",
      iconType: "heart",
      priority: "high",
    },
    {
      id: 2,
      title: "New Volunteer Application",
      message: "Priya Sharma from India submitted a Youth Climate Leader application.",
      category: "Application",
      timestamp: "25 mins ago",
      isoDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: false,
      link: "/admin/dashboard/applications",
      iconType: "user",
      priority: "normal",
    },
    {
      id: 3,
      title: "New Partnership Inquiry",
      message: "Nordic Climate Alliance sent a message via the Contact portal.",
      category: "Message",
      timestamp: "1 hour ago",
      isoDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
      link: "/admin/dashboard/messages",
      iconType: "mail",
      priority: "normal",
    },
    {
      id: 4,
      title: "Security & Login Notice",
      message: "Staff member Carlos Rodriguez signed in with Finance Officer role.",
      category: "Security",
      timestamp: "3 hours ago",
      isoDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      read: true,
      link: "/admin/dashboard/roles",
      iconType: "shield",
      priority: "low",
    },
    {
      id: 5,
      title: "Campaign Milestone Reached",
      message: "'Clean Ocean Initiative 2026' just passed $375,000 (75% of target).",
      category: "Campaign",
      timestamp: "5 hours ago",
      isoDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      read: true,
      link: "/admin/dashboard/campaigns",
      iconType: "sparkles",
      priority: "normal",
    },
  ];
}

/**
 * Creates and stores a new notification in Firestore
 */
export async function pushNotification(
  notification: Omit<AdminNotification, "id" | "isoDate" | "timestamp" | "read"> & {
    id?: string | number;
    timestamp?: string;
  }
): Promise<void> {
  try {
    const list = await fetchFirestoreData<AdminNotification[]>("esn_notifications", getInitialNotifications());
    const newNotif: AdminNotification = {
      id: notification.id || Date.now(),
      title: notification.title,
      message: notification.message,
      category: notification.category,
      link: notification.link,
      iconType: notification.iconType,
      priority: notification.priority || "normal",
      read: false,
      timestamp: notification.timestamp || "Just now",
      isoDate: new Date().toISOString(),
    };

    const updated = [newNotif, ...list.slice(0, 49)];
    await saveFirestoreData("esn_notifications", updated);
    window.dispatchEvent(new CustomEvent("esn_notification_received", { detail: newNotif }));
  } catch (err) {
    console.warn("Failed to push notification:", err);
  }
}
