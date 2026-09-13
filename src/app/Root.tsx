import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { CookieConsent } from "./components/ui/CookieConsent";
import { CustomCursor } from "./components/ui/CustomCursor";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { PageTransition } from "./components/ui/PageTransition";
import { MaintenancePage } from "./pages/MaintenancePage";
import { FloatingAI } from "./components/ui/FloatingAI";
import { useFirestoreData } from "../lib/useFirestore";

import { PlantSproutLoader } from "./components/ui/PlantSproutLoader";

const initialSettings = {
  maintenanceMode: false,
};

import { saveFirestoreData } from "../lib/useFirestore";
import { Link } from "react-router";

export function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [settings, setSettings] = useFirestoreData<any>("esn_settings", initialSettings);

  const isMaintenance = Boolean(settings?.maintenanceMode);
  const storedAdmin = typeof window !== "undefined" ? localStorage.getItem("esn_admin_user") : null;
  const hasAdminSession = Boolean(storedAdmin);
  const isPreviewParam = new URLSearchParams(location.search).get("preview") === "true";

  const handleDisableMaintenance = async () => {
    const updated = { ...settings, maintenanceMode: false };
    setSettings(updated);
    await saveFirestoreData("esn_settings", updated);
  };

  // Render maintenance page ONLY for non-admin visitors when maintenance mode is active
  if (isMaintenance && !isAdmin && !hasAdminSession && !isPreviewParam) {
    return (
      <>
        <CustomCursor />
        <MaintenancePage />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen flex flex-col" style={{ cursor: "none" }}>
        {isMaintenance && !isAdmin && (
          <div className="bg-amber-500 text-slate-900 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 z-[99999] shadow-md">
            <span className="flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Maintenance Mode is Active (Public visitors see the maintenance page). You are viewing as Admin.</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDisableMaintenance}
                className="bg-slate-900 text-white px-3 py-1 rounded-md hover:bg-black transition-all"
              >
                Disable Maintenance Mode
              </button>
              <Link to="/admin" className="underline hover:text-white">
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
        {!isAdmin && <ScrollProgress />}
        {!isAdmin && <Navbar />}
        <div className="flex-1 bg-[#F6FBF8]">
          <Suspense fallback={<PlantSproutLoader />}>
            {isAdmin ? (
              <Outlet />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
            )}
          </Suspense>
        </div>
        {!isAdmin && <Footer />}
        <ScrollToTop />
        {!isAdmin && <CookieConsent />}
        {!isAdmin && <FloatingAI />}
      </div>
    </>
  );
}
