import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useSettings } from "../../utils/useSettings";
import { fetchFirestoreData, saveFirestoreData } from "../../../lib/useFirestore";

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const settings = useSettings();
  
  const [form, setForm] = useState({ firstName: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      try {
        const messages = await fetchFirestoreData<any[]>("esn_messages", []);
        messages.push({ ...form, lastName: "", organization: "", id: Date.now(), date: new Date().toISOString(), status: "unread" });
        await saveFirestoreData("esn_messages", messages);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section ref={ref} className="py-24 bg-[#0B5D3F] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4CAF50]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Let's Build a <br/><span className="text-[#4CAF50]">Greener Future</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Have questions or want to partner with us? Drop us a message and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Mail size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Email Us</h4>
                  <p className="text-white/70">{settings.contactEmail || "info@esnbd.org"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <Phone size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Call Us</h4>
                  <p className="text-white/70">+880 (123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <MapPin size={20} className="text-[#4CAF50]" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Headquarters</h4>
                  <p className="text-white/70">Global Eco Center, 123 Green Ave<br/>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topic *</label>
                    <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all text-gray-700">
                      <option value="">Select a topic</option>
                      <option>Partnership Inquiry</option>
                      <option>Donation Help</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="How can we help?" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#0A1A0E] hover:bg-[#173B63] text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50">
                    {loading ? "Sending..." : "Send Message"} <Send size={18} />
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Received!</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">Thank you for reaching out. Our team will review your message and get back to you shortly.</p>
                  <button onClick={() => { setForm({ firstName: "", email: "", subject: "", message: "" }); setSubmitted(false); }} className="text-[#0B5D3F] font-bold hover:underline">
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
