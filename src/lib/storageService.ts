import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadResult {
  url: string;
  storagePath?: string;
  name: string;
  size: string;
  optimizedSize?: string;
  savings?: string;
  type: "image" | "video" | "document";
}

/**
 * Checks whether the current browser environment supports Canvas WebP encoding
 */
const isWebpSupported = ((): boolean => {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
})();

/**
 * Compresses any image (even 20MB-50MB DSLR/phone photos) in browser memory
 * into an ultra-sharp, featherweight payload (~16KB-30KB) that keeps the database ultra-fast.
 * Uses WebP whenever supported, with adaptive multi-pass quality tuning.
 */
export function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve) => {
    // If SVG, return as data URL directly if small
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
      return;
    }

    // If not an image (e.g. PDF/DOCX)
    if (!file.type.startsWith("image/")) {
      if (file.size <= 850 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      } else {
        console.warn(`[storageService] File "${file.name}" is ${(file.size / 1024).toFixed(0)}KB. Document exceeds 850KB threshold.`);
        resolve("");
      }
      return;
    }

    // Use URL.createObjectURL for 10x faster memory-efficient decoding
    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      // Fallback to FileReader if createObjectURL fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const fallbackUrl = (e.target?.result as string) || "";
        processImageSrc(fallbackUrl, resolve, maxWidth, maxHeight, quality);
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
      return;
    }

    processImageSrc(objectUrl, (res) => {
      try { URL.revokeObjectURL(objectUrl); } catch {}
      resolve(res);
    }, maxWidth, maxHeight, quality);
  });
}

function processImageSrc(
  src: string,
  resolve: (res: string) => void,
  maxWidth: number,
  maxHeight: number,
  initialQuality: number
) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    // Preserve aspect ratio
    if (width > maxWidth || height > maxHeight) {
      if (width / height > maxWidth / maxHeight) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      resolve(src);
      return;
    }

    // High quality scaling filters
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const mime = isWebpSupported ? "image/webp" : "image/jpeg";
    let dataUrl = canvas.toDataURL(mime, initialQuality);

    // Adaptive Pass 2: If size > 38,000 characters (~28KB), downscale slightly
    if (dataUrl.length > 38000) {
      const p2Canvas = document.createElement("canvas");
      const p2W = Math.round(width * 0.82);
      const p2H = Math.round(height * 0.82);
      p2Canvas.width = Math.max(1, p2W);
      p2Canvas.height = Math.max(1, p2H);
      const p2Ctx = p2Canvas.getContext("2d", { alpha: false });
      if (p2Ctx) {
        p2Ctx.imageSmoothingEnabled = true;
        p2Ctx.imageSmoothingQuality = "high";
        p2Ctx.drawImage(canvas, 0, 0, p2W, p2H);
        dataUrl = p2Canvas.toDataURL(mime, Math.max(0.55, initialQuality - 0.12));
      }
    }

    // Adaptive Pass 3: If still > 34,000 characters, final optimization pass
    if (dataUrl.length > 34000) {
      const p3Canvas = document.createElement("canvas");
      const p3W = Math.round(width * 0.70);
      const p3H = Math.round(height * 0.70);
      p3Canvas.width = Math.max(1, p3W);
      p3Canvas.height = Math.max(1, p3H);
      const p3Ctx = p3Canvas.getContext("2d", { alpha: false });
      if (p3Ctx) {
        p3Ctx.imageSmoothingEnabled = true;
        p3Ctx.imageSmoothingQuality = "medium";
        p3Ctx.drawImage(canvas, 0, 0, p3W, p3H);
        dataUrl = p3Canvas.toDataURL(mime, 0.48);
      }
    }

    resolve(dataUrl);
  };
  img.onerror = () => resolve(src);
  img.src = src;
}

/**
 * Uploads a file with instant local compression and Firebase Storage sync.
 * Zero-delay fallback so uploads never hang or crash the browser.
 */
export async function uploadMediaFile(
  file: File,
  folder = "esn_media",
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const isImage = file.type.startsWith("image");
  const isVideo = file.type.startsWith("video");
  const mediaType: "image" | "video" | "document" = isImage ? "image" : isVideo ? "video" : "document";
  const origSizeKb = file.size / 1024;
  const sizeStr = origSizeKb >= 1024 ? `${(origSizeKb / 1024).toFixed(2)} MB` : `${origSizeKb.toFixed(0)} KB`;
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;

  if (onProgress) onProgress(25);

  // 1. Instantly compress images to ultra-sharp lightweight payloads
  let instantUrl = "";
  let finalSizeKb = origSizeKb;
  try {
    if (isImage) {
      instantUrl = await compressImage(file);
      finalSizeKb = Math.round(instantUrl.length * 0.75 / 1024);
    } else if (file.size <= 850 * 1024) {
      instantUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = (e) => res((e.target?.result as string) || "");
        r.onerror = () => res("");
        r.readAsDataURL(file);
      });
      finalSizeKb = Math.round(instantUrl.length * 0.75 / 1024);
    }
  } catch {
    instantUrl = "";
  }

  const savingsPct = origSizeKb > 0 && finalSizeKb < origSizeKb
    ? `${Math.round(((origSizeKb - finalSizeKb) / origSizeKb) * 100)}%`
    : undefined;

  const optimizedSizeStr = `${finalSizeKb.toFixed(0)} KB`;

  if (onProgress) onProgress(60);

  // 2. Try Firebase Cloud Storage with a fast 1.2-second timeout (never blocks or freezes UI)
  try {
    const storagePromise = new Promise<UploadResult>((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          url: instantUrl,
          storagePath: undefined,
          name: file.name,
          size: sizeStr,
          optimizedSize: optimizedSizeStr,
          savings: savingsPct,
          type: mediaType,
        });
      }, 1200);

      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            if (snapshot.totalBytes > 0 && onProgress) {
              const progress = Math.min(95, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
              onProgress(progress);
            }
          },
          () => {
            clearTimeout(timeoutId);
            resolve({
              url: instantUrl,
              storagePath: undefined,
              name: file.name,
              size: sizeStr,
              optimizedSize: optimizedSizeStr,
              savings: savingsPct,
              type: mediaType,
            });
          },
          async () => {
            clearTimeout(timeoutId);
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              if (onProgress) onProgress(100);
              resolve({
                url: downloadUrl,
                storagePath,
                name: file.name,
                size: sizeStr,
                optimizedSize: optimizedSizeStr,
                savings: savingsPct,
                type: mediaType,
              });
            } catch {
              resolve({
                url: instantUrl,
                storagePath: undefined,
                name: file.name,
                size: sizeStr,
                optimizedSize: optimizedSizeStr,
                savings: savingsPct,
                type: mediaType,
              });
            }
          }
        );
      } catch {
        clearTimeout(timeoutId);
        resolve({
          url: instantUrl,
          storagePath: undefined,
          name: file.name,
          size: sizeStr,
          optimizedSize: optimizedSizeStr,
          savings: savingsPct,
          type: mediaType,
        });
      }
    });

    const result = await storagePromise;
    if (onProgress) onProgress(100);
    return result;
  } catch {
    if (onProgress) onProgress(100);
    return {
      url: instantUrl,
      storagePath: undefined,
      name: file.name,
      size: sizeStr,
      optimizedSize: optimizedSizeStr,
      savings: savingsPct,
      type: mediaType,
    };
  }
}

/**
 * Deletes a file from Firebase Cloud Storage
 */
export async function deleteMediaFile(storagePathOrUrl?: string): Promise<boolean> {
  if (!storagePathOrUrl) return true;
  if (storagePathOrUrl.startsWith("data:") || storagePathOrUrl.includes("images.unsplash.com") || storagePathOrUrl.startsWith("/") || storagePathOrUrl.startsWith("blob:")) {
    return true;
  }

  try {
    const fileRef = ref(storage, storagePathOrUrl);
    await deleteObject(fileRef);
    return true;
  } catch {
    return false;
  }
}
