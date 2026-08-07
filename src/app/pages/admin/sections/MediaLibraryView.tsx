import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image, Upload, Search, Grid3x3, List, Trash2, Download,
  Eye, Filter, FolderOpen, Film, FileText, Music, X,
  Copy, Check, Plus, LayoutGrid, Edit3, Save
} from "lucide-react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

type MediaType = "All" | "Images" | "Videos" | "Documents";

interface MediaItem {
  id: number;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  size: string;
  dimensions?: string;
  uploadedBy: string;
  date: string;
  tags: string[];
}

const seedMedia: MediaItem[] = [
  { id: 1, name: "forest-hero.jpg", type: "image", url: "https://images.unsplash.com/photo-1759672220260-ce22c7b9e1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "2.4 MB", dimensions: "1920×1080", uploadedBy: "Admin", date: "Jul 27, 2026", tags: ["hero", "forest", "banner"] },
  { id: 2, name: "volunteers-group.jpg", type: "image", url: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "1.8 MB", dimensions: "1600×1067", uploadedBy: "Editor", date: "Jul 26, 2026", tags: ["volunteers", "team"] },
  { id: 3, name: "planting-seedling.jpg", type: "image", url: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "3.1 MB", dimensions: "2400×1600", uploadedBy: "Admin", date: "Jul 25, 2026", tags: ["planting", "tree", "seedling"] },
  { id: 4, name: "coral-reef.jpg", type: "image", url: "https://images.unsplash.com/photo-1580696499419-84ca9688f947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "2.9 MB", dimensions: "2000×1500", uploadedBy: "Editor", date: "Jul 24, 2026", tags: ["ocean", "coral", "marine"] },
  { id: 5, name: "foggy-forest.jpg", type: "image", url: "https://images.unsplash.com/photo-1683221704109-acdeb0883037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "1.6 MB", dimensions: "1080×1620", uploadedBy: "Admin", date: "Jul 23, 2026", tags: ["forest", "fog", "nature"] },
  { id: 6, name: "ocean-cleanup.jpg", type: "image", url: "https://images.unsplash.com/photo-1618477462041-2b6b1920e073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", size: "2.2 MB", dimensions: "1800×1200", uploadedBy: "Editor", date: "Jul 22, 2026", tags: ["ocean", "cleanup", "volunteers"] },
  { id: 7, name: "annual-report-2025.pdf", type: "document", url: "", size: "4.8 MB", uploadedBy: "Admin", date: "Jul 20, 2026", tags: ["report", "annual", "pdf"] },
  { id: 8, name: "impact-presentation.pdf", type: "document", url: "", size: "3.2 MB", uploadedBy: "Admin", date: "Jul 18, 2026", tags: ["presentation", "impact"] },
  { id: 9, name: "esn-intro-video.mp4", type: "video", url: "", size: "48 MB", dimensions: "1920×1080", uploadedBy: "Admin", date: "Jul 15, 2026", tags: ["video", "intro", "promo"] },
];

import { useFirestoreData, saveFirestoreData } from "../../../../lib/useFirestore";

function getInitialMedia(): MediaItem[] {
  return seedMedia;
}

const typeIcon = { image: Image, video: Film, document: FileText };
const typeColor = { image: "#0B5D3F", video: "#173B63", document: "#D6A95A" };

export function MediaLibraryView() {
  const [items, setItems, loading] = useFirestoreData<MediaItem[]>("esn_media", getInitialMedia());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<MediaType>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<number[]>([]);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editUploadedBy, setEditUploadedBy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const saveItems = async (list: MediaItem[]) => {
    setItems(list);
    await saveFirestoreData("esn_media", list);
  };

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.includes(search.toLowerCase()));
    const matchType = filterType === "All" ||
      (filterType === "Images" && item.type === "image") ||
      (filterType === "Videos" && item.type === "video") ||
      (filterType === "Documents" && item.type === "document");
    return matchSearch && matchType;
  });

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    saveItems(items.filter((i) => !selected.includes(i.id)));
    setSelected([]);
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newItems: MediaItem[] = files.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      type: f.type.startsWith("image") ? "image" : f.type.startsWith("video") ? "video" : "document",
      url: f.type.startsWith("image") ? URL.createObjectURL(f) : "",
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: "Admin",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tags: [],
    }));
    saveItems([...newItems, ...items]);
  };

  const startEdit = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditName(item.name);
    setEditTags(item.tags.join(", "));
    setEditUploadedBy(item.uploadedBy);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    saveItems(items.map((i) => i.id === editingItem.id
      ? { ...i, name: editName.trim() || i.name, tags: editTags.split(",").map((t) => t.trim()).filter(Boolean), uploadedBy: editUploadedBy.trim() || i.uploadedBy }
      : i
    ));
    setEditingItem(null);
  };

  const downloadItem = (item: MediaItem) => {
    if (item.url) {
      window.open(item.url, "_blank");
    } else {
      const blob = new Blob([`[Simulated download for: ${item.name}]`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const totalSize = items.reduce((s, i) => s + parseFloat(i.size), 0).toFixed(1);
  const imgCount = items.filter(i => i.type === "image").length;
  const vidCount = items.filter(i => i.type === "video").length;
  const docCount = items.filter(i => i.type === "document").length;

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Media Library</h3>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} files · {totalSize} MB used</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <button onClick={deleteSelected} className="flex items-center gap-2 text-sm text-red-500 border border-red-200 bg-red-50 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all font-semibold">
              <Trash2 size={14} /> Delete ({selected.length})
            </button>
          )}
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 bg-[#0B5D3F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
            <Upload size={14} /> Upload Files
          </button>
          <input ref={fileRef} type="file" multiple className="hidden" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Files", value: items.length, icon: FolderOpen, color: "#0B5D3F" },
          { label: "Images", value: imgCount, icon: Image, color: "#4CAF50" },
          { label: "Videos", value: vidCount, icon: Film, color: "#173B63" },
          { label: "Documents", value: docCount, icon: FileText, color: "#D6A95A" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl py-8 text-center cursor-pointer transition-all ${dragOver ? "border-[#4CAF50] bg-[#4CAF50]/5" : "border-gray-200 hover:border-[#0B5D3F]/40 hover:bg-[#F6FBF8]"}`}
      >
        <Upload size={28} className={`mx-auto mb-2 ${dragOver ? "text-[#4CAF50]" : "text-gray-300"}`} />
        <p className="text-sm font-semibold text-gray-500">Drag & drop files here, or <span className="text-[#0B5D3F] underline">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF, MP4, SVG · Max 50MB per file</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-50">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Images", "Videos", "Documents"] as const).map((t) => (
              <button key={t} onClick={() => setFilterType(t)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${filterType === t ? "bg-[#0B5D3F] text-white" : "bg-[#F6FBF8] text-gray-500 hover:bg-[#0B5D3F]/10"}`}>{t}</button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-[#0B5D3F] text-white" : "text-gray-400 hover:bg-gray-100"}`}><LayoutGrid size={15} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-[#0B5D3F] text-white" : "text-gray-400 hover:bg-gray-100"}`}><List size={15} /></button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item) => {
              const Icon = typeIcon[item.type];
              const isSelected = selected.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? "border-[#4CAF50] ring-2 ring-[#4CAF50]/20" : "border-gray-100 hover:border-[#0B5D3F]/20"}`}
                  onClick={() => setPreview(item)}
                >
                  <div className="aspect-square bg-[#F6FBF8] flex items-center justify-center overflow-hidden">
                    {item.type === "image" ? (
                      <ImageWithFallback src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                    ) : (
                      <Icon size={32} style={{ color: typeColor[item.type] }} className="opacity-40" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); setPreview(item); }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#0B5D3F] hover:text-white transition-all">
                      <Eye size={13} />
                    </button>
                    <button onClick={(e) => startEdit(item, e)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#173B63] hover:text-white transition-all">
                      <Edit3 size={13} />
                    </button>
                    {item.url && (
                      <button onClick={(e) => { e.stopPropagation(); copyUrl(item.id, item.url); }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-all">
                        {copied === item.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={(e) => toggleSelect(item.id, e)}
                    className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 transition-all ${isSelected ? "bg-[#4CAF50] border-[#4CAF50]" : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"} flex items-center justify-center`}
                  >
                    {isSelected && <Check size={11} className="text-white" />}
                  </button>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.size}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => {
              const Icon = typeIcon[item.type];
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F6FBF8]/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F6FBF8] flex items-center justify-center shrink-0">
                    {item.type === "image" ? (
                      <ImageWithFallback src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={18} style={{ color: typeColor[item.type] }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{item.name}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>{item.size}</span>
                      {item.dimensions && <span>{item.dimensions}</span>}
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap max-w-[120px] justify-end">
                    {item.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-xs bg-[#F6FBF8] text-gray-400 px-2 py-0.5 rounded-full border border-gray-100">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => setPreview(item)} className="p-2 rounded-xl hover:bg-[#0B5D3F]/10 text-gray-300 hover:text-[#0B5D3F] transition-all"><Eye size={14} /></button>
                    <button onClick={(e) => startEdit(item, e)} className="p-2 rounded-xl hover:bg-[#173B63]/10 text-gray-300 hover:text-[#173B63] transition-all"><Edit3 size={14} /></button>
                    <button onClick={() => downloadItem(item)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-all"><Download size={14} /></button>
                    <button onClick={() => saveItems(items.filter((i) => i.id !== item.id))} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-300">
            <Image size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No media files found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Edit Media Item</h4>
                <button onClick={() => setEditingItem(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={15} /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">File Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Tags (comma-separated)</label>
                  <input type="text" value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="nature, forest, hero..." className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1.5 block">Uploaded By</label>
                  <input type="text" value={editUploadedBy} onChange={(e) => setEditUploadedBy(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold hover:bg-[#0a5237] transition-all">
                  <Save size={15} /> Save Changes
                </button>
                <button onClick={() => setEditingItem(null)} className="px-6 py-3 rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">{preview.name}</h4>
                  <p className="text-xs text-gray-400">{preview.size} · {preview.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { setPreview(null); startEdit(preview, e as any); }} className="w-8 h-8 bg-[#F6FBF8] rounded-xl flex items-center justify-center hover:bg-[#0B5D3F]/10 text-gray-400 hover:text-[#0B5D3F] transition-all">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => setPreview(null)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X size={15} /></button>
                </div>
              </div>
              {preview.type === "image" && (
                <div className="bg-[#F6FBF8] flex items-center justify-center p-4" style={{ maxHeight: "400px" }}>
                  <img src={preview.url} alt={preview.name} className="max-w-full max-h-80 object-contain rounded-xl" />
                </div>
              )}
              <div className="p-5 grid grid-cols-3 gap-4">
                {[["Type", preview.type], ["Size", preview.size], ["Uploaded by", preview.uploadedBy], ["Date", preview.date], ...(preview.dimensions ? [["Dimensions", preview.dimensions]] : [])].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                    <div className="text-sm font-semibold text-gray-800 capitalize">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 p-5 pt-0">
                {preview.url && (
                  <button onClick={() => copyUrl(preview.id, preview.url)} className="flex-1 flex items-center justify-center gap-2 bg-[#0B5D3F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#0a5237] transition-all">
                    {copied === preview.id ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy URL</>}
                  </button>
                )}
                <button onClick={() => downloadItem(preview)} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                  <Download size={15} /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
