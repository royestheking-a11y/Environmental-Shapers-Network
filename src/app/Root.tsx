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

const initialSettings = {
  maintenanceMode: false,
};

function RouteLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#4CAF50] border-t-transparent animate-spin" />
    </div>
  );
}

export function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [settings] = useFirestoreData<any>("esn_settings", initialSettings);

  const isMaintenance = Boolean(settings?.maintenanceMode);

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
          <Suspense fallback={<RouteLoader />}>
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
