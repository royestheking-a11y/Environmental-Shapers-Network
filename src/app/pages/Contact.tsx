import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Globe, Send, Clock, MessageSquare, CheckCircle2, Leaf, Users } from "lucide-react";
import { useSettings } from "../utils/useSettings";
import { fetchFirestoreData, saveFirestoreData } from "../../lib/useFirestore";

export default function Contact() {
  const settings = useSettings();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", organization: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const messages = await fetchFirestoreData<any[]>("esn_messages", []);
      messages.push({ ...form, id: Date.now(), date: new Date().toISOString(), status: "unread" });
      await saveFirestoreData("esn_messages", messages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
              <MessageSquare size={14} />
              Connect With Our Global Team
            </div>
            <h1 className="text-white mb-4">Connect With Our Global Team</h1>
            <p className="text-white/70 text-lg">
              Whether you are a researcher, partner organisation, donor, journalist, or aspiring youth leader — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                {!submitted ? (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-[#0B5D3F]/10 rounded-2xl flex items-center justify-center">
                        <Send size={22} className="text-[#0B5D3F]" />
                      </div>
                      <div>
                        <h3 className="text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Send Us a Message</h3>
                        <p className="text-gray-400 text-sm">We respond within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                          <input
                            type="text"
                            required
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Organisation</label>
                          <input
                            type="text"
                            value={form.organization}
                            onChange={(e) => setForm({ ...form, organization: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all"
                            placeholder="Your organisation (optional)"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Enquiry Type *</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all text-gray-700"
                        >
                          <option value="">Select a topic</option>
                          <option>Partnership Inquiry</option>
                          <option>Volunteer Application</option>
                          <option>Donation & CSR</option>
                          <option>Media & Press</option>
                          <option>Research Collaboration</option>
                          <option>General Inquiry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your message... *</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={18} /> Send Message &rarr;
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-[#4CAF50]" />
                    </div>
                    <h3 className="text-[#0B5D3F] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Sent!</h3>
                    <p className="text-gray-500 mb-6">Thank you, {form.firstName}! We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", organization: "", subject: "", message: "" }); }}
                      className="text-[#0B5D3F] font-semibold hover:underline"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Quick Reach */}
              <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-3xl p-7 text-white">
                <Leaf size={26} className="text-[#4CAF50] mb-4" />
                <h4 className="text-white font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact Details</h4>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">Email</div>
                      <div className="text-sm font-medium mb-0.5">info@environmentalshapersnetwork.org</div>
                      <div className="text-sm font-medium">research@environmentalshapersnetwork.org</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">Youth Applications</div>
                      <div className="text-sm font-medium">youth.applications@environmentalshapersnetwork.org</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                      <Globe size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">Follow ESN</div>
                      <div className="text-sm font-medium flex gap-2">
                        <span>Facebook</span> &middot; <span>Twitter</span> &middot; <span>Instagram</span> &middot; <span>LinkedIn</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Locations</h4>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3 pb-5 border-b border-gray-50">
                    <div className="w-9 h-9 bg-[#0B5D3F]/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-[#0B5D3F]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm">Global Headquarters</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Environmental Shapers Network<br/>
                        International Environment House<br/>
                        Geneva, Switzerland
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Globe size={16} className="text-[#4CAF50]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm">Regional Offices</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Nairobi &middot; Dhaka &middot; Manila &middot; Bogotá<br/>
                        Lagos &middot; Cairo &middot; Jakarta &middot; London
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20 bg-[#F6FBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-3 md:p-5 rounded-[2rem] shadow-sm border border-gray-100"
          >
            <div className="relative h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden bg-gray-50 group border border-gray-100 shadow-inner">
              <iframe
                src="https://maps.google.com/maps?q=International+Environment+House,Geneva,Switzerland&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-700 opacity-90 group-hover:opacity-100 saturate-50 group-hover:saturate-100"
                title="ESN Global Headquarters Map"
              />
              {/* Premium overlay badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 md:top-6 md:left-6 md:bottom-auto md:-translate-x-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4 max-w-[300px] pointer-events-none"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <div className="absolute inset-0 bg-[#4CAF50] rounded-xl animate-ping opacity-20" />
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-xl flex items-center justify-center shadow-inner relative z-10">
                    <MapPin size={22} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Global Headquarters</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">International Environment House, Geneva</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
