import { useEffect, useState } from "react";
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

import { fetchFirestoreData } from "../lib/useFirestore";

async function getSavedSettings() {
  try {
    const s = await fetchFirestoreData<any>("esn_settings", { maintenanceMode: false });
    return s;
  } catch {}
  return { maintenanceMode: false };
}

export function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      const settings = await getSavedSettings();
      setIsMaintenance(settings.maintenanceMode);
    };
    checkMaintenance();
  }, [location.pathname]);

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
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
        {!isAdmin && <Footer />}
        <ScrollToTop />
        {!isAdmin && <CookieConsent />}
      </div>
    </>
  );
}
