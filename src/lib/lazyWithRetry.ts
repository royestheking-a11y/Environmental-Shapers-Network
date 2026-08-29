import { ComponentType, lazy } from "react";

/**
 * Wraps dynamic React component imports with automatic reload on chunk load failure.
 * This occurs when a new deployment updates asset hashes while a user has an older version loaded.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const pageHasBeenReloaded = sessionStorage.getItem("esn_chunk_reload_attempt");

    try {
      const component = await componentImport();
      // Reset the reload flag upon successful load
      sessionStorage.removeItem("esn_chunk_reload_attempt");
      return component;
    } catch (error: any) {
      console.warn("Chunk load error detected:", error);

      const errorMessage = String(error?.message || error || "");
      const isChunkError =
        errorMessage.includes("Failed to fetch dynamically imported module") ||
        errorMessage.includes("Importing a module script failed") ||
        errorMessage.includes("error loading dynamically imported module") ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("MIME type") ||
        error?.name === "ChunkLoadError";

      // If this is a chunk load error and we haven't reloaded yet, force a hard reload
      if (isChunkError && !pageHasBeenReloaded) {
        sessionStorage.setItem("esn_chunk_reload_attempt", "true");
        window.location.reload();
        // Return a pending promise to prevent rendering during reload
        return new Promise<{ default: T }>(() => {});
      }

      // If we already reloaded and it still fails, clear flag and propagate to ErrorBoundary
      sessionStorage.removeItem("esn_chunk_reload_attempt");
      throw error;
    }
  });
}
