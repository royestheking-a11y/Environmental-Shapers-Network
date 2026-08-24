import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link2, Check, Sparkles } from "lucide-react";
import { uploadMediaFile } from "../../../lib/storageService";
import { ImageWithFallback } from "./ImageWithFallback";

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helpText?: string;
  aspectRatio?: "video" | "square" | "wide" | "auto";
  compact?: boolean;
}

export function ImageUploadField({
  label = "Cover Image",
  value = "",
  onChange,
  folder = "esn_uploads",
  placeholder = "https://... or upload a file",
  helpText = "Upload high-res PNG, JPG, or WebP (max 15MB)",
  aspectRatio = "video",
  compact = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, SVG, etc.).");
      return;
    }

    setIsUploading(true);
    setUploadPercent(10);

    try {
      const result = await uploadMediaFile(file, folder, (pct) => {
        setUploadPercent(pct);
      });
      if (result && result.url) {
        onChange(result.url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Upload failed. Please check your connection or file size.");
    } finally {
      setIsUploading(false);
      setUploadPercent(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[140px]"
      : aspectRatio === "wide"
      ? "aspect-[21/9] max-h-44"
      : aspectRatio === "auto"
      ? "min-h-[100px] max-h-48"
      : "aspect-video max-h-44";

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 block">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#0B5D3F] hover:underline font-semibold flex items-center gap-1"
          >
            <Link2 size={12} />
            {showUrlInput ? "Hide Direct URL" : "Paste Image URL"}
          </button>
        </div>
      )}

      {/* Main Upload Box & Preview */}
      <div className="flex flex-col sm:flex-row items-start gap-3">
        {/* Preview Thumbnail */}
        {value ? (
          <div className={`relative group rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shrink-0 w-full sm:w-auto ${aspectClass}`}>
            <ImageWithFallback
              src={value}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-lg text-xs font-semibold shadow flex items-center gap-1 transition-all"
                title="Change Image"
              >
                <Upload size={12} /> Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow transition-all"
                title="Remove Image"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ) : null}

        {/* Upload Trigger Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex-1 w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] ${
            isDragOver
              ? "border-[#4CAF50] bg-[#4CAF50]/10"
              : isUploading
              ? "border-gray-200 bg-gray-50 cursor-wait"
              : "border-gray-200 hover:border-[#0B5D3F]/50 hover:bg-[#F6FBF8]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 w-full max-w-[200px]">
              <Loader2 size={22} className="animate-spin text-[#0B5D3F]" />
              <p className="text-xs font-semibold text-gray-700">Uploading {uploadPercent}%</p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0B5D3F] transition-all duration-200 rounded-full"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#0B5D3F]/10 text-[#0B5D3F] flex items-center justify-center mb-1.5">
                <Upload size={16} />
              </div>
              <p className="text-xs font-bold text-gray-800">
                {value ? "Upload a different image" : "Click to upload image"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">or drag and drop file here</p>
            </>
          )}
        </div>
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-xl bg-[#F6FBF8] border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#4CAF50] transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 text-gray-400 hover:text-red-500 text-xs"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files)}
        className="hidden"
      />

      {helpText && <p className="text-[11px] text-gray-400">{helpText}</p>}
    </div>
  );
}
