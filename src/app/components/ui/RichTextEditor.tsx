import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link2, Image as ImageIcon, Quote, Table, Minus, Undo, Redo,
  RemoveFormatting, Code, Eye, Maximize2, Minimize2, Palette, Highlighter, Type,
  Heading1, Heading2, Heading3, Subscript, Superscript, Upload, X, Check, HelpCircle,
  AlertCircle, Info, Sparkles, ChevronDown
} from "lucide-react";
import { uploadMediaFile } from "../../../lib/storageService";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  helpText?: string;
}

const FONT_FAMILIES = [
  { label: "Default (Inter / Sans)", value: "'Inter', sans-serif" },
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Georgia (Editorial Serif)", value: "Georgia, serif" },
  { label: "Merriweather (Book Serif)", value: "'Merriweather', serif" },
  { label: "Outfit (Modern Heading)", value: "'Outfit', sans-serif" },
  { label: "Arial / Helvetica", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Courier (Monospace / Code)", value: "'Courier New', Courier, monospace" },
];

const FONT_SIZES = [
  { label: "Extra Small (11px)", value: "1", px: "11px" },
  { label: "Small (13px)", value: "2", px: "13px" },
  { label: "Normal Body (16px)", value: "3", px: "16px" },
  { label: "Medium / Lead (18px)", value: "4", px: "18px" },
  { label: "Large / Subhead (24px)", value: "5", px: "24px" },
  { label: "Heading 2 (30px)", value: "6", px: "30px" },
  { label: "Heading 1 (36px)", value: "7", px: "36px" },
];

const TEXT_COLORS = [
  { name: "Default Dark", hex: "#1f2937" },
  { name: "ESN Forest Green", hex: "#0A3D2A" },
  { name: "Emerald Green", hex: "#16a34a" },
  { name: "Ocean Blue", hex: "#1e40af" },
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Amber Orange", hex: "#ea580c" },
  { name: "Ruby Red", hex: "#dc2626" },
  { name: "Purple", hex: "#7e22ce" },
  { name: "Slate Gray", hex: "#4b5563" },
  { name: "Muted Gray", hex: "#9ca3af" },
];

const HIGHLIGHT_COLORS = [
  { name: "None", hex: "transparent" },
  { name: "Soft Yellow", hex: "#fef08a" },
  { name: "Mint Green", hex: "#bbf7d0" },
  { name: "Soft Cyan", hex: "#a5f3fc" },
  { name: "Soft Pink", hex: "#fbcfe8" },
  { name: "Light Lavender", hex: "#e9d5ff" },
  { name: "Light Gray", hex: "#f3f4f6" },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your full article or story here...",
  minHeight = "320px",
  label,
  helpText,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "html" | "preview">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [customColor, setCustomColor] = useState("#0A3D2A");
  
  // Link Dialog State
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  
  // Image Dialog State
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Table Dialog State
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Internal value sync tracking
  const isInternalUpdate = useRef(false);

  // Sync prop value to contentEditable when not editing internally
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    updateStats(value || "");
    isInternalUpdate.current = false;
  }, [value]);

  const updateStats = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.innerText || temp.textContent || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(text.length);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      isInternalUpdate.current = true;
      onChange(html);
      updateStats(html);
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
  };

  const setHeading = (tag: string) => {
    if (tag === "p") {
      exec("formatBlock", "<p>");
    } else {
      exec("formatBlock", `<${tag}>`);
    }
  };

  const setFontFamily = (family: string) => {
    exec("fontName", family);
  };

  const setFontSize = (sizeVal: string) => {
    exec("fontSize", sizeVal);
  };

  const setTextColor = (color: string) => {
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  const setHighlightColor = (color: string) => {
    if (color === "transparent") {
      exec("removeFormat");
    } else {
      exec("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:")
      ? linkUrl
      : `https://${linkUrl}`;
    
    if (linkText) {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #0B5D3F; text-decoration: underline; font-weight: 600;">${linkText}</a>`;
      exec("insertHTML", linkHtml);
    } else {
      exec("createLink", url);
    }
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleImageFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setIsUploadingImage(true);
    try {
      const res = await uploadMediaFile(file, "article_inline_images");
      if (res && res.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const insertImage = () => {
    if (!imageUrl) return;
    const imgHtml = `
      <figure style="margin: 24px 0; text-align: center;">
        <img src="${imageUrl}" alt="${imageCaption || 'Article image'}" style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); display: inline-block;" />
        ${imageCaption ? `<figcaption style="font-size: 13px; color: #6b7280; margin-top: 8px; font-style: italic;">${imageCaption}</figcaption>` : ""}
      </figure>
      <p><br></p>
    `;
    exec("insertHTML", imgHtml);
    setShowImageModal(false);
    setImageUrl("");
    setImageCaption("");
  };

  const insertQuote = () => {
    const quoteHtml = `
      <blockquote style="border-left: 4px solid #4CAF50; padding: 12px 20px; margin: 20px 0; background: rgba(11, 93, 63, 0.04); border-radius: 0 16px 16px 0; font-size: 17px; font-style: italic; color: #1f2937; line-height: 1.6;">
        "Add an inspiring quote or key statement here..."
      </blockquote>
      <p><br></p>
    `;
    exec("insertHTML", quoteHtml);
  };

  const insertCallout = (type: "note" | "tip" | "warning") => {
    let bg = "rgba(11, 93, 63, 0.06)";
    let border = "#0B5D3F";
    let title = "📌 Key Takeaway";
    if (type === "tip") {
      bg = "rgba(2, 132, 199, 0.06)";
      border = "#0284c7";
      title = "💡 Pro Tip";
    } else if (type === "warning") {
      bg = "rgba(234, 88, 12, 0.06)";
      border = "#ea580c";
      title = "⚠️ Important Notice";
    }

    const calloutHtml = `
      <div style="background: ${bg}; border-left: 4px solid ${border}; padding: 16px 20px; border-radius: 12px; margin: 20px 0;">
        <strong style="color: ${border}; display: block; margin-bottom: 4px; font-size: 14px;">${title}</strong>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">Write your important highlight note or message here...</p>
      </div>
      <p><br></p>
    `;
    exec("insertHTML", calloutHtml);
  };

  const insertTable = () => {
    const rows = Math.max(1, Math.min(tableRows, 10));
    const cols = Math.max(1, Math.min(tableCols, 8));

    let tableHtml = `
      <div style="overflow-x: auto; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <thead>
            <tr style="background: #E6F3EB;">
    `;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th style="padding: 12px 16px; border: 1px solid #e5e7eb; text-align: left; font-size: 13px; font-weight: 700; color: #0A3D2A;">Header ${c + 1}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;

    for (let r = 0; r < rows; r++) {
      const bg = r % 2 === 0 ? "#ffffff" : "#F8FCF9";
      tableHtml += `<tr style="background: ${bg};">`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td style="padding: 10px 16px; border: 1px solid #e5e7eb; font-size: 14px; color: #4b5563;">Row ${r + 1}, Col ${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    exec("insertHTML", tableHtml);
    setShowTableModal(false);
  };

  const insertDivider = () => {
    exec("insertHorizontalRule");
  };

  return (
    <div className={`flex flex-col w-full bg-white border border-gray-200 rounded-2xl shadow-sm transition-all ${
      isFullscreen ? "fixed inset-0 z-[99999] rounded-none p-6 bg-[#f8faf9] flex flex-col h-screen" : ""
    }`}>
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 bg-[#FAFDFB] rounded-t-2xl">
        <div className="flex items-center gap-2">
          {label && (
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Type size={14} className="text-[#0B5D3F]" /> {label}
            </span>
          )}
          <span className="text-[11px] bg-[#E6F3EB] text-[#0A3D2A] font-semibold px-2.5 py-0.5 rounded-full">
            Word-Style Formatter
          </span>
        </div>

        {/* View Mode Tabs & Stats */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-gray-400 font-medium hidden sm:flex items-center gap-2 mr-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>

          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                activeTab === "visual" ? "bg-white text-[#0A3D2A] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Visual Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("html")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                activeTab === "html" ? "bg-white text-[#0A3D2A] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Code size={12} /> HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                activeTab === "preview" ? "bg-white text-[#0A3D2A] shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Eye size={12} /> Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-[#0B5D3F] hover:bg-[#E6F3EB] rounded-lg transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Writing Mode"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Word-Like Formatting Toolbar (Only in Visual Mode) */}
      {activeTab === "visual" && (
        <div className="p-2 border-b border-gray-100 bg-[#F9FCFA] flex flex-wrap items-center gap-1.5 text-gray-700 select-none">
          {/* History */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
            <button
              type="button"
              onClick={() => exec("undo")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("redo")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={14} />
            </button>
          </div>

          {/* Font Family Selector */}
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            defaultValue=""
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-medium text-gray-700 focus:outline-none focus:border-[#4CAF50] cursor-pointer hover:border-gray-300"
            title="Font Family"
          >
            <option value="" disabled>Font Style</option>
            {FONT_FAMILIES.map((f) => (
              <option key={f.label} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Heading / Style Selector */}
          <select
            onChange={(e) => setHeading(e.target.value)}
            defaultValue="p"
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-medium text-gray-700 focus:outline-none focus:border-[#4CAF50] cursor-pointer hover:border-gray-300"
            title="Paragraph Style / Headings"
          >
            <option value="p">Normal Text (Paragraph)</option>
            <option value="h1">Heading 1 (Main Title)</option>
            <option value="h2">Heading 2 (Section Title)</option>
            <option value="h3">Heading 3 (Sub-section)</option>
            <option value="h4">Heading 4 (Minor Header)</option>
          </select>

          {/* Font Size Selector */}
          <select
            onChange={(e) => setFontSize(e.target.value)}
            defaultValue="3"
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 font-medium text-gray-700 focus:outline-none focus:border-[#4CAF50] cursor-pointer hover:border-gray-300"
            title="Font Size"
          >
            {FONT_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <div className="h-5 w-px bg-gray-200 mx-0.5" />

          {/* Basic Text Formatting: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
            <button
              type="button"
              onClick={() => exec("bold")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 hover:text-gray-900 transition-colors font-bold"
              title="Bold (Ctrl+B)"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("italic")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 hover:text-gray-900 transition-colors italic"
              title="Italic (Ctrl+I)"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("underline")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 hover:text-gray-900 transition-colors underline"
              title="Underline (Ctrl+U)"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              onClick={() => exec("strikeThrough")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 hover:text-gray-900 transition-colors line-through"
              title="Strikethrough"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          {/* Colors: Text Color & Highlight */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-gray-200 relative">
            {/* Text Color Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 flex items-center gap-1 transition-colors"
                title="Font Text Color"
              >
                <Palette size={15} className="text-[#0B5D3F]" />
                <ChevronDown size={11} className="text-gray-400" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white p-3 rounded-xl shadow-xl border border-gray-200 z-50 w-56">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-2">Text Color</span>
                  <div className="grid grid-cols-5 gap-1.5 mb-3">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setTextColor(c.hex)}
                        className="w-7 h-7 rounded-lg border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setTextColor(e.target.value);
                      }}
                      className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                      title="Custom Color"
                    />
                    <span className="text-xs text-gray-600 font-medium">Custom Color</span>
                  </div>
                </div>
              )}
            </div>

            {/* Highlight Background Color Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 flex items-center gap-1 transition-colors"
                title="Highlight Background Color"
              >
                <Highlighter size={15} className="text-amber-600" />
                <ChevronDown size={11} className="text-gray-400" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white p-3 rounded-xl shadow-xl border border-gray-200 z-50 w-52">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-2">Highlight Color</span>
                  <div className="grid grid-cols-4 gap-2">
                    {HIGHLIGHT_COLORS.map((h) => (
                      <button
                        key={h.name}
                        type="button"
                        onClick={() => setHighlightColor(h.hex)}
                        className="w-8 h-8 rounded-lg border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: h.hex === "transparent" ? "#fff" : h.hex }}
                        title={h.name}
                      >
                        {h.hex === "transparent" ? "✕" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
            <button
              type="button"
              onClick={() => exec("justifyLeft")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyCenter")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyRight")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("justifyFull")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Justify"
            >
              <AlignJustify size={14} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-gray-200">
            <button
              type="button"
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Bulleted List"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </button>
          </div>

          {/* Insert Tools: Link, Image, Quote, Table, Alert, Divider */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className="p-1.5 hover:bg-[#E6F3EB] rounded-lg text-gray-700 hover:text-[#0A3D2A] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Insert Link (Hyperlink)"
            >
              <Link2 size={14} className="text-[#0B5D3F]" />
              <span className="hidden sm:inline">Link</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="p-1.5 hover:bg-[#E6F3EB] rounded-lg text-gray-700 hover:text-[#0A3D2A] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Insert Photo / Image"
            >
              <ImageIcon size={14} className="text-[#0B5D3F]" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={insertQuote}
              className="p-1.5 hover:bg-[#E6F3EB] rounded-lg text-gray-700 hover:text-[#0A3D2A] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Insert Quote Box"
            >
              <Quote size={14} className="text-[#0B5D3F]" />
              <span className="hidden sm:inline">Quote</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTableModal(true)}
              className="p-1.5 hover:bg-[#E6F3EB] rounded-lg text-gray-700 hover:text-[#0A3D2A] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Insert Styled Table"
            >
              <Table size={14} className="text-[#0B5D3F]" />
              <span className="hidden sm:inline">Table</span>
            </button>

            {/* Callouts Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="p-1.5 hover:bg-[#E6F3EB] rounded-lg text-gray-700 hover:text-[#0A3D2A] transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Insert Callout Note"
              >
                <Sparkles size={14} className="text-emerald-600" />
                <span className="hidden sm:inline">Callout</span>
                <ChevronDown size={10} className="text-gray-400" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white p-2 rounded-xl shadow-xl border border-gray-200 z-50 w-48 hidden group-hover:block hover:block">
                <button
                  type="button"
                  onClick={() => insertCallout("note")}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-green-50 text-xs font-semibold text-green-800 block"
                >
                  🌱 Key Takeaway / Note
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout("tip")}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-50 text-xs font-semibold text-blue-800 block"
                >
                  💡 Pro Tip
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout("warning")}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-orange-50 text-xs font-semibold text-orange-800 block"
                >
                  ⚠️ Important Notice
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={insertDivider}
              className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-700 transition-colors"
              title="Insert Divider Line (<hr>)"
            >
              <Minus size={14} />
            </button>

            <button
              type="button"
              onClick={() => exec("removeFormat")}
              className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors ml-auto"
              title="Clear Formatting"
            >
              <RemoveFormatting size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className={`p-4 sm:p-6 overflow-y-auto flex-1 ${isFullscreen ? "max-w-5xl mx-auto w-full bg-white rounded-2xl my-4 shadow-md" : ""}`}>
        {activeTab === "visual" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="outline-none focus:outline-none text-gray-800 leading-[1.85] text-[15px] prose-custom transition-all"
          />
        )}

        {activeTab === "html" && (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs text-gray-800 bg-[#F8FCF9] border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] resize-y"
            placeholder="<p>Enter raw HTML content here...</p>"
          />
        )}

        {activeTab === "preview" && (
          <div
            style={{ minHeight }}
            className="p-6 bg-[#FAFAF8] rounded-xl border border-gray-100 text-gray-800 leading-[1.85] text-base shadow-inner"
            dangerouslySetInnerHTML={{ __html: value || `<p className="text-gray-400 italic">No content to preview yet.</p>` }}
          />
        )}
      </div>

      {helpText && (
        <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400 bg-gray-50/50 rounded-b-2xl">
          {helpText}
        </div>
      )}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Link2 size={16} className="text-[#0B5D3F]" /> Insert Link
              </h4>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Destination URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or mailto:info@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Link Text (Optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here to read report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl}
                className="bg-[#0B5D3F] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0a5237] disabled:opacity-50"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-[#0B5D3F]" /> Insert Photo into Article
              </h4>
              <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              {/* Image Upload box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-[#0B5D3F] rounded-xl p-6 text-center cursor-pointer bg-[#F6FBF8] transition-colors"
              >
                <Upload size={24} className="mx-auto mb-2 text-[#0B5D3F]" />
                <p className="text-xs font-bold text-gray-800">
                  {isUploadingImage ? "Uploading Image..." : "Click to upload image file"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WebP supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Or Paste Direct Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              {imageUrl && (
                <div className="h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Image Caption (Optional)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Field researchers assessing coastal mangroves"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl || isUploadingImage}
                className="bg-[#0B5D3F] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0a5237] disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Table size={16} className="text-[#0B5D3F]" /> Insert Table Grid
              </h4>
              <button onClick={() => setShowTableModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-sm text-center"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="bg-[#0B5D3F] text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0a5237]"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
