import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

export function useFirestoreData<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void, boolean] {
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

    // Listen for cross-tab updates from Admin saves in another tab
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

    const loadData = async () => {
      try {
        // Deduplicate in-flight requests for the same key across components
        let req = inflightRequests.get(key);
        if (!req) {
          const docRef = doc(db, "site_data", key);
          const fetchPromise = getDoc(docRef);
          // 8000ms timeout so cloud Firestore network delays never hang indefinitely
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 8000)
          );
          req = Promise.race([fetchPromise, timeoutPromise]);
          inflightRequests.set(key, req);
        }

        const docSnap: any = await req;
        inflightRequests.delete(key);

        if (docSnap && docSnap.exists && docSnap.exists() && isMounted) {
          const docData = docSnap.data();
          const rawVal = docData?.value !== undefined ? docData.value : docData;
          const cleanVal = sanitizeData(rawVal);
          memoryCache.set(key, cleanVal);
          setData(cleanVal);
          setLocalCache(key, cleanVal);

          // Auto-migrate in Firestore if legacy domain was present
          if (JSON.stringify(rawVal) !== JSON.stringify(cleanVal)) {
            const docRef = doc(db, "site_data", key);
            setDoc(docRef, { value: cleanVal }, { merge: true }).catch(() => {});
          }
        }
      } catch (e: any) {
        inflightRequests.delete(key);
        // Only throttle remote checks if security permissions explicitly denied
        if (e?.code === "permission-denied") {
          firestoreDisabledUntil = Date.now() + 30000;
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
      window.removeEventListener("esn_data_update", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [key]);

  const saveData = async (newDataOrFn: T | ((prev: T) => T)) => {
    let cleanResolved: T;
    setData((prev) => {
      const resolved = typeof newDataOrFn === "function" ? (newDataOrFn as (prev: T) => T)(prev) : newDataOrFn;
      cleanResolved = sanitizeData(resolved);
      return cleanResolved;
    });
    if (cleanResolved! !== undefined) {
      setLocalCache(key, cleanResolved!);
      try {
        const docRef = doc(db, "site_data", key);
        await setDoc(docRef, { value: cleanResolved! }, { merge: true });
      } catch (e) {
        // Silent catch for offline or restricted Firestore
      }
    }
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
        return getLocalCache(key, defaultValue);
      }
    }
  } catch (e) {
    // Return cached value if available on error
    return getLocalCache(key, defaultValue);
  }
  return getLocalCache(key, defaultValue);
}

export async function saveFirestoreData<T>(key: string, newData: T): Promise<void> {
  const cleanData = sanitizeData(newData);
  setLocalCache(key, cleanData);
  try {
    const docRef = doc(db, "site_data", key);
    await setDoc(docRef, { value: cleanData }, { merge: true });
  } catch (e) {
    // Silent catch
  }
}
