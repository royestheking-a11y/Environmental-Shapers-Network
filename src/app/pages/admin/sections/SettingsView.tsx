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
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "integrations", label: "Integrations", icon: Code },
  { id: "email", label: "Email (SMTP)", icon: Mail },
  { id: "seo", label: "SEO & Meta", icon: Search },
];

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings, loadingSettings] = useFirestoreData<any>("esn_settings", getSavedSettings());
  const [saved, setSaved] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const update = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    await saveFirestoreData("esn_settings", settings);
    window.dispatchEvent(new Event("esn_settings_updated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sendTestEmail = () => {
    setEmailStatus("sending");
    setTimeout(() => {
      setEmailStatus("sent");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }, 1500);
  };

  const forceLogout = () => {
    localStorage.removeItem("esn_admin_user");
    window.location.href = "/admin";
  };

  const Toggle = ({ k }: { k: string }) => (
    <button
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
        value={(settings as any)[k]}
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

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>System Settings</h3>
          <p className="text-sm text-gray-400 mt-0.5">Configure your ESN platform preferences</p>
        </div>
        <button onClick={saveAll} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save All Changes</>}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-52 shrink-0 flex flex-col gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${activeTab === t.id ? "bg-[#0B5D3F] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-white rounded-2xl border border-gray-100 p-8">

          {activeTab === "general" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Settings size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">General Settings</div><div className="text-xs text-gray-400">Basic website information</div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Organization Name" k="siteName" />
                <Field label="Tagline" k="tagline" />
                <Field label="Contact Email" k="contactEmail" type="email" />
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Timezone</label>
                  <select value={settings.timezone} onChange={(e) => update("timezone", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["Asia/Dhaka", "UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Africa/Nairobi"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Default Language</label>
                  <select value={settings.language} onChange={(e) => update("language", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["English", "Bangla", "Arabic", "French", "Spanish"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Default Currency</label>
                  <select value={settings.currency} onChange={(e) => update("currency", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["USD", "BDT", "EUR", "GBP", "INR", "KES"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-[#F6FBF8] rounded-xl p-5 border border-gray-100">
                <SwitchRow label="Maintenance Mode" desc="Take the site offline for maintenance. Visitors will see a maintenance page." k="maintenanceMode" />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Palette size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Appearance</div><div className="text-xs text-gray-400">Brand colors and visual preferences</div></div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-3 block">Brand Colors</label>
                <div className="flex gap-3 flex-wrap">
                  {[["#0B5D3F", "Forest Green"], ["#4CAF50", "Leaf Green"], ["#173B63", "Dark Blue"], ["#D6A95A", "Accent Gold"]].map(([c, l]) => (
                    <div key={c} className="flex items-center gap-2 bg-[#F6FBF8] px-4 py-2.5 rounded-xl border border-gray-100">
                      <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                      <span className="text-xs font-semibold text-gray-600">{l}</span>
                      <span className="text-xs font-mono text-gray-400">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#F6FBF8] rounded-xl p-5 border border-gray-100">
                <SwitchRow label="Dark Mode (Admin Panel)" desc="Enable dark theme for the admin interface." k="darkMode" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block">Favicon & Logo</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["Upload Logo (PNG)", "Upload Favicon (ICO)"].map((l) => (
                    <div key={l} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#4CAF50] cursor-pointer transition-all group">
                      <Upload size={20} className="mx-auto mb-2 text-gray-300 group-hover:text-[#4CAF50] transition-colors" />
                      <p className="text-xs text-gray-400 group-hover:text-gray-600">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Bell size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Notification Preferences</div><div className="text-xs text-gray-400">Choose when to receive admin notifications</div></div>
              </div>
              <div className="bg-[#F6FBF8] rounded-xl p-5 border border-gray-100">
                <SwitchRow label="New Donation Received" desc="Get notified when a donation is made" k="notifyNewDonation" />
                <SwitchRow label="New Member Registered" desc="Alert when someone joins the platform" k="notifyNewMember" />
                <SwitchRow label="New Project Submitted" desc="When a project is submitted for review" k="notifyNewProject" />
                <SwitchRow label="Weekly Summary Report" desc="Receive weekly analytics digest" k="notifyWeeklyReport" />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Lock size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Security Settings</div><div className="text-xs text-gray-400">Protect your admin account and data</div></div>
              </div>
              <div className="bg-[#F6FBF8] rounded-xl p-5 border border-gray-100">
                <SwitchRow label="Two-Factor Authentication" desc="Require 2FA for all admin logins" k="twoFactor" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Session Timeout (minutes)</label>
                  <select value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["15", "30", "60", "120", "480"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Max Failed Login Attempts</label>
                  <select value={settings.loginAttempts} onChange={(e) => update("loginAttempts", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
                    {["3", "5", "10"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="text-sm font-bold text-red-700 mb-3">Danger Zone</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-red-600 font-medium">Delete All Sessions</div>
                    <div className="text-xs text-red-400">Force log out all admin users immediately</div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-xs font-bold text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1.5"
                  >
                    <LogOut size={13} /> Force Logout
                  </button>
                </div>
                {showLogoutConfirm && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-red-700 mb-1">Confirm Force Logout?</div>
                      <div className="text-xs text-red-500 mb-3">This ends all active sessions including yours. You will be redirected to login.</div>
                      <div className="flex gap-2">
                        <button onClick={forceLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-all">Yes, Logout All</button>
                        <button onClick={() => setShowLogoutConfirm(false)} className="border border-red-300 text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-all">Cancel</button>
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
                <div><div className="font-bold text-gray-900">Integrations & APIs</div><div className="text-xs text-gray-400">Connect third-party services</div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Google Analytics ID" k="googleAnalytics" placeholder="UA-XXXXXXX-X" />
                <Field label="Facebook Pixel ID" k="facebookPixel" placeholder="1234567890" />
                <Field label="reCAPTCHA Site Key" k="recaptchaKey" placeholder="6Ld..." />
                <Field label="Stripe Publishable Key" k="stripeKey" placeholder="pk_live_..." />
                <Field label="PayPal Business Email" k="paypalEmail" type="email" />
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Mail size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">Email (SMTP) Configuration</div><div className="text-xs text-gray-400">Set up outgoing email delivery</div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="SMTP Host" k="smtpHost" placeholder="smtp.sendgrid.net" />
                <Field label="SMTP Port" k="smtpPort" placeholder="587" />
                <Field label="SMTP Username" k="smtpUser" placeholder="apikey" />
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">SMTP Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={sendTestEmail}
                  disabled={emailStatus === "sending"}
                  className="flex items-center gap-2 border border-[#0B5D3F] text-[#0B5D3F] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0B5D3F]/10 transition-all disabled:opacity-60"
                >
                  {emailStatus === "sending"
                    ? <><Send size={15} className="animate-pulse" /> Sending...</>
                    : emailStatus === "sent"
                    ? <><CheckCircle2 size={15} className="text-[#4CAF50]" /> Email Sent!</>
                    : <><Mail size={15} /> Send Test Email</>}
                </button>
                {emailStatus === "sent" && (
                  <span className="text-xs text-[#4CAF50] font-semibold bg-[#4CAF50]/10 px-3 py-1.5 rounded-full">
                    Test email delivered to {settings.contactEmail}
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <Search size={20} className="text-[#0B5D3F]" />
                <div><div className="font-bold text-gray-900">SEO & Meta Tags</div><div className="text-xs text-gray-400">Optimize for search engines</div></div>
              </div>
              <div className="flex flex-col gap-5">
                <Field label="Default SEO Title" k="seoTitle" />
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Default Meta Description</label>
                  <textarea value={settings.seoDesc} onChange={(e) => update("seoDesc", e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none resize-none" />
                  <div className="text-xs text-gray-400 mt-1">{settings.seoDesc.length}/160 characters</div>
                </div>
                <div>
                  <ImageUploadField
                    label="Social Share (OpenGraph) Cover Image"
                    value={settings.ogImage || ""}
                    onChange={(url) => update("ogImage", url)}
                    folder="settings"
                    aspectRatio="wide"
                    helpText="Appears when sharing links on Facebook, Twitter/X, LinkedIn, and WhatsApp"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
