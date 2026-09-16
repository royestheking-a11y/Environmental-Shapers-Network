import { useState, useEffect } from "react";
import { fetchFirestoreData, useFirestoreData } from "../../lib/useFirestore";

const defaultSettings = {
  siteName: "Environmental Shapers Network",
  tagline: "Shaping Minds, Protecting Earth",
  contactEmail: "info@esnglobal.org",
  officeLocation: "Dhaka, Bangladesh & California, United States of America",
  timezone: "Asia/Dhaka",
  language: "English",
  currency: "USD",
  maintenanceMode: false,
};

function normalizeSettings(s: any) {
  if (!s) return defaultSettings;
  const contactEmail = (!s.contactEmail || s.contactEmail.includes("esnbd.org") || s.contactEmail.includes("environmentalshapersnetwork.org"))
    ? "info@esnglobal.org"
    : s.contactEmail;
  const officeLocation = !s.officeLocation || s.officeLocation.includes("Global Offices in 12 Countries")
    ? (s.officeLocation ? s.officeLocation : "Dhaka, Bangladesh & California, United States of America")
    : s.officeLocation;
  return {
    ...defaultSettings,
    ...s,
    contactEmail,
    officeLocation: officeLocation || "Dhaka, Bangladesh & California, United States of America",
  };
}

export async function getSavedSettings() {
  try {
    const s = await fetchFirestoreData<any>("esn_settings", defaultSettings);
    return normalizeSettings(s);
  } catch {}
  return defaultSettings;
}

export function useSettings() {
  const [settings] = useFirestoreData<any>("esn_settings", defaultSettings);
  return normalizeSettings(settings);
}
