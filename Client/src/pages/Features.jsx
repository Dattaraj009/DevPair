import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  return (
    <div className="bg-[#060B18] text-[#EDF2FF] min-h-screen pt-32 pb-20 font-sans relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* VS TABLE SECTION */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-32">
          <div className="font-mono text-[11px] font-medium text-[#00E5FF] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
            The Difference <div className="h-[1px] w-[60px] bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-[32px] md:text-[52px] font-extrabold tracking-tight mb-4 leading-[1.1]">Why not just<br />use ChatGPT?</h2>
          <p className="text-[17px] text-[#8899BB] max-w-[500px] leading-[1.7] mb-16">
            ChatGPT answers questions. IntervIQa prepares you to answer them under pressure.
          </p>

          <div className="border border-[rgba(0,229,255,0.08)] rounded-[20px] overflow-hidden max-w-5xl">
            <div className="grid grid-cols-4 bg-[#0E1830] border-b border-[rgba(0,229,255,0.08)]">
              <div className="col-span-2 p-5 font-syne text-[14px] font-bold tracking-[0.05em]">Feature</div>
              <div className="col-span-1 p-5 font-syne text-[14px] font-bold tracking-[0.05em] text-[#4A5A80]">ChatGPT</div>
              <div className="col-span-1 p-5 font-syne text-[14px] font-bold tracking-[0.05em] text-[#00E5FF] bg-[#00E5FF]/[0.04] flex items-center gap-2">⚡ IntervIQa</div>
            </div>
            {[
              "Real interview simulation", "Timed question flow", "Weakness tracking across sessions", 
              "Role-specific question banks", "Answer evaluation + scoring", "Interview reports with tips", "Admin question control"
            ].map((f, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-[rgba(0,229,255,0.08)] hover:bg-white/[0.02] transition-colors last:border-0">
                <div className="col-span-2 p-[18px_32px] text-[14px] text-[#EDF2FF] font-medium">{f}</div>
                <div className="col-span-1 p-[18px_32px] flex items-center text-[#4A5A80] text-[18px]">✕</div>
                <div className="col-span-1 p-[18px_32px] flex items-center bg-[#00E5FF]/[0.02] text-[#10F4A0] text-[18px]">✓</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DASHBOARD PREVIEW SECTION */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] font-medium text-[#00E5FF] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
            The Product <div className="h-[1px] w-[60px] bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h2 className="font-syne text-[32px] md:text-[52px] font-extrabold tracking-tight mb-4 leading-[1.1]">Your command center<br />for interview mastery</h2>
          <p className="text-[17px] text-[#8899BB] max-w-[500px] leading-[1.7] mb-16">Track every interview, monitor weak spots, and watch yourself improve — all in one dashboard.</p>

          <div className="bg-[#0E1830] border border-[rgba(0,229,255,0.08)] rounded-[24px] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.5),0_0_40px_rgba(0,229,255,0.12)]">
            <div className="bg-[#0C1428] border-b border-[rgba(0,229,255,0.08)] p-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" /><div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" /><div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <div className="flex-1 max-w-[300px] mx-auto bg-white/[0.04] rounded-[6px] py-1 text-center font-mono text-[11px] text-[#4A5A80]">app.intervIQa.com/dashboard</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[480px]">
              <div className="hidden md:block bg-[#0C1428] border-r border-[rgba(0,229,255,0.08)] p-7">
                <div className="font-syne text-[16px] font-extrabold text-[#EDF2FF] mb-8 pl-1">Interv<span className="text-[#00E5FF]">IQa</span></div>
                <div className="flex items-center gap-2.5 p-[9px_12px] rounded-lg text-[13px] bg-[#00E5FF]/[0.08] text-[#00E5FF] border border-[#00E5FF]/15 mb-1">⊞ Dashboard</div>
                <div className="flex items-center gap-2.5 p-[9px_12px] rounded-lg text-[13px] text-[#4A5A80] mb-1">▶ Start Interview</div>
                <div className="flex items-center gap-2.5 p-[9px_12px] rounded-lg text-[13px] text-[#4A5A80] mb-1">📋 My Reports</div>
              </div>

              <div className="p-7 md:p-8">
                <div className="font-syne text-[20px] font-bold mb-1.5">Good morning, <span className="text-[#00E5FF]">Aryan 👋</span></div>
                <div className="text-[13px] text-[#4A5A80] mb-6">You have 2 weak areas to focus on today</div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[{i:"🎯", v:"12", l:"Total Interviews", c:"text-[#00E5FF]"}, {i:"📊", v:"74%", l:"Avg Score", c:"text-[#10F4A0]"}, {i:"⚠️", v:"3", l:"Weak Topics", c:"text-[#FFB840]"}, {i:"🔥", v:"5", l:"Day Streak", c:"text-[#A78BFA]"}].map((s,i) => (
                    <div key={i} className="bg-[#101B36] border border-[rgba(0,229,255,0.08)] rounded-xl p-4">
                      <div className="text-[18px] mb-2">{s.i}</div>
                      <div className={`font-syne text-[22px] font-extrabold leading-none mb-1 ${s.c}`}>{s.v}</div>
                      <div className="text-[11px] text-[#4A5A80]">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-[#101B36] border border-[rgba(0,229,255,0.08)] rounded-xl p-5">
                    <div className="font-syne text-[13px] font-bold mb-4 flex justify-between">Recent Interviews <span className="font-sans text-[11px] font-normal text-[#00E5FF]">View all →</span></div>
                    {[{r:"Frontend Dev • Fresher", s:"82%", c:"text-[#10F4A0]"}, {r:"Node.js • Mid", s:"67%", c:"text-[#FFB840]"}, {r:"MERN Stack • Fresher", s:"41%", c:"text-[#FF4466]"}].map((x,i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-0 text-[12px]">
                        <span className="text-[#8899BB]">{x.r}</span><span className={`font-mono font-medium ${x.c}`}>{x.s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#101B36] border border-[rgba(0,229,255,0.08)] rounded-xl p-5">
                    <div className="font-syne text-[13px] font-bold mb-4">Weak Areas</div>
                    {[{t:"React Hooks", p:"42%"}, {t:"MongoDB Agg", p:"38%"}, {t:"Node.js Async", p:"55%"}].map((x,i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-[12px] text-[#8899BB] mb-1.5"><span>{x.t}</span><span className="font-mono text-[#FFB840]">{x.p}</span></div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#FFB840] to-[#FF4466]" style={{width: x.p}} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;