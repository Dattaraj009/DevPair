



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Play, Check, X as XIcon, LayoutDashboard, Settings } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(98);
  const [displayText, setDisplayText] = useState("");
  const [answerIndex, setAnswerIndex] = useState(0);
  const { onRegisterClick } = useOutletContext();

  const answers = [
    "useEffect runs asynchronously after paint, while useLayoutEffect runs synchronously...",
    "Virtual DOM is a lightweight copy of the real DOM that React uses...",
    "Closures allow inner functions to access variables from outer scope even after...",
    "Event delegation attaches a single listener to a parent element instead of..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 0 ? 120 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let i = 0;
    const currentFullText = answers[answerIndex];
    const typingInterval = setInterval(() => {
      if (i <= currentFullText.length) {
        setDisplayText(currentFullText.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setAnswerIndex((prev) => (prev + 1) % answers.length);
        }, 3000);
      }
    }, 35);
    return () => clearInterval(typingInterval);
  }, [answerIndex]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onRegisterClick();
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#030712] text-[#EDF2FF] font-sans overflow-x-hidden relative">
      
      {/* ─── BACKGROUND DECOR ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#00E5FF]/[0.03] blur-[120px] -top-[300px] -right-[100px]" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/[0.04] blur-[120px] bottom-[10%] -left-[10%]" />
      </div>

      {/* ─── 1. HERO SECTION ─── */}
      {/* <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-20 px-6 md:px-12"> */}
      <section id="hero" className="relative min-h-[calc(100vh-72px)] flex items-center pt-10 ...">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10F4A0] shadow-[0_0_10px_#10F4A0] animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#00E5FF] uppercase font-bold">AI Interview Engine — Active</span>
            </div>
            <h1 className="font-syne text-[48px] md:text-[76px] font-extrabold leading-[1.02] tracking-tight mb-8">
              Stop Practicing.<br />
              <span className="text-[#00E5FF]">Start Performing.</span><br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#00E5FF] to-[#00E5FF] bg-clip-text text-transparent">Crack Interviews.</span>
            </h1>
            <p className="text-[18px] text-slate-400 leading-relaxed max-w-[480px] mb-12 font-medium">
              IntervIQa simulates real technical interviews, identifies your exact weaknesses, and gives you a roadmap — not just answers.
            </p>
            <div className="flex flex-wrap items-center gap-5 mb-16">
              <button 
                onClick={handleGetStarted} 
                className="flex items-center gap-2 px-8 py-4 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] hover:shadow-[0_15px_45px_rgba(0,229,255,0.5)] transition-all hover:-translate-y-1 active:scale-95"
              >
                <Zap size={18} fill="currentColor" /> 
                {user ? 'Go to Dashboard' : 'Start Free Interview'}
              </button>
              <a href="#how-it-works" className="flex items-center gap-2 px-8 py-4 border border-white/5 bg-white/5 backdrop-blur-sm rounded-xl text-slate-300 hover:text-white transition-all">
                <Play size={18} fill="currentColor" /> See How It Works
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
              {[{v:"2.4K+", l:"Interviews"}, {v:"89%", l:"Accuracy"}, {v:"3x", l:"Faster Prep"}].map((s, i) => (
                <div key={i}>
                  <div className="font-syne text-2xl font-black text-white">{s.v}</div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-8 -right-4 z-20 w-48 p-5 bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
              <div className="font-mono text-[9px] text-slate-500 tracking-[0.2em] uppercase mb-2 font-bold">AI Evaluation</div>
              <div className="font-syne text-3xl font-black text-[#10F4A0]">82<span className="text-sm text-slate-500 font-normal">/100</span></div>
              <div className="space-y-2.5 mt-4">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#10F4A0] w-[82%]" /></div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#00E5FF] w-[68%]" /></div>
              </div>
            </motion.div>

            <div className="relative z-10 bg-[#0B1224] border border-white/10 rounded-[24px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <div className="px-3 py-1 rounded-md bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA] font-mono text-[10px] font-bold tracking-widest uppercase">MERN STACK</div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-500 text-xs">Q4 / 10</span>
                  <span className={`text-[28px] font-bold transition-colors ${seconds < 30 ? 'text-[#FF4466]' : 'text-[#FFB840]'}`}>{formatTime(seconds)}</span>
                </div>
              </div>
              <div className="h-[4px] w-full bg-white/5 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF] w-[40%]" />
              </div>
              <div className="mb-6">
                <div className="font-mono text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-[0.2em]">// Question</div>
                <p className="text-white text-lg font-semibold italic">Explain the difference between useEffect and useLayoutEffect.</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-5 min-h-[120px] font-mono text-sm text-slate-400 leading-relaxed mb-8">
                {displayText}<motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 bg-[#00E5FF] ml-1 align-middle" />
              </div>
              <div className="flex justify-between items-center">
                <button className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Skip Round →</button>
                <button className="px-6 py-3 bg-[#00E5FF] text-black font-syne font-bold text-xs rounded-lg shadow-lg">Submit Answer →</button>
              </div>
            </div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-8 -left-8 z-20 flex items-center gap-4 p-5 bg-[#0F172A]/95 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
              <span className="text-3xl">🔥</span>
              <div><div className="font-syne text-2xl font-black text-[#FFB840]">7</div><div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Day streak</div></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold text-[#00E5FF] tracking-[0.2em] uppercase mb-4">
            The Process <div className="h-[1px] w-12 bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">Interview-grade prep<br />in 3 focused steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {[
            { n: "01", t: "Choose Your Path", d: "Select role and experience level. The AI configures a personalized question set.", i: "🎯", color: "group-hover:text-[#00E5FF]" },
            { n: "02", t: "Real Simulation", d: "Answer timed questions in sequence. Build clarity under pressure.", i: "⏱️", color: "group-hover:text-[#8B5CF6]" },
            { n: "03", t: "Get Your Report", d: "Detailed scores on clarity, correctness, and depth with tips to improve.", i: "📊", color: "group-hover:text-[#10F4A0]" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#030712] p-12 hover:bg-slate-900/40 transition-all group relative">
              <div className={`font-syne text-[86px] font-black text-white/[0.03] leading-none mb-6 absolute top-4 right-8 transition-colors ${item.color}`}>{item.n}</div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 border border-white/10">{item.i}</div>
              <h3 className="font-syne text-2xl font-bold mb-4 text-white uppercase tracking-tighter">{item.t}</h3>
              <p className="text-[16px] text-slate-400 leading-relaxed font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. COMPARISON TABLE ─── */}
      <section id="comparison" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold text-[#00E5FF] tracking-[0.2em] uppercase mb-4">
            The Difference <div className="h-[1px] w-12 bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-4xl md:text-5xl font-black text-white mb-6">Why not just use ChatGPT?</h2>
          <p className="text-lg text-slate-400 max-w-[500px] mb-16 font-medium">IntervIQa prepares you to answer under pressure, while LLMs just give you the answer.</p>

          <div className="border border-white/10 rounded-3xl overflow-hidden bg-slate-900/30 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-3 bg-[#0B1224] border-b border-white/10">
              <div className="p-8 font-syne font-black text-sm text-white uppercase tracking-widest">Feature</div>
              <div className="p-8 font-syne font-bold text-sm text-slate-500 uppercase tracking-widest">ChatGPT</div>
              <div className="p-8 font-syne font-bold text-sm text-[#00E5FF] bg-[#00E5FF]/5 flex items-center gap-2 uppercase tracking-widest"><Zap size={16} fill="currentColor"/> IntervIQa</div>
            </div>
            {[
              "Real interview simulation", "Timed question flow", "Weakness tracking", 
              "Role-specific banks", "Answer scoring", "Progress reports"
            ].map((f, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <div className="p-6 text-slate-300 font-semibold text-sm">{f}</div>
                <div className="p-6 flex items-center"><XIcon size={20} className="text-slate-700" /></div>
                <div className="p-6 flex items-center bg-[#00E5FF]/[0.02]"><Check size={20} className="text-[#10F4A0]" /></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 4. DASHBOARD PREVIEW ─── */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold text-[#00E5FF] tracking-[0.2em] uppercase mb-4">
            The Product <div className="h-[1px] w-12 bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-3xl md:text-5xl font-extrabold text-white mb-6">Your command center for mastery</h2>
          
          <div className="rounded-[32px] border border-white/10 bg-[#0B1224] overflow-hidden shadow-2xl">
            <div className="bg-[#030712] border-b border-white/10 p-4 flex items-center gap-3">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F57]" /><div className="w-3 h-3 rounded-full bg-[#FEBC2E]" /><div className="w-3 h-3 rounded-full bg-[#28C840]" /></div>
              <div className="flex-1 max-w-[400px] mx-auto bg-white/5 rounded-lg py-1.5 text-center font-mono text-[10px] text-slate-500 border border-white/5 uppercase font-bold tracking-wider">app.interviqa.com/dashboard</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[500px]">
              <div className="hidden md:flex flex-col bg-[#030712] border-r border-white/10 p-8">
                <div className="font-syne font-black text-white mb-10 pl-2 text-xl tracking-tighter">Interv<span className="text-[#00E5FF]">IQa</span></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl text-xs font-bold transition-all"><LayoutDashboard size={18}/> Dashboard</div>
                  {["Start Interview", "My Reports", "Progress", "Settings"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"><Settings size={18}/> {item}</div>
                  ))}
                </div>
              </div>
              <div className="p-10 bg-[#0B1224]">
                <h3 className="font-syne text-2xl font-black mb-2 text-white">Good morning, <span className="text-[#00E5FF]">Developer 👋</span></h3>
                <p className="text-sm text-slate-500 mb-10 font-medium">You have 2 weak areas to focus on today</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[{i:"🎯", v:"12", l:"Interviews"}, {i:"📊", v:"74%", l:"Avg Score"}, {i:"⚠️", v:"3", l:"Weak Topics"}, {i:"🔥", v:"5", l:"Streak"}].map((s,i) => (
                    <div key={i} className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl">
                      <div className="mb-3 text-2xl">{s.i}</div>
                      <div className="font-syne text-2xl font-black text-white leading-none mb-1">{s.v}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
                    <div className="font-syne text-sm font-black mb-6 flex justify-between text-white uppercase tracking-widest">Recent Activity <span className="text-[10px] text-[#00E5FF] font-bold">View all →</span></div>
                    {[{r:"Frontend • Fresher", s:"82%"}, {r:"Node.js • Mid", s:"67%"}, {r:"MERN • Fresher", s:"41%"}].map((x,i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-white/5 last:border-0 text-sm font-medium"><span className="text-slate-400">{x.r}</span><span className="text-[#10F4A0] font-mono font-bold">{x.s}</span></div>
                    ))}
                  </div>
                  <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
                    <div className="font-syne text-sm font-black mb-6 text-white uppercase tracking-widest">Skill Gaps</div>
                    {[{t:"React Hooks", p:"42%"}, {t:"MongoDB Agg", p:"38%"}, {t:"Node Async", p:"55%"}].map((x,i) => (
                      <div key={i} className="mb-5 last:mb-0">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-2 font-bold uppercase tracking-wider"><span>{x.t}</span><span className="text-[#FFB840] font-mono">{x.p}</span></div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-[#FFB840] to-[#FF4466]" style={{width:x.p}} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 5. SOCIAL PROOF SECTION ─── */}
      <section id="social-proof" className="py-32 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
           <div className="font-mono text-[11px] font-bold text-[#00E5FF] tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            Social Proof <div className="h-[1px] w-12 bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-4xl md:text-6xl font-black text-white mb-14 leading-tight tracking-tight">Developers who cracked it</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "I failed 4 interviews before IntervIQa. The weakness tracking changed everything.", n: "Ankit Verma", r: "Frontend Dev @ Razorpay", bg: "from-blue-600 to-indigo-700", init: "A" },
              { q: "The timed questions made me realize I was way slower than I thought. Now I am ready.", n: "Sneha Reddy", r: "Full Stack Dev @ Swiggy", bg: "from-pink-600 to-rose-700", init: "S" },
              { q: "As a fresher, IntervIQa gave me mock runs before my first real one. I was calm.", n: "Rohan Mehta", r: "Node.js Dev @ Freshworks", bg: "from-cyan-600 to-teal-700", init: "R" }
            ].map((t, i) => (
              <div key={i} className="bg-[#0B1224] border border-white/5 rounded-3xl p-10 relative hover:border-[#00E5FF]/30 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                <div className="absolute top-4 right-8 font-syne text-8xl font-black text-[#00E5FF]/5 leading-none opacity-20 group-hover:opacity-40 transition-opacity">"</div>
                <div className="text-[#FFB840] text-sm mb-6 font-bold tracking-widest">★★★★★</div>
                <p className="text-[16px] text-slate-400 leading-relaxed mb-8 italic">"{t.q}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center font-bold text-white border-2 border-white/10 shadow-lg`}>{t.init}</div>
                  <div><div className="font-syne font-bold text-white">{t.n}</div><div className="text-xs text-slate-500 font-bold tracking-wider">{t.r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── 6. READY TO BEGIN ─── */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-slate-900 border border-[#00E5FF]/20 rounded-[40px] p-16 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.1),transparent_70%)] pointer-events-none" />
          <p className="font-mono text-[12px] text-[#00E5FF] tracking-[0.3em] mb-6 relative font-black uppercase">// Prepare smarter</p>
          <h2 className="font-syne text-4xl md:text-6xl font-black tracking-tighter mb-8 relative text-white">Your next interview starts here.</h2>
          <div className="flex justify-center mt-12 relative">
            <button 
              onClick={handleGetStarted} 
              className="px-10 py-5 bg-[#00E5FF] rounded-2xl text-black text-[16px] font-black shadow-lg transition-all hover:-translate-y-1 hover:brightness-110 active:scale-95"
            >
              {user ? 'Go to Dashboard' : 'Get Started for Free'}
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;