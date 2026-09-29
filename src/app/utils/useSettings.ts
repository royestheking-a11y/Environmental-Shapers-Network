import { useState, useEffect } from "react";
import { fetchFirestoreData, useFirestoreData } from "../../lib/useFirestore";

const defaultSettings = {
  siteName: "Environmental Shapers Network",
  tagline: "Shaping Minds, Protecting Earth",
  contactEmail: "enviro.sn@gmail.com",
  officeLocation: "Dhaka, Bangladesh & California, United States of America",
  timezone: "Asia/Dhaka",
  language: "English",
  currency: "USD",
  maintenanceMode: false,
  facebookUrl: "https://facebook.com/EnvironmentalShapersNetwork",
  instagramUrl: "https://instagram.com/esnglobal",
  linkedinUrl: "https://linkedin.com/company/environmental-shapers-network",
  twitterUrl: "https://twitter.com/esnglobal",
  youtubeUrl: "https://youtube.com/@esnglobal",
};

function normalizeSettings(s: any) {
  if (!s) return defaultSettings;
  const contactEmail = (!s.contactEmail || s.contactEmail.includes("esnbd.org") || s.contactEmail.includes("environmentalshapersnetwork.org") || s.contactEmail === "info@esnglobal.org")
    ? "enviro.sn@gmail.com"
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
