import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Settings, Palette, Bell, Lock, Mail, Shield,
  Search, Code, Save, CheckCircle2, Upload, LogOut, AlertTriangle, Send,
  Database, Cloud, RefreshCw, HardDrive, Check
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

function getSavedSettings() {
  return {
    siteName: "Environmental Shapers Network",
    tagline: "Shaping Minds, Protecting Earth",
    contactEmail: "info@esnglobal.org",
    officeLocation: "Dhaka, Bangladesh & California, United States of America",
    timezone: "Asia/Dhaka",
    language: "English",
    currency: "USD",
    maintenanceMode: false,
    darkMode: false,
    notifyNewDonation: true,
    notifyNewMember: true,
    notifyNewProject: false,
    notifyWeeklyReport: true,
    twoFactor: true,
    sessionTimeout: "60",
    loginAttempts: "5",
    googleAnalytics: "UA-XXXXXXX-X",
    facebookPixel: "",
    recaptchaKey: "",
    stripeKey: "sk_test_...",
    paypalEmail: "payments@esnglobal.org",
    smtpHost: "smtp.sendgrid.net",
    smtpPort: "587",
    smtpUser: "apikey",
    seoTitle: "ESN - Environmental Shapers Network",
    seoDesc: "Global platform for environmental action, innovation, and collaboration.",
    ogImage: "",
  };
}

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "database", label: "Database & Cloud Sync", icon: Database },
  { id: "appearance", label: "Appearance & Styling", icon: Palette },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "security", label: "Security & Access", icon: Lock },
  { id: "integrations", label: "Integrations & APIs", icon: Code },
];

import { useFirestoreData, saveFirestoreData, syncAllLocalToCloud, ESN_FIRESTORE_COLLECTIONS } from "../../../../lib/useFirestore";
import { logAdminActivity } from "../../../../lib/activityLogger";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useFirestoreData<any>("esn_settings", {
    ...getSavedSettings(),
    primaryColor: "#0B5D3F",
    headerStyle: "floating",
    borderRadius: "rounded-2xl",
    enableAnimations: true,
    audioAlerts: true,
    logoUrl: "",
    notifyRepresentative: true,
    notifyCareer: true,
  });
  const [saved, setSaved] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncSummary, setSyncSummary] = useState<{ synced: string[]; errors: string[] } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const handleSyncAllToCloud = async () => {
    setSyncingCloud(true);
    setSyncSummary(null);
    try {
      const res = await syncAllLocalToCloud();
      setSyncSummary(res);
      await logAdminActivity("Database Cloud Sync", "System", `Synchronized ${res.synced.length} collections from local cache to Cloud Firestore.`, "success");
    } catch (e: any) {
      setSyncSummary({ synced: [], errors: [e?.message || "Sync failed"] });
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const testDoc = { ping: "ok", checkedAt: new Date().toISOString() };
      const success = await saveFirestoreData("esn_test_connection", testDoc);
      if (success) {
        setConnectionStatus("✔ Connected! Cloud Firestore accepted read & write queries.");
      } else {
        setConnectionStatus("❌ Firestore connection failed or write permissions denied.");
      }
    } catch (e: any) {
      setConnectionStatus(`❌ Error: ${e?.message || e}`);
    } finally {
      setTestingConnection(false);
      setTimeout(() => setConnectionStatus(null), 6000);
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      setSyncWarning(
        "Notice: Cloud Firestore access was denied (Permission Denied). Changes are currently saved in this browser only and will NOT sync to other devices until Firestore rules are updated in Firebase Console."
      );
    };
    window.addEventListener("esn_firestore_permission_denied", handler);
    return () => window.removeEventListener("esn_firestore_permission_denied", handler);
  }, []);

  const update = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    const synced = await saveFirestoreData("esn_settings", settings);
    await logAdminActivity("Updated Settings", "Settings", "Updated platform general settings and configurations.", "success");
    window.dispatchEvent(new Event("esn_settings_updated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (!synced) {
      setSyncWarning(
        "Notice: Settings saved locally on this device, but Cloud Firestore rejected the sync (Permission Denied). Please update Firestore Security Rules in Firebase Console so changes reach all devices."
      );
    } else {
      setSyncWarning(null);
    }
  };

  const forceLogout = async () => {
    try {
      await logAdminActivity("Staff Logged Out", "Auth", "Admin logged out of the session.", "info");
    } catch {}
    localStorage.removeItem("esn_admin_user");
    window.location.href = "/admin";
  };

  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);

  const handleToggleMaintenance = async () => {
    if (!settings.maintenanceMode) {
      setShowMaintenanceConfirm(true);
    } else {
      const updated = { ...settings, maintenanceMode: false };
      setSettings(updated);
      const synced = await saveFirestoreData("esn_settings", updated);
      await logAdminActivity("Disabled Maintenance Mode", "Settings", "Turned off maintenance mode for the public website.", "success");
      window.dispatchEvent(new Event("esn_settings_updated"));
      if (!synced) {
        setSyncWarning(
          "Notice: Maintenance Mode was turned off on THIS device, but could not sync to Cloud Firestore (Permission Denied). Please update Firestore Security Rules in Firebase Console so all devices sync."
        );
      } else {
        setSyncWarning(null);
      }
    }
  };

  const confirmEnableMaintenance = async () => {
    const updated = { ...settings, maintenanceMode: true };
    setSettings(updated);
    const synced = await saveFirestoreData("esn_settings", updated);
    await logAdminActivity("Enabled Maintenance Mode", "Settings", "Activated maintenance mode for the public website.", "warning");
    window.dispatchEvent(new Event("esn_settings_updated"));
    setShowMaintenanceConfirm(false);
    if (!synced) {
      setSyncWarning(
        "Notice: Maintenance Mode was enabled on THIS device, but could not sync to Cloud Firestore (Permission Denied). Please update Firestore Security Rules in Firebase Console so it activates on other devices."
      );
    } else {
      setSyncWarning(null);
    }
  };

  const Toggle = ({ k }: { k: string }) => {
    if (k === "maintenanceMode") {
      return (
        <button
          type="button"
          onClick={handleToggleMaintenance}
          className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${settings?.maintenanceMode ? "bg-amber-500" : "bg-gray-200"}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${settings?.maintenanceMode ? "left-6" : "left-0.5"}`} />
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => update(k, !(settings as any)[k])}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${(settings as any)[k] ? "bg-[#4CAF50]" : "bg-gray-200"}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${(settings as any)[k] ? "left-6" : "left-0.5"}`} />
      </button>
    );
  };

  const Field = ({ label, k, type = "text", placeholder = "" }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs font-bold text-gray-600 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={(settings as any)[k] || ""}
        onChange={(e) => update(k, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors"
      />
    </div>
  );

  const SwitchRow = ({ label, desc, k }: { label: string; desc?: string; k: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
      </div>
      <Toggle k={k} />
    </div>
  );

  const colorThemes = [
    { name: "Forest Emerald (Default)", hex: "#0B5D3F", secondary: "#4CAF50" },
    { name: "Lush Rainforest", hex: "#004D40", secondary: "#26A69A" },
    { name: "Ocean Marine", hex: "#0A4368", secondary: "#0288D1" },
    { name: "Earth Amber", hex: "#78350F", secondary: "#D97706" },
    { name: "Deep Charcoal", hex: "#1E293B", secondary: "#64748B" },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform System Settings</h3>
          <p className="text-sm text-gray-400 mt-0.5">Global organization parameters, visual styling & live system preferences</p>
        </div>
        <button
          onClick={saveAll}
          className="flex items-center gap-2 bg-[#0B5D3F] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all shadow-md"
        >
          {saved ? <><CheckCircle2 size={15} /> Settings Saved!</> : <><Save size={15} /> Save All Changes</>}
        </button>
      </div>

      {syncWarning && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div className="text-xs space-y-1.5 flex-1">
            <div className="font-bold text-sm text-amber-950">Cloud Sync Notice (Firestore Permissions)</div>
            <p className="leading-relaxed">{syncWarning}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-medium">
              <span>Fix steps: Open</span>
              <a
                href="https://console.firebase.google.com/project/environmental-shapers-network/firestore/rules"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-amber-950 hover:text-black"
              >
                Firebase Console Firestore Rules
              </a>
              <span>and paste the rules from the project's <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">firestore.rules</code> file.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSyncWarning(null)}
            className="text-amber-700 hover:text-black font-bold text-sm px-1.5 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-56 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left whitespace-nowrap ${
                activeTab === t.id ? "bg-[#0B5D3F] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 bg-white md:bg-transparent"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
        >
          {activeTab === "general" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Settings size={20} className="text-[#0B5D3F]" />
                <div>
                  <div className="font-bold text-gray-900">Organization & General Profile</div>
                  <div className="text-xs text-gray-400">Core parameters and localization</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Organization Name" k="siteName" />
                <Field label="Platform Tagline" k="tagline" />
                <Field label="Official Contact Email" k="contactEmail" type="email" />
                <Field label="Global Offices / Location (Footer)" k="officeLocation" placeholder="Dhaka, Bangladesh & California, United States of America" />
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Default Timezone</label>
                  <select
                    value={settings.timezone || "Asia/Dhaka"}
                    onChange={(e) => update("timezone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold"
                  >
                    {["Asia/Dhaka", "UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Africa/Nairobi"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Primary Language</label>
                  <select
                    value={settings.language || "English"}
                    onChange={(e) => update("language", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold"
                  >
                    {["English", "Bangla", "Arabic", "French", "Spanish"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Donation Currency</label>
                  <select
                    value={settings.currency || "USD"}
                    onChange={(e) => update("currency", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold"
                  >
                    {["USD", "BDT", "EUR", "GBP", "INR", "KES"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100">
                <SwitchRow label="Maintenance Mode" desc="Take the public website offline for scheduled updates. Admin dashboard remains accessible." k="maintenanceMode" />
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Database size={20} className="text-[#0B5D3F]" />
                  <div>
                    <div className="font-bold text-gray-900">Database & Cloud Persistence</div>
                    <div className="text-xs text-gray-400">Manage Cloud Firestore synchronization, cache migration, and connection health</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw size={13} className={testingConnection ? "animate-spin" : ""} />
                    {testingConnection ? "Testing..." : "Test Connection"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncAllToCloud}
                    disabled={syncingCloud}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0B5D3F] text-white text-xs font-bold hover:bg-[#0a5237] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Cloud size={14} className={syncingCloud ? "animate-pulse" : ""} />
                    {syncingCloud ? "Syncing All to Cloud..." : "Push Local Storage to Cloud"}
                  </button>
                </div>
              </div>

              {connectionStatus && (
                <div className={`p-4 rounded-2xl text-xs font-bold border ${connectionStatus.startsWith("✔") ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"}`}>
                  {connectionStatus}
                </div>
              )}

              {syncSummary && (
                <div className="bg-[#F6FBF8] border border-emerald-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                    <CheckCircle2 size={16} /> Cloud Synchronization Completed
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Successfully pushed <strong>{syncSummary.synced.length}</strong> collections from your browser's local cache directly into Cloud Firestore:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-white rounded-xl border border-emerald-100 font-mono text-[11px] text-gray-700">
                    {syncSummary.synced.map((k) => (
                      <span key={k} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                        {k}
                      </span>
                    ))}
                  </div>
                  {syncSummary.errors.length > 0 && (
                    <div className="mt-3 text-xs text-red-600">
                      <strong>Errors encountered ({syncSummary.errors.length}):</strong> {syncSummary.errors.join(", ")}
                    </div>
                  )}
                </div>
              )}

              {/* Status Info Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F6FBF8] border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Database Service</div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Google Cloud Firestore
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">Project: environmental-shapers-network</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F6FBF8] border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Target Collection</div>
                  <div className="text-sm font-bold text-gray-900 font-mono">site_data</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Global key-value documents</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F6FBF8] border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Multi-Device Sync</div>
                  <div className="text-sm font-bold text-emerald-700">Real-time (onSnapshot)</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Auto cloud persistence active</div>
                </div>
              </div>

              {/* Collections Inventory */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Official Firestore Collections Inventory ({ESN_FIRESTORE_COLLECTIONS.length} Collections)
                  </h4>
                  <span className="text-[11px] text-gray-400 font-medium">All collections backed by Cloud Firestore</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {ESN_FIRESTORE_COLLECTIONS.map((c) => (
                    <div key={c} className="p-2.5 rounded-xl border border-gray-100 bg-[#FAFCFA] flex items-center justify-between text-xs">
                      <span className="font-mono text-gray-700 text-[11px] truncate max-w-[180px]" title={c}>{c}</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        <Check size={10} /> Cloud Sync
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Palette size={20} className="text-[#0B5D3F]" />
                <div>
                  <div className="font-bold text-gray-900">Appearance & Visual Identity</div>
                  <div className="text-xs text-gray-400">Customize brand themes, layout styles, and dashboard visuals</div>
                </div>
              </div>

              {/* Theme Presets */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2.5 block">Primary Color Theme</label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {colorThemes.map((t) => (
                    <button
                      key={t.hex}
                      type="button"
                      onClick={() => update("primaryColor", t.hex)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        settings.primaryColor === t.hex ? "border-[#0B5D3F] bg-[#0B5D3F]/5 ring-2 ring-[#0B5D3F]/20" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl shadow-inner flex items-center justify-center shrink-0" style={{ backgroundColor: t.hex }}>
                        {settings.primaryColor === t.hex && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">{t.name}</div>
                        <div className="text-[10px] font-mono text-gray-400">{t.hex}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Style */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2.5 block">Public Header Layout Style</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: "floating", label: "Floating Glassmorphic", desc: "Rounded floating pill with glass backdrop" },
                    { id: "solid", label: "Solid Clean Navbar", desc: "Full-width top navigation bar" },
                    { id: "minimal", label: "Minimal Transparent", desc: "Transparent overlay with sticky scroll" },
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => update("headerStyle", h.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        (settings.headerStyle || "floating") === h.id ? "border-[#0B5D3F] bg-[#0B5D3F]/5 ring-2 ring-[#0B5D3F]/20" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900 mb-1">{h.label}</div>
                      <div className="text-[11px] text-gray-500">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <ImageUploadField
                  label="Network Official Brand Logo"
                  value={settings.logoUrl || ""}
                  onChange={(url) => update("logoUrl", url)}
                  folder="branding"
                  aspectRatio="square"
                  helpText="Upload PNG, SVG, or high-resolution logo for headers and platform footer"
                />
              </div>

              {/* Switches */}
              <div className="bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100 divide-y divide-gray-100">
                <SwitchRow label="Dark Theme (Admin Panel)" desc="Switch admin dashboard interface to sleek dark palette." k="darkMode" />
                <SwitchRow label="Smooth Micro-Animations" desc="Enable fluid Framer Motion transitions and floating visual effects." k="enableAnimations" />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Bell size={20} className="text-[#0B5D3F]" />
                <div>
                  <div className="font-bold text-gray-900">Notification Preferences & Alerts</div>
                  <div className="text-xs text-gray-400">Configure instant alerts for donor activity and application funnels</div>
                </div>
              </div>
              <div className="bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100 divide-y divide-gray-100">
                <SwitchRow label="New Donation Verified" desc="Instant alert when a supporter successfully completes a donation transaction" k="notifyNewDonation" />
                <SwitchRow label="Volunteer Application Submitted" desc="Notify reviewers whenever a new volunteer registers on the platform" k="notifyNewMember" />
                <SwitchRow label="Career Position Application" desc="Notify HR/Hiring team when a job resume is submitted" k="notifyCareer" />
                <SwitchRow label="Global Representative Application" desc="Alert leadership when an international country ambassador applies" k="notifyRepresentative" />
                <SwitchRow label="Weekly Analytics Summary" desc="Receive consolidated platform growth digests every Monday" k="notifyWeeklyReport" />
                <SwitchRow label="Audio Chime Notifications" desc="Play a subtle sound in admin dashboard when new real-time activity arrives" k="audioAlerts" />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Lock size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Security & Access Management</div><div className="text-xs text-gray-400">Session policies and administrative credentials</div></div>
              </div>
              <div className="bg-[#F6FBF8] rounded-2xl p-5 border border-gray-100">
                <SwitchRow label="Two-Factor Authentication (2FA)" desc="Require verified 2FA authentication on administrative logins" k="twoFactor" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Session Timeout (minutes)</label>
                  <select value={settings.sessionTimeout || "60"} onChange={(e) => update("sessionTimeout", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold">
                    {["15", "30", "60", "120", "480"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Max Failed Login Attempts</label>
                  <select value={settings.loginAttempts || "5"} onChange={(e) => update("loginAttempts", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none font-bold">
                    {["3", "5", "10"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="text-sm font-bold text-red-700 mb-2">Danger Zone</div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-red-600 font-bold">Terminate All Active Admin Sessions</div>
                    <div className="text-xs text-red-400">Force disconnect all current sessions across all devices</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-xs font-bold text-red-600 border border-red-300 bg-white px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <LogOut size={13} /> Force Logout All
                  </button>
                </div>
                {showLogoutConfirm && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-red-700 mb-1">Confirm Force Logout?</div>
                      <div className="text-xs text-red-500 mb-3">This immediately ends all sessions and redirects you to the login screen.</div>
                      <div className="flex gap-2">
                        <button type="button" onClick={forceLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-all">Yes, Terminate</button>
                        <button type="button" onClick={() => setShowLogoutConfirm(false)} className="border border-red-300 bg-white text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-all">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Code size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Integrations & API Gateways</div><div className="text-xs text-gray-400">Connect analytics, security, and payment gateways</div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Google Analytics Tracking ID" k="googleAnalytics" placeholder="G-XXXXXXXXXX" />
                <Field label="Meta / Facebook Pixel ID" k="facebookPixel" placeholder="1234567890" />
                <Field label="Google reCAPTCHA v3 Key" k="recaptchaKey" placeholder="6Ld..." />
                <Field label="Stripe Publishable API Key" k="stripeKey" placeholder="pk_live_..." />
                <Field label="PayPal Merchant Email" k="paypalEmail" type="email" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      {showMaintenanceConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Enable Maintenance Mode?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Taking the platform offline will display the <strong>Scheduled Maintenance</strong> page to all public visitors. You will still be able to preview and browse the live site because you are logged in as an Admin.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowMaintenanceConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmEnableMaintenance}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-md"
              >
                Yes, Enable Maintenance Mode
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
