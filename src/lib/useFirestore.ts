import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function sanitizeData<T>(val: T): T {
  if (val === null || val === undefined) return val;
  try {
    const str = JSON.stringify(val);
    if (
      str.includes("esnbd.org") ||
      str.includes("environmentalshapersnetwork.org") ||
      str.includes("contact@environmentalnetwork.org") ||
      str.includes("privacy@esn.org") ||
      str.includes("legal@esn.org") ||
      str.includes("accessibility@esn.org")
    ) {
      const updated = str
        .replace(/esnbd\.org/g, "esnglobal.org")
        .replace(/@environmentalshapersnetwork\.org/g, "@esnglobal.org")
        .replace(/contact@environmentalnetwork\.org/g, "info@esnglobal.org")
        .replace(/privacy@esn\.org/g, "privacy@esnglobal.org")
        .replace(/legal@esn\.org/g, "legal@esnglobal.org")
        .replace(/accessibility@esn\.org/g, "accessibility@esnglobal.org");
      return JSON.parse(updated) as T;
    }
  } catch {}
  return val;
}

function getLocalCache<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(`esn_cache_${key}`);
    if (item !== null) {
      const parsed = JSON.parse(item) as T;
      return sanitizeData(parsed);
    }
  } catch (e) {
    console.error("LocalCache read error for", key, e);
  }
  return defaultValue;
}

function broadcastUpdate(key: string, value: any): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("esn_data_update", { detail: { key, value } }));
  } catch {}
}

const memoryCache = new Map<string, any>();
const inflightRequests = new Map<string, Promise<any>>();
let firestoreDisabledUntil = 0;

// Key aliases that should always remain mirrored in Firestore
const KEY_ALIASES: Record<string, string> = {
  esn_projects_admin: "esn_projects",
  esn_projects: "esn_projects_admin",
  esn_campaigns_admin: "esn_campaigns",
  esn_campaigns: "esn_campaigns_admin",
  esn_roles: "esn_roles_admin",
  esn_roles_admin: "esn_roles",
  esn_whoweare_admin: "esn_who_we_are_admin",
  esn_who_we_are_admin: "esn_whoweare_admin",
  esn_youth_stats: "esn_youth_stats_admin",
  esn_youth_stats_admin: "esn_youth_stats",
};

export const ESN_FIRESTORE_COLLECTIONS = [
  "esn_about_hero",
  "esn_about_story",
  "esn_about_milestones",
  "esn_about_team",
  "esn_about_vision_mission",
  "esn_about_global_presence",
  "esn_hero_admin",
  "esn_whoweare_admin",
  "esn_whoweare_story",
  "esn_mission_admin",
  "esn_mission_section_admin",
  "esn_stats_admin",
  "esn_thematic_areas_admin",
  "esn_research_admin",
  "esn_youth_initiatives_admin",
  "esn_youth_stats",
  "esn_programs",
  "esn_projects_admin",
  "esn_campaigns_admin",
  "esn_partners_admin",
  "esn_testimonials_admin",
  "esn_faq_admin",
  "esn_events",
  "esn_donations",
  "esn_cms_content",
  "esn_career_jobs",
  "esn_volunteer_roles",
  "esn_apps_volunteer",
  "esn_apps_career",
  "esn_apps_representative",
  "esn_apps_member",
  "esn_apps_partner",
  "esn_messages",
  "esn_newsletters",
  "esn_subscribers",
  "esn_users_admin",
  "esn_staff_users",
  "esn_staff_work_hours",
  "esn_roles",
  "esn_media",
  "esn_settings",
  "esn_activity_logs",
  "esn_notifications",
  "esn_backups"
];

function setLocalCache<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const cleanValue = sanitizeData(value);
    memoryCache.set(key, cleanValue);
    localStorage.setItem(`esn_cache_${key}`, JSON.stringify(cleanValue));
    broadcastUpdate(key, cleanValue);
  } catch (e) {
    console.error("LocalCache write error for", key, e);
  }
}

export function useFirestoreData<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => Promise<boolean>, boolean] {
  const [data, setData] = useState<T>(() => {
    if (memoryCache.has(key)) return memoryCache.get(key);
    const cached = getLocalCache(key, defaultValue);
    memoryCache.set(key, cached);
    return cached;
  });
  const [loading, setLoading] = useState<boolean>(() => !memoryCache.has(key));

  useEffect(() => {
    let isMounted = true;

    // Listen for intra-tab updates from Admin saves
    const handleCustomUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ key: string; value: T }>;
      if (ce.detail && ce.detail.key === key && isMounted) {
        memoryCache.set(key, ce.detail.value);
        setData(ce.detail.value);
        setLoading(false);
      }
    };

    // Listen for cross-tab updates from Admin saves in another tab on the same device
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === `esn_cache_${key}` && e.newValue && isMounted) {
        try {
          const parsed = JSON.parse(e.newValue) as T;
          const clean = sanitizeData(parsed);
          memoryCache.set(key, clean);
          setData(clean);
          setLoading(false);
        } catch {}
      }
    };

    window.addEventListener("esn_data_update", handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    // Skip Firestore if recently timed out or failed with permission error
    const now = Date.now();
    if (now < firestoreDisabledUntil) {
      setLoading(false);
      return () => {
        isMounted = false;
        window.removeEventListener("esn_data_update", handleCustomUpdate);
        window.removeEventListener("storage", handleStorageUpdate);
      };
    }

    const docRef = doc(db, "site_data", key);
    let unsubscribe: (() => void) | undefined;

    // Real-time Firestore synchronization across all devices
    try {
      unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists() && isMounted) {
            const docData = docSnap.data();
            const rawVal = docData?.value !== undefined ? docData.value : docData;
            const cleanVal = sanitizeData(rawVal);
            memoryCache.set(key, cleanVal);
            setData(cleanVal);
            setLocalCache(key, cleanVal);
            setLoading(false);
          } else if (isMounted) {
            // Document does not exist in Firestore yet:
            // Auto-persist the default / local cached content into the main database!
            const fallbackVal = memoryCache.get(key) ?? getLocalCache(key, defaultValue);
            if (fallbackVal !== undefined && fallbackVal !== null) {
              const cleanVal = sanitizeData(fallbackVal);
              setDoc(docRef, { value: cleanVal }, { merge: true }).catch(() => {});
            }
            setLoading(false);
          }
        },
        (error) => {
          if (error.code === "permission-denied") {
            firestoreDisabledUntil = Date.now() + 30000;
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("esn_firestore_permission_denied", {
                  detail: { key, error: error.message }
                })
              );
            }
          }
          if (isMounted) {
            setLoading(false);
          }
        }
      );
    } catch {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener("esn_data_update", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [key]);

  const saveData = async (newDataOrFn: T | ((prev: T) => T)): Promise<boolean> => {
    let cleanResolved: T;
    setData((prev) => {
      const resolved = typeof newDataOrFn === "function" ? (newDataOrFn as (prev: T) => T)(prev) : newDataOrFn;
      cleanResolved = sanitizeData(resolved);
      return cleanResolved;
    });
    if (cleanResolved! !== undefined) {
      return await saveFirestoreData(key, cleanResolved!);
    }
    return false;
  };

  return [data, saveData, loading];
}

export async function fetchFirestoreData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const docRef = doc(db, "site_data", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      const rawVal = docData?.value !== undefined ? docData.value : docData;
      const cleanVal = sanitizeData(rawVal);
      setLocalCache(key, cleanVal);
      if (JSON.stringify(rawVal) !== JSON.stringify(cleanVal)) {
        setDoc(docRef, { value: cleanVal }, { merge: true }).catch(() => {});
      }
      return cleanVal;
    } else {
      const localItem = typeof window !== "undefined" ? localStorage.getItem(`esn_cache_${key}`) : null;
      if (localItem === null) {
        await setDoc(docRef, { value: defaultValue }, { merge: true }).catch(() => {});
        setLocalCache(key, defaultValue);
      } else {
        const cached = getLocalCache(key, defaultValue);
        await setDoc(docRef, { value: cached }, { merge: true }).catch(() => {});
        return cached;
      }
    }
  } catch (e: any) {
    if (e?.code === "permission-denied") {
      firestoreDisabledUntil = Date.now() + 30000;
    }
    return getLocalCache(key, defaultValue);
  }
  return getLocalCache(key, defaultValue);
}

export async function saveFirestoreData<T>(key: string, newData: T): Promise<boolean> {
  const cleanData = sanitizeData(newData);
  setLocalCache(key, cleanData);
  try {
    const docRef = doc(db, "site_data", key);
    await setDoc(docRef, { value: cleanData }, { merge: true });

    // Sync alias key if applicable (e.g. esn_projects <-> esn_projects_admin)
    const aliasKey = KEY_ALIASES[key];
    if (aliasKey) {
      setLocalCache(aliasKey, cleanData);
      const aliasRef = doc(db, "site_data", aliasKey);
      await setDoc(aliasRef, { value: cleanData }, { merge: true }).catch(() => {});
    }

    return true;
  } catch (e: any) {
    console.warn(`[Firestore] Cloud sync error for key "${key}":`, e?.message || e);
    if (e?.code === "permission-denied" && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("esn_firestore_permission_denied", {
          detail: { key, error: e.message }
        })
      );
    }
    return false;
  }
}

/**
 * Push all browser local cache items (esn_cache_*) directly into Cloud Firestore.
 * Useful when the user made local changes and wants to ensure 100% cloud sync.
 */
export async function syncAllLocalToCloud(): Promise<{ synced: string[]; errors: string[] }> {
  const synced: string[] = [];
  const errors: string[] = [];
  if (typeof window === "undefined") return { synced, errors };

  const allLocalKeys = Object.keys(localStorage).filter((k) => k.startsWith("esn_cache_"));
  for (const fullKey of allLocalKeys) {
    const key = fullKey.replace(/^esn_cache_/, "");
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed === null || parsed === undefined) continue;
      const success = await saveFirestoreData(key, parsed);
      if (success) {
        synced.push(key);
      } else {
        errors.push(key);
      }
    } catch (e: any) {
      errors.push(`${key}: ${e?.message || e}`);
    }
  }
  return { synced, errors };
}


