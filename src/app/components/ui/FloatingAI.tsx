import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, X, Send, Sparkles, Bot, Clock } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
};

export function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      sender: "ai", 
      text: "Hello! I'm your premium eco-assistant. I hold all the knowledge about our network. How can I help you today?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    // Advanced Regex Matching for Simulated Intelligence
    if (/\b(hi|hello|hey|greetings|howdy)\b/.test(text)) {
      return "Greetings! Welcome to our Environmental Network. How can I assist you on your journey toward a sustainable future today?";
    }
    if (/\b(how are you|how are u)\b/.test(text)) {
      return "I'm doing wonderfully, thank you for asking! I'm always ready to help protect the environment. What can I do for you?";
    }
    if (/\b(contact|reach|email|phone|call|address)\b/.test(text)) {
      return "You can reach our global headquarters directly at info@esnglobal.org or call us at +880 (123) 456-7890. We also have regional offices and a dedicated team operating worldwide!";
    }
    if (/\b(mission|purpose|goal|aim)\b/.test(text)) {
      return "Our mission is focused on Science-Backed Action, Youth Leadership, and Policy Advocacy. We empower local communities, especially youth, to lead climate adaptation efforts through direct action.";
    }
    if (/\b(vision|future|2030|plan)\b/.test(text)) {
      return "Our Vision 2030 is incredibly ambitious! We aim to establish 5,000+ Net-Zero Communities, achieve total Climate Justice, and ultimately build a fully Restored Planet.";
    }
    if (/\b(donate|support|fund|give|money|contribute)\b/.test(text)) {
      return "Thank you for your generosity! 100% of your contributions go toward our grassroots initiatives. You can support our ecosystem restoration projects by clicking the 'Donate' button in our main navigation bar.";
    }
    if (/\b(team|who|people|members|staff|founder|advisor|bd team)\b/.test(text)) {
      return "Our network is led by global climate scientists, dedicated youth advocates, and specialized regional teams (like our BD Team in Bangladesh). We are also guided by world-renowned advisors like Prof. Johan Rockström.";
    }
    if (/\b(impact|stats|statistics|results|achieved)\b/.test(text)) {
      return "Our impact speaks for itself: We have planted over 5 million trees, mobilized 200,000+ youth climate activists, and influenced over 15 major national climate policies globally.";
    }
    if (/\b(story|about|history|started)\b/.test(text)) {
      return "We started in 2018 as a small group of passionate university students who realized that traditional environmental activism lacked scientific rigor. Today, we're a global movement.";
    }
    if (/\b(program|projects|initiatives|what do you do)\b/.test(text)) {
      return "We run numerous premium programs including Coastal Resilience Frameworks, Youth Climate Academies, and direct policy advocacy at the UN. Check out our 'Programs' page for detailed case studies!";
    }
    
    return "That's a fantastic question! While my knowledge base is constantly expanding, I'm currently best equipped to answer questions about our mission, vision, history, team, and impact. Is there anything else you'd like to explore?";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: input.trim(), time: timeString };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseText = generateResponse(userMsg.text);
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: "ai", 
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500); // slightly longer premium delay
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="mb-6 w-[360px] sm:w-[420px] h-[550px] bg-white/80 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-[0_30px_80px_rgba(11,93,63,0.2)] flex flex-col overflow-hidden relative"
          >
            {/* Premium Header */}
            <div className="relative bg-[#0B5D3F]/95 backdrop-blur-lg pt-6 pb-5 px-6 text-white flex items-center justify-between border-b border-[#4CAF50]/30 shadow-lg">
              {/* Subtle background glow in header */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/20 blur-2xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#0B5D3F] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Eco Assistant</h3>
                  <p className="text-white/80 text-xs font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
                    <Sparkles size={10} className="text-[#D6A95A]" /> AI Powered Support
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all hover:rotate-90 duration-300">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-white/40">
              <div className="text-center pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full">Today</span>
              </div>
              
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-[15px] leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-br from-[#0B5D3F] to-[#174332] text-white rounded-tr-sm shadow-[0_10px_20px_rgba(11,93,63,0.2)]" 
                        : "bg-white border border-gray-100/50 text-gray-800 rounded-tl-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-60">
                      <Clock size={10} className={msg.sender === "user" ? "text-[#0B5D3F]" : "text-gray-500"} />
                      <span className={`text-[10px] font-bold ${msg.sender === "user" ? "text-[#0B5D3F]" : "text-gray-500"}`}>{msg.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="max-w-[80%] px-5 py-4 bg-white border border-gray-100/50 rounded-3xl rounded-tl-sm flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <span className="w-2.5 h-2.5 bg-[#4CAF50]/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 bg-[#4CAF50]/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 bg-[#4CAF50]/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white/80 backdrop-blur-xl border-t border-gray-100/50 relative z-10">
              <form onSubmit={handleSend} className="relative flex items-center group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#F6FBF8] border-2 border-gray-100 text-gray-800 text-[15px] font-medium rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-4 focus:ring-[#0B5D3F]/10 focus:border-[#0B5D3F]/40 transition-all placeholder:text-gray-400 placeholder:font-normal shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 w-11 h-11 bg-gradient-to-br from-[#0B5D3F] to-[#174332] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  Powered by <Sparkles size={10} className="text-[#D6A95A]" /> AI Intelligence
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#0B5D3F] text-white flex items-center justify-center shadow-[0_15px_40px_rgba(11,93,63,0.5)] hover:shadow-[0_20px_50px_rgba(11,93,63,0.7)] transition-all duration-500 hover:scale-110 group border-2 border-white/30"
      >
        {/* Pulsing ring behind button */}
        <div className="absolute inset-0 bg-[#4CAF50] rounded-full animate-ping opacity-20" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="leaf" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative z-10">
              <Leaf size={24} className="drop-shadow-lg group-hover:-rotate-12 transition-transform duration-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
