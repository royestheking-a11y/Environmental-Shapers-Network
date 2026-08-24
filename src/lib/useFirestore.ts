import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function getLocalCache<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(`esn_cache_${key}`);
    if (item !== null) {
      return JSON.parse(item) as T;
    }
  } catch (e) {
    console.error("LocalCache read error for", key, e);
  }
  return defaultValue;
}

function setLocalCache<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`esn_cache_${key}`, JSON.stringify(value));
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
          const val = docSnap.data().value as T;
          setData(val);
          setLocalCache(key, val);
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
      setLocalCache(key, resolved);
      // Asynchronously sync to Firestore
      const docRef = doc(db, "site_data", key);
      setDoc(docRef, { value: resolved }, { merge: true }).catch((e) => {
        console.error("Firestore write error for key", key, ":", e);
      });
      return resolved;
    });
  };

  return [data, saveData, loading];
}

export async function fetchFirestoreData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const docRef = doc(db, "site_data", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const val = docSnap.data().value as T;
      setLocalCache(key, val);
      return val;
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
  setLocalCache(key, newData);
  try {
    const docRef = doc(db, "site_data", key);
    await setDoc(docRef, { value: newData }, { merge: true });
  } catch (e) {
    console.error("Firestore write error for key", key, ":", e);
  }
}
