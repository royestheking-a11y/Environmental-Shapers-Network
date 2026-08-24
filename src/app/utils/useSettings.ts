import { useState, useEffect } from "react";

const defaultSettings = {
  siteName: "Environmental Shapers Network",
  tagline: "Shaping Minds, Protecting Earth",
  contactEmail: "info@esnglobal.org",
  timezone: "Asia/Dhaka",
  language: "English",
  currency: "USD",
  maintenanceMode: false,
};

import { fetchFirestoreData, useFirestoreData } from "../../lib/useFirestore";

export async function getSavedSettings() {
  try {
    const s = await fetchFirestoreData<any>("esn_settings", defaultSettings);
    if (s) {
      return { ...defaultSettings, ...s };
    }
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings] = useFirestoreData<any>("esn_settings", defaultSettings);
  return settings;
}
