import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Handle Vite dynamic import chunk preloading errors across deployments
window.addEventListener("vite:preloadError", (event) => {
  console.warn("vite:preloadError detected. Reloading to fetch latest application chunks...", event);
  const lastReload = sessionStorage.getItem("esn_vite_preload_reload");
  const now = Date.now();
  // Throttle reload to prevent infinite loops (at most once every 10 seconds)
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem("esn_vite_preload_reload", now.toString());
    window.location.reload();
  }
});

// Handle unhandled rejection for dynamic module failures
window.addEventListener("unhandledrejection", (event) => {
  const errorMsg = String(event?.reason?.message || event?.reason || "");
  if (
    errorMsg.includes("Failed to fetch dynamically imported module") ||
    errorMsg.includes("Importing a module script failed") ||
    errorMsg.includes("error loading dynamically imported module")
  ) {
    console.warn("Dynamic import rejection caught:", errorMsg);
    const lastReload = sessionStorage.getItem("esn_unhandled_reload");
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem("esn_unhandled_reload", now.toString());
      window.location.reload();
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);