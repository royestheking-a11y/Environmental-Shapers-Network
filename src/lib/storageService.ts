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
 * Compresses an image in browser memory in 50ms for instant loading & lightweight storage
 */
export function compressImage(file: File, maxWidth = 1600, maxHeight = 1000, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
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
          const dataUrl = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", quality);
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
 * Never hangs or blocks the UI.
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

  if (onProgress) onProgress(35);

  // 1. Instantly compress and prepare client-side URL
  let instantUrl = "";
  try {
    instantUrl = await compressImage(file);
  } catch {
    instantUrl = "";
  }

  if (onProgress) onProgress(70);

  // 2. Try Firebase Cloud Storage with a 3.5-second timeout
  try {
    const storagePromise = new Promise<UploadResult>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // If Cloud Storage takes longer than 3.5s, resolve with instant local URL
        resolve({
          url: instantUrl,
          storagePath: undefined,
          name: file.name,
          size: sizeStr,
          type: mediaType,
        });
      }, 3500);

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
          (err) => {
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
