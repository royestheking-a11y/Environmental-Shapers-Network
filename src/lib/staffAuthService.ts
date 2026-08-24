import { fetchFirestoreData, saveFirestoreData } from "./useFirestore";

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  department?: string;
}

export function getInitialStaffUsers(): StaffUser[] {
  return [
    {
      id: 1,
      name: "Admin User",
      email: "admin@esnglobal.org",
      password: "ESN@Admin2026",
      role: "Super Admin",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
      createdAt: "Jan 1, 2026",
      lastLogin: "Active Now",
      department: "Executive",
    },
    {
      id: 2,
      name: "Editor User",
      email: "editor@esnglobal.org",
      password: "ESN@Editor2026",
      role: "Content Editor",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
      createdAt: "Jan 15, 2026",
      lastLogin: "2 hours ago",
      department: "Communications",
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      email: "carlos@esnglobal.org",
      password: "ESN@Carlos2026",
      role: "Finance Officer",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
      createdAt: "Feb 1, 2026",
      lastLogin: "Yesterday",
      department: "Finance & Grants",
    },
    {
      id: 4,
      name: "Sarah Jenkins",
      email: "sarah@esnglobal.org",
      password: "ESN@Sarah2026",
      role: "Volunteer Manager",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150",
      createdAt: "Feb 10, 2026",
      lastLogin: "3 days ago",
      department: "Community Programs",
    },
  ];
}

/**
 * Authenticates against both preset accounts and custom staff accounts in Firestore
 */
export async function authenticateStaff(email: string, pass: string): Promise<StaffUser | null> {
  const staffList = await fetchFirestoreData<StaffUser[]>("esn_staff_users", getInitialStaffUsers());
  
  const found = staffList.find(
    (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && (u.password === pass)
  );

  if (found && found.status === "Active") {
    // Update lastLogin
    const updated = staffList.map((u) =>
      u.id === found.id ? { ...u, lastLogin: "Just now" } : u
    );
    await saveFirestoreData("esn_staff_users", updated);
    return found;
  }

  // Check fallback preset admin
  if (email.toLowerCase().trim() === "admin@esnglobal.org" && pass === "ESN@Admin2026") {
    return {
      id: 1,
      name: "Admin User",
      email: "admin@esnglobal.org",
      role: "Super Admin",
      status: "Active",
      createdAt: "Jan 1, 2026",
      lastLogin: "Just now",
    };
  }

  if (email.toLowerCase().trim() === "editor@esnglobal.org" && pass === "ESN@Editor2026") {
    return {
      id: 2,
      name: "Editor User",
      email: "editor@esnglobal.org",
      role: "Content Editor",
      status: "Active",
      createdAt: "Jan 15, 2026",
      lastLogin: "Just now",
    };
  }

  return null;
}
