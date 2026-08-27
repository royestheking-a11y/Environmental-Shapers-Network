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
  return [];
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
