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

function setLocalCache<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const cleanValue = sanitizeData(value);
    localStorage.setItem(`esn_cache_${key}`, JSON.stringify(cleanValue));
  } catch (e) {
    console.error("LocalCache write error for", key, e);
  }
}

export function useFirestoreData<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void, boolean] {
  const [data, setData] = useState<T>(() => getLocalCache(key, defaultValue));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const docRef = doc(db, "site_data", key);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          const rawVal = docSnap.data().value as T;
          const cleanVal = sanitizeData(rawVal);
          setData(cleanVal);
          setLocalCache(key, cleanVal);
          
          // Auto-migrate in Firestore if legacy domain was present
          if (JSON.stringify(rawVal) !== JSON.stringify(cleanVal)) {
            setDoc(docRef, { value: cleanVal }, { merge: true }).catch(() => {});
          }
        } else if (isMounted) {
          // Auto-seed the database if it's empty
          await setDoc(docRef, { value: defaultValue }, { merge: true });
          setLocalCache(key, defaultValue);
        }
      } catch (e) {
        console.error("Firestore read error for key", key, ":", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [key]);

  const saveData = async (newDataOrFn: T | ((prev: T) => T)) => {
    setData((prev) => {
      const resolved = typeof newDataOrFn === "function" ? (newDataOrFn as (prev: T) => T)(prev) : newDataOrFn;
      const cleanResolved = sanitizeData(resolved);
      setLocalCache(key, cleanResolved);
      // Asynchronously sync to Firestore
      const docRef = doc(db, "site_data", key);
      setDoc(docRef, { value: cleanResolved }, { merge: true }).catch((e) => {
        console.error("Firestore write error for key", key, ":", e);
      });
      return cleanResolved;
    });
  };

  return [data, saveData, loading];
}

export async function fetchFirestoreData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const docRef = doc(db, "site_data", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const rawVal = docSnap.data().value as T;
      const cleanVal = sanitizeData(rawVal);
      setLocalCache(key, cleanVal);
      if (JSON.stringify(rawVal) !== JSON.stringify(cleanVal)) {
        setDoc(docRef, { value: cleanVal }, { merge: true }).catch(() => {});
      }
      return cleanVal;
    } else {
      await setDoc(docRef, { value: defaultValue }, { merge: true });
      setLocalCache(key, defaultValue);
    }
  } catch (e) {
    console.error("Firestore read error for key", key, ":", e);
    // Return cached value if available on error
    return getLocalCache(key, defaultValue);
  }
  return defaultValue;
}

export async function saveFirestoreData<T>(key: string, newData: T): Promise<void> {
  const cleanData = sanitizeData(newData);
  setLocalCache(key, cleanData);
  try {
    const docRef = doc(db, "site_data", key);
    await setDoc(docRef, { value: cleanData }, { merge: true });
  } catch (e) {
    console.error("Firestore write error for key", key, ":", e);
  }
}
