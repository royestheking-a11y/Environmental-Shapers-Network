import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Plus, Search, Edit3, Trash2, Download, ExternalLink,
  CheckCircle2, Upload, ShieldCheck, Star, Award, Eye
} from "lucide-react";
import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";
import { uploadMediaFile } from "../../../../lib/storageService";
import { ImageUploadField } from "../../../components/ui/ImageUploadField";

export interface AuditReportItem {
  id: number;
  year: string;
  title: string;
  pages: number;
  size: string;
  highlights: string[];
  fileUrl?: string;
  viewUrl?: string;
}

export interface ReportsPageSettings {
  heroTitle: string;
  heroSub: string;
  heroImage: string;
  trustMetrics: Array<{ value: string; label: string }>;
}

export const defaultReportsSettings: ReportsPageSettings = {
  heroTitle: "Annual Reports & Publications",
  heroSub: "Transparent reporting on our environmental impact, finances, and organizational performance.",
  heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
  trustMetrics: [
    { value: "100%", label: "Independently Audited" },
    { value: "4-Star", label: "Charity Navigator Rating" },
    { value: "A+", label: "Transparency Grade" }
  ]
};

export const defaultAuditReports: AuditReportItem[] = [
  {
    id: 1,
    year: "2025",
    title: "Annual Impact & Financial Audit Report 2025",
    pages: 84,
    size: "12.4 MB",
    highlights: ["2.1M trees planted", "150K MT CO₂ reduced", "$18M mobilized", "Clean Audit Opinion"]
  },
  {
    id: 2,
    year: "2024",
    title: "Annual Impact & Financial Audit Report 2024",
    pages: 76,
    size: "10.8 MB",
    highlights: ["1.6M trees planted", "124K MT CO₂ reduced", "$14M mobilized", "UNEP Verified"]
  },
  {
    id: 3,
    year: "2023",
    title: "Annual Impact & Financial Audit Report 2023",
    pages: 68,
    size: "9.2 MB",
    highlights: ["1.1M trees planted", "98K MT CO₂ reduced", "$11M mobilized"]
  },
  {
    id: 4,
    year: "2022",
    title: "Annual Impact & Financial Audit Report 2022",
    pages: 60,
    size: "8.1 MB",
    highlights: ["680K trees planted", "72K MT CO₂ reduced", "$8M mobilized"]
  }
];

export default function ReportsAdminView() {
  const [activeTab, setActiveTab] = useState<"reports" | "settings">("reports");
  const [reports, setReports] = useFirestoreData<AuditReportItem[]>("esn_reports_admin", defaultAuditReports);
  const [settings, setSettings] = useFirestoreData<ReportsPageSettings>("esn_reports_settings", defaultReportsSettings);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");

  const [formData, setFormData] = useState<Partial<AuditReportItem>>({
    year: new Date().getFullYear().toString(),
    title: "",
    pages: 60,
    size: "8.5 MB",
    highlights: [],
    fileUrl: "",
    viewUrl: ""
  });

  const saveReportsToFirestore = async (newReports: AuditReportItem[]) => {
    setReports(newReports);
    await saveFirestoreData("esn_reports_admin", newReports);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const saveSettingsToFirestore = async (newSettings: ReportsPageSettings) => {
    setSettings(newSettings);
    await saveFirestoreData("esn_reports_settings", newSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      year: new Date().getFullYear().toString(),
      title: "",
      pages: 60,
      size: "8.5 MB",
      highlights: ["Independently Audited", "Open Access"],
      fileUrl: "",
      viewUrl: ""
    });
    setHighlightInput("");
    setShowModal(true);
  };

  const handleStartEdit = (rep: AuditReportItem) => {
    setEditingId(rep.id);
    setFormData({ ...rep });
    setHighlightInput("");
    setShowModal(true);
  };

  const handleSaveReport = () => {
    if (!formData.title?.trim() || !formData.year?.trim()) {
      alert("Please provide both a Title and Year for the report.");
      return;
    }

    if (editingId !== null) {
      const updated = (reports || []).map((r) =>
        r.id === editingId ? ({ ...r, ...formData } as AuditReportItem) : r
      );
      saveReportsToFirestore(updated);
    } else {
      const newId = reports && reports.length > 0 ? Math.max(...reports.map((r) => r.id)) + 1 : 1;
      const newReport: AuditReportItem = {
        id: newId,
        year: formData.year || "2026",
        title: formData.title || "",
        pages: Number(formData.pages) || 50,
        size: formData.size || "10.0 MB",
        highlights: formData.highlights || ["Audited Report"],
        fileUrl: formData.fileUrl || "",
        viewUrl: formData.viewUrl || ""
      };
      saveReportsToFirestore([newReport, ...(reports || [])]);
    }
    setShowModal(false);
  };

  const handleDeleteReport = () => {
    if (deleteConfirmId !== null) {
      const updated = (reports || []).filter((r) => r.id !== deleteConfirmId);
      saveReportsToFirestore(updated);
      setDeleteConfirmId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingFile(true);
    try {
      const res = await uploadMediaFile(file, "annual_reports_docs");
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          fileUrl: res.url,
          size: res.size || prev.size
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const addHighlight = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && highlightInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()]
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== idx)
    }));
  };

  const currentSettings = settings || defaultReportsSettings;
  const currentReports = reports || defaultAuditReports;

  const filteredReports = currentReports.filter((r) => {
    return (
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.year.includes(search) ||
      (r.highlights && r.highlights.some((h) => h.toLowerCase().includes(search.toLowerCase())))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 font-black text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Annual Reports & Audit Management
            </h3>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D3F] bg-[#E6F3EB] px-2.5 py-1 rounded-full animate-pulse">
                <CheckCircle2 size={13} /> Saved Live
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage public financial audits, annual impact reports, downloadable PDFs, and transparency ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/reports"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
          >
            <Eye size={14} /> Preview Live Page <ExternalLink size={12} className="text-gray-400" />
          </a>
          {activeTab === "reports" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
            >
              <Plus size={16} /> Add Annual Report / Audit
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "reports"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Reports & Audits List ({currentReports.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "settings"
              ? "bg-[#0B5D3F] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Hero Banner & Transparency Ratings
        </button>
      </div>

      {/* TAB 1: REPORTS LIST */}
      {activeTab === "reports" && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by report title, year (e.g. 2025), or audit highlight..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs font-medium outline-none text-gray-800"
            />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-gray-100">
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No reports found matching "{search}". Click "+ Add Annual Report / Audit" above.
              </div>
            ) : (
              filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F6FBF8]/60 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-14 h-14 rounded-2xl bg-[#0B5D3F] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {rep.year}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base leading-snug mb-1">
                        {rep.title}
                      </h4>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {rep.highlights?.map((h, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#E6F3EB] text-[#0B5D3F] px-2.5 py-0.5 rounded-full font-semibold"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{rep.pages} pages</span>
                        <span>·</span>
                        <span>{rep.size}</span>
                        {rep.fileUrl && (
                          <>
                            <span>·</span>
                            <span className="text-[#0B5D3F] font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> PDF Attached
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {rep.fileUrl && (
                      <a
                        href={rep.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#0B5D3F] hover:bg-gray-50 transition-colors"
                        title="Download / View PDF"
                      >
                        <Download size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => handleStartEdit(rep)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(rep.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HERO & TRANSPARENCY SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="font-bold text-gray-900 text-base">Hero Header Settings</h4>
            <p className="text-xs text-gray-400">Configure banner title, subtitle, and cover image for /reports</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Title</label>
              <input
                type="text"
                value={currentSettings.heroTitle}
                onChange={(e) =>
                  setSettings({ ...currentSettings, heroTitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                placeholder="Annual Reports & Publications"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Hero Subtitle</label>
              <textarea
                rows={3}
                value={currentSettings.heroSub}
                onChange={(e) =>
                  setSettings({ ...currentSettings, heroSub: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                placeholder="Transparent reporting on our environmental impact..."
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadField
                label="Hero Background Banner Image"
                value={currentSettings.heroImage}
                onChange={(url) => setSettings({ ...currentSettings, heroImage: url })}
                folder="reports_banners"
                aspectRatio="wide"
                helpText="Upload a high-res cover banner for the Annual Reports page"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-base">Transparency & Audit Rating Badges (3 Badges)</h4>
              <p className="text-xs text-gray-400">These 3 rating cards appear above the reports list</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {currentSettings.trustMetrics.map((met, idx) => (
                <div key={idx} className="bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-2">Badge #{idx + 1}</div>
                  <div className="mb-2">
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Value (e.g. 100%, 4-Star, A+)</label>
                    <input
                      type="text"
                      value={met.value}
                      onChange={(e) => {
                        const newMetrics = [...currentSettings.trustMetrics];
                        newMetrics[idx] = { ...newMetrics[idx], value: e.target.value };
                        setSettings({ ...currentSettings, trustMetrics: newMetrics });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-black text-[#0B5D3F] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Label</label>
                    <input
                      type="text"
                      value={met.label}
                      onChange={(e) => {
                        const newMetrics = [...currentSettings.trustMetrics];
                        newMetrics[idx] = { ...newMetrics[idx], label: e.target.value };
                        setSettings({ ...currentSettings, trustMetrics: newMetrics });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-medium outline-none text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => saveSettingsToFirestore(currentSettings)}
              className="px-6 py-3 rounded-xl bg-[#0B5D3F] text-white font-bold text-sm hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20 flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Save Reports Settings
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT REPORT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {editingId ? "Edit Annual Report" : "Add New Annual Report"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Upload and configure your audited report document.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Report Year *</label>
                  <input
                    type="text"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-bold focus:outline-none focus:border-[#4CAF50]"
                    placeholder="2025"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Number of Pages</label>
                  <input
                    type="number"
                    value={formData.pages || 0}
                    onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="84"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Report Title *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-semibold focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. Annual Impact & Financial Audit Report 2025"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">File Size (Display text)</label>
                  <input
                    type="text"
                    value={formData.size || ""}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. 12.4 MB"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Highlights / Badges (Press Enter to add)</label>
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={addHighlight}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] mb-2"
                    placeholder="e.g. Clean Audit Opinion"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights?.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F3EB] text-[#0A3D2A] text-xs font-bold rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeHighlight(i)} className="hover:text-red-500 ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 bg-[#F6FBF8] p-4 rounded-2xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Report PDF File Upload / URL</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={formData.fileUrl || ""}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      placeholder="https://.../report.pdf or upload below"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-medium focus:outline-none"
                    />
                    <label className="cursor-pointer bg-[#0B5D3F] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#0a5237] transition-all flex items-center gap-1.5 shrink-0">
                      <Upload size={13} /> {isUploadingFile ? "Uploading..." : "Upload PDF"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploadingFile}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    When visitors click "Download PDF", this file will immediately open/download.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">Online Reader Link (Optional)</label>
                  <input
                    type="text"
                    value={formData.viewUrl || ""}
                    onChange={(e) => setFormData({ ...formData, viewUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#4CAF50]"
                    placeholder="e.g. /knowledge-hub or external flipbook URL"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReport}
                  className="px-6 py-2.5 rounded-xl bg-[#0B5D3F] text-white font-bold text-xs hover:bg-[#0a5237] transition-all shadow-md shadow-[#0B5D3F]/20"
                >
                  {editingId ? "Update Report" : "Add Report"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-100 shadow-xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Delete Annual Report?</h4>
              <p className="text-xs text-gray-500 mb-6">
                Are you sure you want to remove this report from the public list? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReport}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
