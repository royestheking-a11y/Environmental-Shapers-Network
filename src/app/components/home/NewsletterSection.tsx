import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { fetchFirestoreData, saveFirestoreData } from "../../../lib/useFirestore";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const subs = await fetchFirestoreData<any[]>("esn_subscribers", []);
      subs.push({ email, date: new Date().toISOString() });
      await saveFirestoreData("esn_subscribers", subs);
    } catch (e) {
      console.error(e);
    }
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] bg-[#0A1A0E] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-16 border border-gray-900">
          {/* Subtle Abstract Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4CAF50] rounded-full mix-blend-screen filter blur-[130px] opacity-20" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0B5D3F] rounded-full mix-blend-screen filter blur-[130px] opacity-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 md:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5">
                  <Mail size={20} className="text-[#4CAF50]" />
                </div>
                <span className="text-white/80 text-sm font-bold uppercase tracking-widest">Newsletter</span>
              </div>
              <h3
                className="text-white mb-5 leading-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(2.2rem, 4vw, 3rem)",
                  fontWeight: 800,
                }}
              >
                Join Our <span className="text-[#4CAF50]">Community</span>
              </h3>
              <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md">
                Subscribe to receive the latest updates on global environmental campaigns, projects, and impact stories directly in your inbox.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <div className="relative z-10 w-full max-w-md md:max-w-sm lg:max-w-md shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              {submitted ? (
                <div className="flex items-center justify-center gap-3 bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-2xl p-8 text-center text-white h-[260px]">
                  <div>
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 bg-[#4CAF50] rounded-full flex items-center justify-center text-[#0A1A0E] shadow-[0_0_20px_rgba(76,175,80,0.4)]">
                        <CheckCircle2 size={28} />
                      </div>
                    </div>
                    <div className="font-bold text-xl mb-1 text-white">You're subscribed!</div>
                    <div className="text-sm text-white/60">Welcome to the ESN community.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block pl-1">Email Address</label>
                    <div className="relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@example.com"
                        required
                        className="w-full pl-5 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:bg-white/10 focus:border-[#4CAF50]/50 transition-all"
                      />
                      <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#4CAF50]/70 transition-colors" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-[#0A1A0E] px-6 py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] mt-2"
                  >
                    Subscribe Now <ArrowUpRight size={18} />
                  </button>
                  <p className="text-white/40 text-[11px] text-center mt-3 font-medium">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
