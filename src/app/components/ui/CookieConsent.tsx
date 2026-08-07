import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, ChevronRight, Shield } from "lucide-react";
import { Link } from "react-router";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("esn_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("esn_cookie_consent", JSON.stringify({ all: true, analytics: true, marketing: true, ts: Date.now() }));
    setVisible(false);
  }

  function acceptEssential() {
    localStorage.setItem("esn_cookie_consent", JSON.stringify({ all: false, analytics: false, marketing: false, ts: Date.now() }));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="fixed bottom-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto w-full max-w-2xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/15 border border-gray-200/80 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#0B5D3F] via-[#4CAF50] to-[#D6A95A]" />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B5D3F]/10 flex items-center justify-center shrink-0">
                      <Cookie size={18} className="text-[#0B5D3F]" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>We Value Your Privacy</div>
                      <div className="text-xs text-gray-500 mt-0.5">ESN uses cookies to improve your experience</div>
                    </div>
                  </div>
                  <button onClick={acceptEssential} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <X size={18} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  We use essential cookies for the website to function, and optional analytics cookies to understand how you use our site. We never sell your data.{" "}
                  <Link to="/cookie-policy" className="text-[#0B5D3F] font-semibold hover:underline" onClick={() => setVisible(false)}>
                    Cookie Policy
                  </Link>{" "}
                  ·{" "}
                  <Link to="/privacy" className="text-[#0B5D3F] font-semibold hover:underline" onClick={() => setVisible(false)}>
                    Privacy Policy
                  </Link>
                </p>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-5">
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        {[
                          { name: "Essential", desc: "Required for the site to work", locked: true, color: "#0B5D3F" },
                          { name: "Analytics", desc: "Help us improve (anonymized)", locked: false, color: "#4CAF50" },
                          { name: "Marketing", desc: "Personalized campaign content", locked: false, color: "#173B63" },
                        ].map((cookie) => (
                          <div key={cookie.name} className="bg-[#F6FBF8] rounded-xl p-3 border border-gray-100">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold" style={{ color: cookie.color }}>{cookie.name}</span>
                              {cookie.locked ? (
                                <div className="w-8 h-4 rounded-full bg-[#0B5D3F] flex items-center justify-end pr-0.5">
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-4 rounded-full bg-gray-200 flex items-center pl-0.5">
                                  <div className="w-3 h-3 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{cookie.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={accept}
                    className="flex-1 min-w-[160px] bg-[#0B5D3F] hover:bg-[#0a5237] text-white py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                    <Shield size={14} /> Accept All Cookies
                  </button>
                  <button onClick={acceptEssential}
                    className="flex-1 min-w-[140px] bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition-all">
                    Essential Only
                  </button>
                  <button onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
                    {showDetails ? "Hide" : "Manage"} Preferences
                    <ChevronRight size={12} className={`transition-transform ${showDetails ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
