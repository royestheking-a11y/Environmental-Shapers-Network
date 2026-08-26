import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings, Palette, Bell, Lock, Mail, Shield,
  Search, Code, Save, CheckCircle2, Upload, LogOut, AlertTriangle, Send
} from "lucide-react";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

function getSavedSettings() {
  return {
    siteName: "Environmental Shapers Network",
    tagline: "Shaping Minds, Protecting Earth",
    contactEmail: "info@esnglobal.org",
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
  { id: "appearance", label: "Appearance & Styling", icon: Palette },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "security", label: "Security & Access", icon: Lock },
  { id: "integrations", label: "Integrations & APIs", icon: Code },
];

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

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

  const update = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    await saveFirestoreData("esn_settings", settings);
    window.dispatchEvent(new Event("esn_settings_updated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const forceLogout = () => {
    localStorage.removeItem("esn_admin_user");
    window.location.href = "/admin";
  };

  const Toggle = ({ k }: { k: string }) => (
    <button
      type="button"
      onClick={() => update(k, !(settings as any)[k])}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${(settings as any)[k] ? "bg-[#4CAF50]" : "bg-gray-200"}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${(settings as any)[k] ? "left-6" : "left-0.5"}`} />
    </button>
  );

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
    </div>
  );
}
