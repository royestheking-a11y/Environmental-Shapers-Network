import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, TreePine, Users, Globe2, CheckCircle2, Shield, Leaf, ArrowRight,
  CreditCard, Building2, Smartphone, ChevronLeft, Lock, RefreshCw,
  Copy, Check, AlertCircle, Download, Star, Banknote, Wallet
} from "lucide-react";


const currencyConfigs = {
  BDT: {
    symbol: "৳",
    tiers: [
      { amount: 1000, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 2500, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 5000, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 10000, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 25000, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 50000, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 100000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 500000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 500
  },
  USD: {
    symbol: "$",
    tiers: [
      { amount: 10, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 25, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 50, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 100, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 250, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 500, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 1000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 5000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 5
  },
  EUR: {
    symbol: "€",
    tiers: [
      { amount: 10, label: "Seedling", trees: 2, desc: "Plant 2 trees" },
      { amount: 25, label: "Seed Planter", trees: 5, desc: "Support a nursery" },
      { amount: 50, label: "Grove Maker", trees: 10, desc: "Restore 0.05 acres" },
      { amount: 100, label: "Guardian", trees: 20, desc: "Fund a school session" },
      { amount: 250, label: "Forest Builder", trees: 50, desc: "Sponsor a leader" },
      { amount: 500, label: "Champion", trees: 100, desc: "Nursery for 1 month" },
      { amount: 1000, label: "Defender", trees: 200, desc: "Climate workshop" },
      { amount: 5000, label: "Protector", trees: 1000, desc: "Full program" },
    ],
    treeCost: 5
  }
};


import { fetchFirestoreData, saveFirestoreData } from "../../lib/useFirestore";

type PayMethod = "bkash" | "nagad" | "bank" | "paypal" | "card" | null;

async function saveDonation(data: any) {
  try {
    const existing = await fetchFirestoreData<any[]>("esn_donations", []);
    const newEntry = {
      id: Date.now(),
      receipt: "RCP-" + Date.now().toString().slice(-8),
      donor: data.name || "Anonymous",
      email: data.email || "",
      amount: data.amount,
      project: data.project || "General Donation",
      method: data.method,
      currency: data.currency,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Completed",
      recurring: data.frequency === "monthly",
    };
    await saveFirestoreData("esn_donations", [newEntry, ...existing]);
    return newEntry;
  } catch { return null; }
}

// bKash logo SVG
function BkashLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="16" fill="#E2136E" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="36" fontWeight="900" fontFamily="Arial">bK</text>
    </svg>
  );
}

// Nagad logo SVG
function NagadLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="16" fill="#F05A28" />
      <text x="50" y="68" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Arial">NG</text>
    </svg>
  );
}

// PayPal logo SVG
function PaypalLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="16" fill="#003087" />
      <text x="50" y="65" textAnchor="middle" fill="#00A3E0" fontSize="22" fontWeight="900" fontFamily="Arial">PayPal</text>
    </svg>
  );
}

export default function Donate() {
  const [currency, setCurrency] = useState<"BDT" | "USD" | "EUR">("BDT");
  const activeCurrency = currencyConfigs[currency];
  const activeTiers = activeCurrency.tiers;

  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [payMethod, setPayMethod] = useState<PayMethod>(null);
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", message: "" });
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [donated, setDonated] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [project, setProject] = useState("General Donation");

  const amount = custom ? parseFloat(custom) || 0 : selected;
  const trees = Math.floor(amount / activeCurrency.treeCost);

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const rec = saveDonation({ name: personalInfo.name, email: personalInfo.email, amount, method: payMethod, currency, frequency, project });
      setReceipt(rec);
      setProcessing(false);
      setDonated(true);
    }, 2200);
  };

  const reset = () => {
    setDonated(false); setStep(1); setPayMethod(null);
    setPersonalInfo({ name: "", email: "", phone: "", message: "" });
    setCardInfo({ number: "", expiry: "", cvv: "", name: "" });
    setBkashNumber(""); setNagadNumber(""); setPaypalEmail("");
    setCustom(""); setSelected(100);
  };

  if (donated) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-[#F6FBF8] to-white flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="max-w-lg w-full mx-auto">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B5D3F] to-[#4CAF50] p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} className="text-[#4CAF50]" />
              </motion.div>
              <h2 className="text-white mb-1">Donation Successful!</h2>
              <p className="text-white/75">Thank you, {personalInfo.name || "Friend"}</p>
            </div>
            <div className="p-8">
              <div className="bg-[#F6FBF8] rounded-2xl p-5 mb-6 border border-[#0B5D3F]/10">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Receipt ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{receipt?.receipt || "RCP-00000000"}</span>
                    <button onClick={() => copyRef(receipt?.receipt || "")} className="text-[#0B5D3F] hover:text-[#4CAF50] transition-all">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t border-gray-100">
                  {[[`${activeCurrency.symbol}${amount}`, "Donated"], [trees + " Trees", "Planted"], [Math.floor(amount * 0.2) + " kg", "CO₂ Offset"]].map(([v, l]) => (
                    <div key={l}>
                      <div className="font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center mb-6">
                A tax-deductible receipt has been sent to <strong>{personalInfo.email || "your email"}</strong>
              </p>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 bg-[#F6FBF8] text-[#0B5D3F] font-semibold py-3 rounded-xl border border-[#0B5D3F]/20 hover:bg-[#0B5D3F]/5 transition-all">
                  Donate Again
                </button>
                <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-[#0B5D3F] text-white font-semibold py-3 rounded-xl hover:bg-[#0a5237] transition-all">
                  <Download size={15} /> Download Receipt
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B5D3F]/92 to-[#173B63]/88" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
              <Heart size={14} fill="currentColor" className="text-[#4CAF50]" />
              Make a Difference Today
            </div>
            <h1 className="text-white mb-4">Your Donation Plants Tomorrow</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">100% of every donation funds real environmental projects. Choose your payment method — we support bKash, Nagad, Bank Transfer, PayPal, and Card.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-[#F6FBF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Progress bar */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-6 mb-4 snap-x no-scrollbar w-full">
            <div className="flex items-center gap-0 min-w-max px-2">
              {[{ n: 1, l: "Amount" }, { n: 2, l: "Details" }, { n: 3, l: "Payment" }, { n: 4, l: "Confirm" }].map((s, i, arr) => (
                <div key={s.n} className="flex items-center snap-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${step === s.n ? "bg-[#0B5D3F] text-white" : step > s.n ? "bg-[#4CAF50]/20 text-[#0B5D3F]" : "bg-white text-gray-400 border border-gray-100"}`}>
                    <span className={`w-5 h-5 rounded-full text-xs font-black flex items-center justify-center ${step === s.n ? "bg-white text-[#0B5D3F]" : step > s.n ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-500"}`}>
                      {step > s.n ? <Check size={11} /> : s.n}
                    </span>
                    <span className="whitespace-nowrap">{s.l}</span>
                  </div>
                  {i < arr.length - 1 && <div className={`h-0.5 w-4 sm:w-8 mx-1 transition-all ${step > s.n ? "bg-[#4CAF50]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* STEP 1 — Amount */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="font-black text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Choose Your Donation Amount</h3>

                    {/* Currency */}

                    <div className="flex bg-[#F6FBF8] rounded-xl p-1 mb-6 border border-gray-100">
                      {(["BDT", "USD", "EUR"] as const).map((c) => (
                        <button key={c} onClick={() => { setCurrency(c); setSelected(0); setCustom(""); }} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === c ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}>
                          {c}
                        </button>
                      ))}
                    </div>

                    {/* Frequency */}
                    <div className="flex bg-[#F6FBF8] rounded-xl p-1 mb-8">
                      {(["once", "monthly"] as const).map((f) => (
                        <button key={f} onClick={() => setFrequency(f)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${frequency === f ? "bg-[#0B5D3F] text-white shadow-lg" : "text-gray-500 hover:text-gray-700"}`}>
                          {f === "once" ? "One-time Donation" : "Monthly Giving"}
                        </button>
                      ))}
                    </div>

                    {/* Amount tiers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {activeTiers.map((tier) => (
                        <button key={tier.amount} onClick={() => { setSelected(tier.amount); setCustom(""); }} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${selected === tier.amount && !custom ? "bg-[#0B5D3F] border-[#0B5D3F] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#4CAF50]"}`}>
                          <span>{activeCurrency.symbol}{tier.amount}</span>
                          <span className={`text-xs font-normal ${selected === tier.amount && !custom ? "text-white/70" : "text-gray-400"}`}>{tier.trees} trees</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Custom Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{activeCurrency.symbol}</span>
                        <input type="number" min="1" value={custom} onChange={(e) => { setCustom(e.target.value); setSelected(0); }} className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] font-semibold transition-all" placeholder="Enter any amount" />
                      </div>
                    </div>

                    {/* Project selector */}
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Direct Your Donation</label>
                      <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] font-medium transition-all">
                        <option>General Donation</option>
                        <option>Islamic Donation</option>
                        <option>Festival Donation</option>
                        <option>Emergency fund</option>
                        <option>Medical Support fund</option>
                      </select>
                    </div>

                    {amount > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#F6FBF8] to-[#e8f5e9] rounded-2xl p-5 mb-8 border border-[#0B5D3F]/10">
                        <div className="flex items-center gap-2 mb-3">
                          <TreePine size={16} className="text-[#0B5D3F]" />
                          <span className="font-bold text-[#0B5D3F] text-sm">Your {activeCurrency.symbol}{amount} impact at a glance</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div><div className="font-black text-[#0B5D3F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{trees}</div><div className="text-xs text-gray-500">Trees</div></div>
                          <div><div className="font-black text-[#4CAF50]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{Math.floor(amount * 0.2)}kg</div><div className="text-xs text-gray-500">CO₂ Offset</div></div>
                          <div><div className="font-black text-[#173B63]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{Math.ceil(amount / 50)}</div><div className="text-xs text-gray-500">People Helped</div></div>
                        </div>
                      </motion.div>
                    )}

                    <button disabled={amount <= 0} onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                      Continue with {activeCurrency.symbol}{amount || 0} {frequency === "monthly" ? "/mo" : ""} <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2 — Personal Info */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-all">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <h3 className="font-black text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Information</h3>
                    <div className="flex flex-col gap-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                          <input required value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="John Smith" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <input required type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="you@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="+880 1XXX-XXXXXX" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message to ESN <span className="text-gray-400 font-normal">(optional)</span></label>
                        <textarea value={personalInfo.message} onChange={(e) => setPersonalInfo({ ...personalInfo, message: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all resize-none" placeholder="Why are you donating?" />
                      </div>
                      <div className="flex items-start gap-3 bg-[#F6FBF8] rounded-xl p-4 border border-gray-100">
                        <input type="checkbox" id="anonymous" className="mt-0.5" />
                        <label htmlFor="anonymous" className="text-sm text-gray-600">
                          Keep my donation anonymous (your name won't appear in donor recognition)
                        </label>
                      </div>
                      <button disabled={!personalInfo.name || !personalInfo.email} onClick={() => setStep(3)} className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                        Choose Payment Method <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Payment Method */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-all">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select Payment Method</h3>
                    <p className="text-sm text-gray-500 mb-8">Choose how you'd like to complete your {activeCurrency.symbol}{amount} donation</p>

                    {/* Mobile Banking */}
                    <div className="mb-6">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Mobile Banking</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { id: "bkash" as PayMethod, label: "bKash", sub: "Pay via bKash mobile wallet", color: "#E2136E", logo: <BkashLogo size={36} /> },
                          { id: "nagad" as PayMethod, label: "Nagad", sub: "Pay via Nagad mobile wallet", color: "#F05A28", logo: <NagadLogo size={36} /> },
                        ].map((m) => (
                          <button key={m.id!} onClick={() => setPayMethod(m.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === m.id ? "border-[#0B5D3F] bg-[#F6FBF8] shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                            {m.logo}
                            <div>
                              <div className="font-bold text-gray-900">{m.label}</div>
                              <div className="text-xs text-gray-500">{m.sub}</div>
                            </div>
                            {payMethod === m.id && <div className="ml-auto w-5 h-5 bg-[#0B5D3F] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* International */}
                    <div className="mb-6">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">International Payment</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { id: "paypal" as PayMethod, label: "PayPal", sub: "Pay via PayPal account", logo: <PaypalLogo size={36} /> },
                          { id: "card" as PayMethod, label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", logo: <div className="w-9 h-9 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl flex items-center justify-center"><CreditCard size={20} className="text-white" /></div> },
                        ].map((m) => (
                          <button key={m.id!} onClick={() => setPayMethod(m.id)} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === m.id ? "border-[#0B5D3F] bg-[#F6FBF8] shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                            {m.logo}
                            <div>
                              <div className="font-bold text-gray-900">{m.label}</div>
                              <div className="text-xs text-gray-500">{m.sub}</div>
                            </div>
                            {payMethod === m.id && <div className="ml-auto w-5 h-5 bg-[#0B5D3F] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="mb-8">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Bank Transfer</p>
                      <button onClick={() => setPayMethod("bank")} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${payMethod === "bank" ? "border-[#0B5D3F] bg-[#F6FBF8] shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                        <div className="w-9 h-9 bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-xl flex items-center justify-center">
                          <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Bank Transfer / Wire</div>
                          <div className="text-xs text-gray-500">Direct bank account transfer (local & international)</div>
                        </div>
                        {payMethod === "bank" && <div className="ml-auto w-5 h-5 bg-[#0B5D3F] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                      </button>
                    </div>

                    <button disabled={!payMethod} onClick={() => setStep(4)} className="w-full flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                      Continue to {payMethod ? payMethod.charAt(0).toUpperCase() + payMethod.slice(1) : "Payment"} <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 4 — Payment Gateway */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setStep(3)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 p-6 pb-0 transition-all">
                      <ChevronLeft size={16} /> Back to payment methods
                    </button>

                    {/* bKash Gateway */}
                    {payMethod === "bkash" && (
                      <div>
                        <div className="bg-[#E2136E] p-6 text-white text-center">
                          <BkashLogo size={48} />
                          <div className="mt-3 font-bold text-xl">bKash Payment Gateway</div>
                          <div className="text-pink-100 text-sm mt-1">Secure payment by bKash</div>
                        </div>
                        <form onSubmit={handlePay} className="p-8">
                          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 mb-6">
                            <div className="text-sm font-bold text-[#E2136E] mb-1">Send to bKash Number</div>
                            <div className="flex items-center justify-between">
                              <div className="font-black text-2xl text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>01712-345678</div>
                              <button type="button" onClick={() => copyRef("01712345678")} className="flex items-center gap-1 text-xs bg-[#E2136E] text-white px-3 py-1.5 rounded-lg hover:bg-pink-700 transition-all">
                                {copied ? <Check size={12} /> : <Copy size={12} />} Copy
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ESN Bangladesh Official · Merchant Account</div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Your bKash Number</label>
                              <div className="relative">
                                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input required value={bkashNumber} onChange={(e) => setBkashNumber(e.target.value)} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#E2136E] transition-all font-medium" placeholder="01XXXXXXXXX" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID <span className="text-gray-400 font-normal">(from bKash confirmation SMS)</span></label>
                              <input required className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#E2136E] transition-all font-medium" placeholder="e.g. 8A2B3C4D5E" />
                            </div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-700">
                              Send <strong>৳{Math.round(amount * 110)}</strong> (equivalent) to the merchant number above, then enter your bKash transaction ID here. Our team will verify within 24 hours.
                            </div>
                          </div>
                          <button type="submit" disabled={processing} className="w-full mt-6 flex items-center justify-center gap-2 bg-[#E2136E] hover:bg-pink-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            {processing ? <><RefreshCw size={18} className="animate-spin" /> Processing…</> : <><CheckCircle2 size={18} /> Confirm bKash Payment</>}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Nagad Gateway */}
                    {payMethod === "nagad" && (
                      <div>
                        <div className="bg-[#F05A28] p-6 text-white text-center">
                          <NagadLogo size={48} />
                          <div className="mt-3 font-bold text-xl">Nagad Payment Gateway</div>
                          <div className="text-orange-100 text-sm mt-1">Fast. Secure. Simple.</div>
                        </div>
                        <form onSubmit={handlePay} className="p-8">
                          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
                            <div className="text-sm font-bold text-[#F05A28] mb-1">Send to Nagad Number</div>
                            <div className="flex items-center justify-between">
                              <div className="font-black text-2xl text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>01713-456789</div>
                              <button type="button" onClick={() => copyRef("01713456789")} className="flex items-center gap-1 text-xs bg-[#F05A28] text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-all">
                                {copied ? <Check size={12} /> : <Copy size={12} />} Copy
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ESN Bangladesh Official · Merchant Account</div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Nagad Number</label>
                              <div className="relative">
                                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input required value={nagadNumber} onChange={(e) => setNagadNumber(e.target.value)} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#F05A28] transition-all font-medium" placeholder="01XXXXXXXXX" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction ID</label>
                              <input required className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#F05A28] transition-all font-medium" placeholder="e.g. NG9X8Y7Z6W" />
                            </div>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-700">
                              Send <strong>৳{Math.round(amount * 110)}</strong> to the Nagad merchant number above, then enter your transaction ID. Verification within 24 hours.
                            </div>
                          </div>
                          <button type="submit" disabled={processing} className="w-full mt-6 flex items-center justify-center gap-2 bg-[#F05A28] hover:bg-orange-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            {processing ? <><RefreshCw size={18} className="animate-spin" /> Processing…</> : <><CheckCircle2 size={18} /> Confirm Nagad Payment</>}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Bank Transfer */}
                    {payMethod === "bank" && (
                      <div>
                        <div className="bg-gradient-to-r from-[#0B5D3F] to-[#173B63] p-6 text-white text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Building2 size={28} className="text-white" />
                          </div>
                          <div className="font-bold text-xl">Bank Transfer</div>
                          <div className="text-white/70 text-sm mt-1">Local & International Wire Transfer</div>
                        </div>
                        <form onSubmit={handlePay} className="p-8">
                          <div className="bg-[#F6FBF8] rounded-2xl p-6 mb-6 border border-[#0B5D3F]/15">
                            <div className="text-sm font-black text-[#0B5D3F] uppercase tracking-wider mb-4">ESN Bank Account Details</div>
                            {[
                              ["Account Name", "Environmental Students Network BD"],
                              ["Account Number", "1234-5678-9012-3456"],
                              ["Bank", "Dutch-Bangla Bank Limited"],
                              ["Branch", "Motijheel Branch, Dhaka"],
                              ["Routing", "090261527"],
                              ["SWIFT Code", "DBBLBDDH"],
                            ].map(([label, value]) => (
                              <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                                <span className="text-xs text-gray-500 font-medium">{label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">{value}</span>
                                  <button type="button" onClick={() => copyRef(value)} className="text-[#0B5D3F] hover:text-[#4CAF50] transition-all"><Copy size={12} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction / Reference Number</label>
                            <input required className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all font-medium" placeholder="Enter your bank transfer reference" />
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-5 flex items-start gap-3">
                            <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-700">
                              Please include your name and "ESN Donation" in the transfer reference. Processing may take 1–3 business days for international transfers.
                            </div>
                          </div>
                          <button type="submit" disabled={processing} className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            {processing ? <><RefreshCw size={18} className="animate-spin" /> Processing…</> : <><CheckCircle2 size={18} /> Confirm Bank Transfer</>}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* PayPal Gateway */}
                    {payMethod === "paypal" && (
                      <div>
                        <div className="bg-[#003087] p-6 text-white text-center">
                          <PaypalLogo size={48} />
                          <div className="mt-3 font-bold text-xl">Pay with PayPal</div>
                          <div className="text-blue-200 text-sm mt-1">Secure, fast international payments</div>
                        </div>
                        <form onSubmit={handlePay} className="p-8">
                          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                            <div className="text-sm font-bold text-[#003087] mb-1">Send PayPal payment to</div>
                            <div className="flex items-center justify-between">
                              <div className="font-black text-lg text-gray-900">donate@esnglobal.org</div>
                              <button type="button" onClick={() => copyRef("donate@esnglobal.org")} className="flex items-center gap-1 text-xs bg-[#003087] text-white px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-all">
                                {copied ? <Check size={12} /> : <Copy size={12} />} Copy
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ESN Official PayPal Account · Friends & Family or Goods & Services</div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Your PayPal Email</label>
                            <input required type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#003087] transition-all font-medium" placeholder="your@paypal.com" />
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">PayPal Transaction ID</label>
                            <input required className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#003087] transition-all font-medium" placeholder="e.g. 1AB23456CD789012E" />
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-700">
                              Send <strong>{activeCurrency.symbol}{amount}</strong> USD via PayPal to the email above, then enter your transaction ID. Include "ESN Donation" in the note.
                            </div>
                          </div>
                          <button type="submit" disabled={processing} className="w-full mt-6 flex items-center justify-center gap-2 bg-[#003087] hover:bg-blue-900 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            {processing ? <><RefreshCw size={18} className="animate-spin" /> Processing…</> : <><CheckCircle2 size={18} /> Confirm PayPal Payment</>}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Card Payment */}
                    {payMethod === "card" && (
                      <div>
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 text-white">
                          {/* Card preview */}
                          <div className="max-w-xs mx-auto bg-gradient-to-br from-[#0B5D3F] via-[#1a6e4a] to-[#173B63] rounded-2xl p-6 shadow-2xl mb-4">
                            <div className="flex justify-between items-start mb-8">
                              <Leaf size={24} className="text-[#4CAF50]" />
                              <div className="text-right">
                                <div className="text-white/60 text-xs">Amount</div>
                                <div className="text-white font-black text-lg">{activeCurrency.symbol}{amount}</div>
                              </div>
                            </div>
                            <div className="font-mono text-white/80 tracking-widest text-sm mb-4">
                              {cardInfo.number ? cardInfo.number.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-white/50 text-xs">CARDHOLDER</div>
                                <div className="text-white text-sm font-semibold">{cardInfo.name || "YOUR NAME"}</div>
                              </div>
                              <div>
                                <div className="text-white/50 text-xs">EXPIRES</div>
                                <div className="text-white text-sm font-semibold">{cardInfo.expiry || "MM/YY"}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center text-white/60 text-xs">Demo card — no real charges made</div>
                        </div>
                        <form onSubmit={handlePay} className="p-8">
                          <div className="flex flex-col gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                              <div className="relative">
                                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input required value={cardInfo.number} onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] font-mono transition-all" placeholder="4242 4242 4242 4242" maxLength={16} />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                              <input required value={cardInfo.name} onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="Full name on card" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                                <input required value={cardInfo.expiry} onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="MM/YY" maxLength={5} />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                                <div className="relative">
                                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input required value={cardInfo.cvv} onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#F6FBF8] border border-gray-200 focus:outline-none focus:border-[#4CAF50] transition-all" placeholder="123" maxLength={4} />
                                </div>
                              </div>
                            </div>
                            {/* Card brand badges */}
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Lock size={12} /> SSL Secured · Accepts:
                              {["VISA", "MC", "AMEX", "JCB"].map((b) => (
                                <span key={b} className="px-2 py-0.5 bg-gray-100 rounded font-bold text-gray-500 text-xs">{b}</span>
                              ))}
                            </div>
                          </div>
                          <button type="submit" disabled={processing} className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0B5D3F] hover:bg-[#0a5237] disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            {processing ? <><RefreshCw size={18} className="animate-spin" /> Processing Payment…</> : <><Lock size={18} /> Pay {activeCurrency.symbol}{amount} Securely</>}
                          </button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Order summary */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h4 className="font-black text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Donation Summary</h4>
                <div className="flex flex-col gap-3 text-sm mb-4">
                  {[["Amount", `${activeCurrency.symbol}${amount}`], ["Frequency", frequency === "monthly" ? "Monthly" : "One-time"], ["Project", project], ["Trees Planted", `${trees} trees`]].map(([l, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-gray-500">{l}</span>
                      <span className="font-semibold text-gray-900 text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-[#0B5D3F] text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{activeCurrency.symbol}{amount}{frequency === "monthly" ? "/mo" : ""}</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-gradient-to-br from-[#0B5D3F] to-[#173B63] rounded-3xl p-6 text-white">
                <Shield size={24} className="text-[#4CAF50] mb-3" />
                <h4 className="font-bold text-white mb-3">100% Secure & Verified</h4>
                <div className="flex flex-col gap-2.5 text-sm">
                  {["SSL-encrypted transactions", "Tax-deductible receipt", "Impact report delivered", "No hidden fees", "Audited annually — GiveWell certified"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 size={13} className="text-[#4CAF50] shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocation */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Where Your Money Goes</h4>
                {[["70%", "Direct Projects", "#0B5D3F"], ["20%", "Operations", "#4CAF50"], ["10%", "Research", "#D6A95A"]].map(([pct, label, color]) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5"><span>{label}</span><span className="font-bold" style={{ color }}>{pct}</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-[#F6FBF8] rounded-3xl p-6 border border-[#0B5D3F]/10">
                <Star size={16} className="text-[#D6A95A] mb-3" />
                <p className="text-sm text-gray-600 italic leading-relaxed mb-3">"I donated $100 last year and received a stunning photo report of the trees planted in my name. It was deeply moving."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0B5D3F]/15 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-[#0B5D3F]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Sarah Chen</div>
                    <div className="text-xs text-gray-400">Singapore · Recurring donor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
