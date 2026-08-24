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
 * Converts a File to Base64 as an instant client-side fallback
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file to Firebase Cloud Storage with real-time progress tracking
 * Automatically falls back to high-fidelity Base64 if storage bucket is offline.
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

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(progress);
          }
        },
        async (error) => {
          console.warn("Firebase Storage upload failed or not configured, using Base64 fallback:", error);
          try {
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: undefined,
              name: file.name,
              size: sizeStr,
              type: mediaType,
            });
          } catch (e) {
            reject(e);
          }
        },
        async () => {
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
          } catch (e) {
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: undefined,
              name: file.name,
              size: sizeStr,
              type: mediaType,
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn("Firebase Storage error, falling back to Base64:", err);
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      storagePath: undefined,
      name: file.name,
      size: sizeStr,
      type: mediaType,
    };
  }
}

/**
 * Deletes a file from Firebase Cloud Storage by its storage path or download URL
 */
export async function deleteMediaFile(storagePathOrUrl?: string): Promise<boolean> {
  if (!storagePathOrUrl) return true;
  
  // If it's a base64 string or unsplash URL, no Cloud Storage deletion is required
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
  } catch (e) {
    console.warn("Firebase Storage file delete error (or file already deleted):", e);
    return false;
  }
}
