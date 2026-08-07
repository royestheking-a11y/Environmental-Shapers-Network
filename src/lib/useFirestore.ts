import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export function useFirestoreData<T>(key: string, defaultValue: T): [T, (val: T) => void, boolean] {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const docRef = doc(db, "site_data", key);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setData(docSnap.data().value as T);
        } else if (isMounted) {
          // Auto-seed the database if it's empty
          await setDoc(docRef, { value: defaultValue }, { merge: true });
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

  const saveData = async (newData: T) => {
    setData(newData); // Optimistic UI update
    try {
      const docRef = doc(db, "site_data", key);
      await setDoc(docRef, { value: newData }, { merge: true });
    } catch (e) {
      console.error("Firestore write error for key", key, ":", e);
    }
  };

  return [data, saveData, loading];
}

export async function fetchFirestoreData<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const docRef = doc(db, "site_data", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().value as T;
    } else {
      await setDoc(docRef, { value: defaultValue }, { merge: true });
    }
  } catch (e) {
    console.error("Firestore read error for key", key, ":", e);
  }
  return defaultValue;
}

export async function saveFirestoreData<T>(key: string, newData: T): Promise<void> {
  try {
    const docRef = doc(db, "site_data", key);
    await setDoc(docRef, { value: newData }, { merge: true });
  } catch (e) {
    console.error("Firestore write error for key", key, ":", e);
  }
}
