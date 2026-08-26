import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database, Download, Upload, RefreshCw, Shield, Clock,
  CheckCircle2, AlertCircle, HardDrive, Server, Cloud,
  Archive, Trash2, Play, RotateCcw, FileText,
  TrendingUp, Lock
} from "lucide-react";

interface BackupEntry {
  id: number;
  name: string;
  type: "auto" | "manual";
  size: string;
  date: string;
  time: string;
  status: "success" | "failed" | "running";
  tables: number;
}

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

function getInitialBackups(): BackupEntry[] {
  return [
    { id: 1, name: "esn_backup_20260727_0300", type: "auto", size: "48.2 MB", date: "Jul 27, 2026", time: "03:00 AM", status: "success", tables: 24 },
    { id: 2, name: "esn_backup_20260726_0300", type: "auto", size: "47.9 MB", date: "Jul 26, 2026", time: "03:00 AM", status: "success", tables: 24 },
    { id: 3, name: "esn_manual_20260725_1430", type: "manual", size: "47.5 MB", date: "Jul 25, 2026", time: "02:30 PM", status: "success", tables: 24 },
    { id: 4, name: "esn_backup_20260725_0300", type: "auto", size: "47.3 MB", date: "Jul 25, 2026", time: "03:00 AM", status: "success", tables: 24 },
    { id: 5, name: "esn_backup_20260724_0300", type: "auto", size: "46.8 MB", date: "Jul 24, 2026", time: "03:00 AM", status: "failed", tables: 0 },
    { id: 6, name: "esn_manual_20260720_1200", type: "manual", size: "45.1 MB", date: "Jul 20, 2026", time: "12:00 PM", status: "success", tables: 23 },
  ];
}

function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const dbStats = [
  { label: "Total Records", value: "2.4M", icon: Database, color: "#0B5D3F" },
  { label: "Storage Used", value: "48.2 MB", icon: HardDrive, color: "#173B63" },
  { label: "Tables", value: "24", icon: Server, color: "#4CAF50" },
  { label: "Last Backup", value: "3h ago", icon: Clock, color: "#D6A95A" },
];

export function DataBackupView() {
  const [backups, setBackups, loadingBackups] = useFirestoreData<BackupEntry[]>("esn_backups", getInitialBackups());
  const [running, setRunning] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState("daily");
  const [retentionDays, setRetentionDays] = useState("30");
  const [confirmRestore, setConfirmRestore] = useState<BackupEntry | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);

  const saveList = async (list: BackupEntry[]) => {
    setBackups(list);
    await saveFirestoreData("esn_backups", list);
  };

  const runBackup = async () => {
    setRunning(true);
    
    // Fetch live data from all collections
    const collections = [
      "esn_projects", "esn_campaigns", "esn_donations", "esn_newsletters",
      "esn_subscribers", "esn_apps_volunteer", "esn_apps_career",
      "esn_apps_representative", "esn_apps_member", "esn_apps_partner",
      "esn_career_jobs", "esn_volunteer_roles", "esn_settings", "esn_stats"
    ];

    const snapshot: Record<string, any> = {
      backupTimestamp: new Date().toISOString(),
      platform: "Environmental Shapers Network",
      version: "2.4.0",
      collections: {}
    };

    for (const key of collections) {
      try {
        snapshot.collections[key] = await fetchFirestoreData<any>(key, []);
      } catch {
        snapshot.collections[key] = [];
      }
    }

    const jsonString = JSON.stringify(snapshot, null, 2);
    const sizeKB = (new Blob([jsonString]).size / 1024).toFixed(1);

    const newBackup: BackupEntry = {
      id: Date.now(),
      name: `esn_snapshot_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${Date.now().toString().slice(-4)}`,
      type: "manual",
      size: `${sizeKB} KB`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      status: "success",
      tables: collections.length,
    };

    const updated = [newBackup, ...backups];
    saveList(updated);
    
    // Automatically trigger real backup file download
    downloadJSON(snapshot, `${newBackup.name}.json`);

    setRunning(false);
  };

  const saveBackupSettings = async () => {
    await saveFirestoreData("esn_backup_settings", { autoBackup, backupFreq, retentionDays });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.collections) {
          for (const [key, data] of Object.entries(parsed.collections)) {
            await saveFirestoreData(key, data);
          }
          setRestoreSuccess(`Restored ${Object.keys(parsed.collections).length} tables from ${file.name}`);
          setTimeout(() => setRestoreSuccess(null), 5000);
        } else {
          alert("Invalid backup file structure.");
        }
      } catch {
        alert("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  };

  const exportAllBackups = async () => {
    runBackup();
  };

  const exportModuleData = async (label: string, format: "CSV" | "JSON" | "PDF") => {
    let key = "esn_projects";
    if (label.includes("Volunteer")) key = "esn_apps_volunteer";
    if (label.includes("Career")) key = "esn_apps_career";
    if (label.includes("Donation")) key = "esn_donations";
    if (label.includes("Subscriber") || label.includes("Newsletter")) key = "esn_newsletters";
    if (label.includes("Representative")) key = "esn_apps_representative";

    const data = await fetchFirestoreData<any[]>(key, []);

    if (format === "CSV") {
      const headers = Object.keys(data[0] || { id: 1, title: "Item" });
      const rows = data.map(item => headers.map(h => String(item[h] || "-")));
      downloadCSV([headers, ...rows], `esn_${label.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`);
    } else if (format === "JSON") {
      downloadJSON({ module: label, count: data.length, exportedAt: new Date().toISOString(), data }, `esn_${label.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.json`);
    } else {
      const content = `ESN ${label} Official Report\nGenerated: ${new Date().toLocaleString()}\nRecords: ${data.length}\n\n` + JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `esn_${label.toLowerCase().replace(/\s+/g, "_")}_report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const downloadBackupEntry = (b: BackupEntry) => {
    runBackup();
  };

  const doRestore = () => {
    if (!confirmRestore) return;
    const name = confirmRestore.name;
    setConfirmRestore(null);
    setRestoreSuccess(`Restored configuration for ${name}`);
    setTimeout(() => setRestoreSuccess(null), 4000);
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Database Backup & Restoration</h3>
          <p className="text-sm text-gray-400 mt-0.5">Live full snapshot backups, JSON exports, and file restore</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-sm">
            <Upload size={14} className="text-[#0B5D3F]" /> Restore JSON File
            <input type="file" accept=".json" onChange={handleFileUploadRestore} className="hidden" />
          </label>
          <button
            onClick={runBackup}
            disabled={running}
            className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a5237] transition-all disabled:opacity-60 shadow-sm"
          >
            {running ? <><RefreshCw size={14} className="animate-spin" /> Creating Backup...</> : <><Play size={14} /> Create Snapshot Backup</>}
          </button>
        </div>
      </div>

      {/* Restore success toast */}
      <AnimatePresence>
        {restoreSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-xl px-5 py-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#4CAF50] shrink-0" />
            <div>
              <div className="text-sm font-bold text-[#0B5D3F]">Restore Simulated Successfully</div>
              <div className="text-xs text-gray-500 font-mono">{restoreSuccess}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DB Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dbStats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings & Backup List Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Backup Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="w-10 h-10 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-[#0B5D3F]" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Backup Settings</div>
              <div className="text-xs text-gray-400">Auto backup configuration</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">Automatic Backup</div>
              <div className="text-xs text-gray-400">Runs on schedule</div>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${autoBackup ? "bg-[#4CAF50]" : "bg-gray-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${autoBackup ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">Backup Frequency</label>
            <select value={backupFreq} onChange={(e) => setBackupFreq(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily (3:00 AM)</option>
              <option value="weekly">Weekly (Sunday)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">Retention Period</label>
            <select value={retentionDays} onChange={(e) => setRetentionDays(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none">
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-2 block">Storage Location</label>
            <div className="flex flex-col gap-2">
              {["Local Server", "Cloud Storage (S3)", "Google Drive"].map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" name="storage" defaultChecked={loc === "Cloud Storage (S3)"} className="accent-[#4CAF50]" />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={saveBackupSettings}
            className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all"
          >
            {settingsSaved ? <><CheckCircle2 size={15} /> Saved!</> : "Save Settings"}
          </button>
        </div>

        {/* Backup History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div className="font-bold text-gray-900">Backup History</div>
            <div className="flex gap-2">
              <button
                onClick={exportAllBackups}
                className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#0B5D3F] transition-all"
              >
                <Download size={12} /> Export All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {backups.map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F6FBF8]/50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${b.status === "success" ? "bg-[#4CAF50]/10" : b.status === "running" ? "bg-[#D6A95A]/10" : "bg-red-50"}`}>
                  {b.status === "success" ? <CheckCircle2 size={18} className="text-[#4CAF50]" /> :
                   b.status === "running" ? <RefreshCw size={18} className="text-[#D6A95A] animate-spin" /> :
                   <AlertCircle size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 font-mono truncate">{b.name}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{b.date}, {b.time}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${b.type === "auto" ? "bg-[#0B5D3F]/10 text-[#0B5D3F]" : "bg-[#173B63]/10 text-[#173B63]"}`}>{b.type}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-gray-700">{b.size}</div>
                  <div className="text-xs text-gray-400">{b.tables} tables</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => setConfirmRestore(b)} disabled={b.status !== "success"} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] disabled:opacity-30 transition-all" title="Restore">
                    <RotateCcw size={14} />
                  </button>
                  <button onClick={() => downloadBackupEntry(b)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-all" title="Download">
                    <Download size={14} />
                  </button>
                  <button onClick={() => saveList(backups.filter(x => x.id !== b.id))} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Export Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#173B63]/10 rounded-xl flex items-center justify-center">
            <Archive size={18} className="text-[#173B63]" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Data Export</div>
            <div className="text-xs text-gray-400">Export specific data modules as CSV, JSON, or PDF</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Users & Members", format: "CSV" as const, icon: Database, color: "#0B5D3F" },
            { label: "All Donations", format: "CSV" as const, icon: TrendingUp, color: "#4CAF50" },
            { label: "Projects Data", format: "JSON" as const, icon: Server, color: "#173B63" },
            { label: "Impact Reports", format: "PDF" as const, icon: FileText, color: "#D6A95A" },
          ].map((e) => (
            <div key={e.label} className="flex items-center justify-between bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: e.color + "15" }}>
                  <e.icon size={16} style={{ color: e.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-700">{e.label}</div>
                  <div className="text-xs text-gray-400">{e.format}</div>
                </div>
              </div>
              <button
                onClick={() => exportModuleData(e.label, e.format)}
                className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#0B5D3F] hover:text-white hover:border-[#0B5D3F] transition-all text-gray-400"
              >
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Restore Confirm Modal */}
      <AnimatePresence>
        {confirmRestore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="w-16 h-16 bg-[#D6A95A]/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={30} className="text-[#D6A95A]" />
              </div>
              <h4 className="font-black text-gray-900 text-center mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Restore Backup?</h4>
              <p className="text-sm text-gray-500 text-center mb-1">This will overwrite all current data with:</p>
              <p className="text-sm font-mono font-bold text-[#0B5D3F] text-center mb-5">{confirmRestore.name}</p>
              <div className="bg-[#D6A95A]/10 border border-[#D6A95A]/30 rounded-xl p-4 mb-6 text-xs text-[#9E6B3C]">
                <strong>Warning:</strong> This action cannot be undone. All data created after {confirmRestore.date} at {confirmRestore.time} will be permanently lost.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={doRestore}
                  className="flex-1 bg-[#D6A95A] text-white py-3 rounded-xl font-semibold hover:bg-[#c49a4a] transition-all"
                >
                  Yes, Restore
                </button>
                <button onClick={() => setConfirmRestore(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
