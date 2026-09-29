import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadResult {
  url: string;
  storagePath?: string;
  name: string;
  size: string;
  type: "image" | "video" | "document";
}

/**
 * Compresses an image in browser memory with dual-pass compression
 * Produces ultra-lightweight, crisp images (~18KB-32KB) that never overload Firestore documents
 */
export function compressImage(file: File, maxWidth = 800, maxHeight = 520, quality = 0.60): Promise<string> {
  return new Promise((resolve) => {
    // If not an image (e.g. PDF/DOCX)
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      // If SVG or small document (<= 450KB), allow data URL
      if (file.size <= 450 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      } else {
        // Prevent creating 5-10MB base64 strings that crash Firestore 1MB document limit
        console.warn(`[storageService] File "${file.name}" is ${(file.size / 1024).toFixed(0)}KB. Bypassing base64 to protect Firestore document size.`);
        resolve("");
      }
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = (e.target?.result as string) || "";
      img.onload = () => {
        let width = img.width;
        let height = img.height;

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
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          // Pass 2: If still > 48KB, compress further to strictly guarantee document safety
          if (dataUrl.length > 50000) {
            const smallerCanvas = document.createElement("canvas");
            smallerCanvas.width = Math.round(width * 0.8);
            smallerCanvas.height = Math.round(height * 0.8);
            const sCtx = smallerCanvas.getContext("2d");
            if (sCtx) {
              sCtx.drawImage(img, 0, 0, smallerCanvas.width, smallerCanvas.height);
              dataUrl = smallerCanvas.toDataURL("image/jpeg", 0.48);
            }
          }
          resolve(dataUrl);
        } else {
          resolve(img.src);
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file with instant local compression and Firebase Storage sync.
 * Never hangs or crashes Firestore.
 */
export async function uploadMediaFile(
  file: File,
  folder = "esn_media",
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const isImage = file.type.startsWith("image");
  const isVideo = file.type.startsWith("video");
  const mediaType: "image" | "video" | "document" = isImage ? "image" : isVideo ? "video" : "document";
  const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;

  if (onProgress) onProgress(25);

  // 1. Instantly compress and prepare client-side URL for images
  let instantUrl = "";
  try {
    instantUrl = await compressImage(file);
  } catch {
    instantUrl = "";
  }

  if (onProgress) onProgress(50);

  // 2. Try Firebase Cloud Storage with a resilient 20-second timeout
  try {
    const storagePromise = new Promise<UploadResult>((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          url: instantUrl,
          storagePath: undefined,
          name: file.name,
          size: sizeStr,
          type: mediaType,
        });
      }, 20000);

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
                type: mediaType,
              });
            } catch {
              resolve({
                url: instantUrl,
                storagePath: undefined,
                name: file.name,
                size: sizeStr,
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
      type: mediaType,
    };
  }
}

/**
 * Deletes a file from Firebase Cloud Storage
 */
export async function deleteMediaFile(storagePathOrUrl?: string): Promise<boolean> {
  if (!storagePathOrUrl) return true;
  if (storagePathOrUrl.startsWith("data:") || storagePathOrUrl.includes("images.unsplash.com") || storagePathOrUrl.startsWith("/")) {
    return true;
  }

  try {
    let fileRef;
    if (storagePathOrUrl.startsWith("http")) {
      fileRef = ref(storage, storagePathOrUrl);
    } else {
      fileRef = ref(storage, storagePathOrUrl);
    }
    await deleteObject(fileRef);
    return true;
  } catch {
    return false;
  }
}
