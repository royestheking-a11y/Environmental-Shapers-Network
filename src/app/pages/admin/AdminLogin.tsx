import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle, Leaf, TreePine, Globe2, CheckCircle2, ArrowLeft, Home } from "lucide-react";
import { authenticateStaff } from "../../../lib/staffAuthService";
import { logAdminActivity } from "../../../lib/activityLogger";
const esnLogo = "/logo.png";
const esnLogoWhite = "/logo-white.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authenticateStaff(email, password);
      if (user) {
        localStorage.setItem(
          "esn_admin_user",
          JSON.stringify({ email: user.email, role: user.role, name: user.name, avatar: user.avatar })
        );
        await logAdminActivity(
          "Staff Logged In",
          "Auth",
          `User ${user.name} (${user.role}) logged in to the admin portal.`,
          "success",
          { name: user.name, role: user.role, email: user.email }
        );
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred while authenticating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#F6FBF8] p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-[1100px] bg-white rounded-[2rem] shadow-2xl shadow-green-900/5 overflow-hidden min-h-[600px] max-h-[90vh] border border-gray-100">
        {/* Left Panel — decorative */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1759672220260-ce22c7b9e1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-[#0B5D3F]/90" />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#4CAF50]/40 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-between p-10 overflow-y-auto text-white w-full">
          {/* Logo */}
          <img src={esnLogoWhite} alt="ESN" className="h-14 w-auto object-contain self-start mb-10" />

          {/* Main Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Shield size={14} className="text-[#4CAF50]" />
                Admin Control Center
              </div>
              <h2 className="text-white mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Manage Global<br />
                <span className="text-[#4CAF50]">Environmental Impact</span>
              </h2>
              <p className="text-white/65 text-lg leading-relaxed max-w-md">
                Access the ESN admin panel to manage projects, campaigns, team members, donations, and more — all from one powerful dashboard.
              </p>
            </motion.div>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col gap-4"
            >
              {[
                { icon: TreePine, text: "Manage 470+ global projects" },
                { icon: Globe2, text: "Track impact across 80+ countries" },
                { icon: Leaf, text: "Publish content & campaigns" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-white/80">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                    <item.icon size={16} className="text-[#4CAF50]" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="text-white/40 text-sm">
            © 2026 Environmental Shapers Network. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-y-auto">


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back button moved to absolute top right */}

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src={esnLogo} alt="ESN" className="h-12 w-auto mx-auto object-contain" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <div className="w-16 h-16 bg-[#0B5D3F]/10 rounded-2xl flex items-center justify-center mb-5">
                  <Lock size={28} className="text-[#0B5D3F]" />
                </div>
                <h3 className="text-[#0B5D3F] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Welcome Back
                </h3>
                <p className="text-gray-400 text-sm">Sign in to your ESN admin account</p>
              </div>

              <Link 
                to="/"
                className="w-11 h-11 bg-gray-50 hover:bg-[#F6FBF8] rounded-full flex items-center justify-center text-gray-400 hover:text-[#0B5D3F] transition-all border border-gray-100 hover:border-[#0B5D3F]/20 shadow-sm group"
                title="Back to Homepage"
              >
                <Home size={18} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>


            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    placeholder="admin@esnglobal.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#4CAF50]" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-[#0B5D3F] font-semibold hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield size={18} /> Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={12} />
              Protected by 256-bit SSL encryption
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
