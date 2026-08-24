import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { CookieConsent } from "./components/ui/CookieConsent";
import { CustomCursor } from "./components/ui/CustomCursor";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { PageTransition } from "./components/ui/PageTransition";
import { MaintenancePage } from "./pages/MaintenancePage";
import { FloatingSocials } from "./components/ui/FloatingSocials";
import { FloatingAI } from "./components/ui/FloatingAI";
import { useFirestoreData } from "../lib/useFirestore";

const initialSettings = {
  maintenanceMode: false,
};

export function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [settings, , loading] = useFirestoreData<any>("esn_settings", initialSettings);

  const isMaintenance = Boolean(settings?.maintenanceMode);

  // Check if we have determined maintenance status (either via local cache or completed fetch)
  const isCacheAvailable = typeof window !== "undefined" && localStorage.getItem("esn_cache_esn_settings") !== null;
  const isResolving = loading && !isCacheAvailable && !isAdmin;

  // If resolving on brand new session, prevent flashing homepage
  if (isResolving) {
    return (
      <div className="min-h-screen bg-[#0a1a0e] flex flex-col items-center justify-center text-white">
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-3 border-[#4CAF50] border-t-transparent animate-spin" />
        </motion.div>
      </div>
    );
  }

  // Render maintenance page immediately if maintenance mode is enabled
  if (isMaintenance && !isAdmin) {
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
        {!isAdmin && <ScrollProgress />}
        {!isAdmin && <Navbar />}
        <div className="flex-1 bg-[#F6FBF8]">
          {isAdmin ? (
            <Outlet />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          )}
        </div>
        {!isAdmin && <Footer />}
        <ScrollToTop />
        {!isAdmin && <CookieConsent />}
        {!isAdmin && <FloatingSocials />}
        {!isAdmin && <FloatingAI />}
      </div>
    </>
  );
}
