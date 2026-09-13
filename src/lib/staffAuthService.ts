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
  weeklyTargetHours?: number;
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
      createdAt: "Jan 1, 2026",
      lastLogin: "Active Now",
      department: "Executive & Systems",
      weeklyTargetHours: 40,
    },
    {
      id: 2,
      name: "Imran Hossain",
      email: "imran@esnglobal.org",
      password: "ESN@Imran2026",
      role: "Co-Founder & Executive Lead",
      status: "Active",
      createdAt: "Jan 1, 2026",
      lastLogin: "10 mins ago",
      department: "Executive Leadership",
      weeklyTargetHours: 40,
    },
    {
      id: 3,
      name: "Abu Hanif",
      email: "hanif@esnglobal.org",
      password: "ESN@Hanif2026",
      role: "Co-Founder & Operations Lead",
      status: "Active",
      createdAt: "Jan 1, 2026",
      lastLogin: "30 mins ago",
      department: "Global Operations",
      weeklyTargetHours: 40,
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya@esnglobal.org",
      password: "ESN@Priya2026",
      role: "Climate Policy Researcher",
      status: "Active",
      createdAt: "Jan 15, 2026",
      lastLogin: "2 hours ago",
      department: "Research & Science",
      weeklyTargetHours: 35,
    },
    {
      id: 5,
      name: "Carlos Rodriguez",
      email: "carlos@esnglobal.org",
      password: "ESN@Carlos2026",
      role: "Regional Director, Americas",
      status: "Active",
      createdAt: "Feb 1, 2026",
      lastLogin: "Yesterday",
      department: "Regional Hubs",
      weeklyTargetHours: 40,
    },
    {
      id: 6,
      name: "Amara Osei",
      email: "amara@esnglobal.org",
      password: "ESN@Amara2026",
      role: "Director of Community Programs",
      status: "Active",
      createdAt: "Feb 10, 2026",
      lastLogin: "3 hours ago",
      department: "Community Programs",
      weeklyTargetHours: 40,
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
      department: "Executive & Systems",
      weeklyTargetHours: 40,
    };
  }

  return null;
}
