import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  return (
    <div className="bg-[#060B18] text-[#EDF2FF] min-h-screen pt-32 pb-20 font-sans relative">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] font-medium text-[#00E5FF] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
            The Process <div className="h-[1px] w-[60px] bg-gradient-to-r from-[#00E5FF] to-transparent" />
          </div>
          <h1 className="font-syne text-[32px] md:text-[52px] font-extrabold tracking-tight mb-4 leading-[1.1]">
            Interview-grade prep<br />in 3 focused steps
          </h1>
          <p className="text-[17px] text-[#8899BB] max-w-[500px] leading-[1.7] mb-16">
            No fluff. No random questions. A structured system that mirrors real interviews.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.08)] rounded-[20px] overflow-hidden">
          
          <div className="bg-[#060B18] p-12 hover:bg-[#0E1830] transition-colors group relative">
            <div className="font-syne text-[72px] font-extrabold text-white/[0.04] leading-none mb-6 group-hover:text-[#00E5FF] group-hover:drop-shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">01</div>
            <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[22px] mb-5">🎯</div>
            <h3 className="font-syne text-[20px] font-bold mb-2.5">Choose Your Path</h3>
            <p className="text-[15px] text-[#8899BB] leading-[1.7]">Select your role — Frontend, Backend, or MERN stack — and your experience level. The AI configures a personalized question set.</p>
          </div>
          
          <div className="bg-[#060B18] p-12 hover:bg-[#0E1830] transition-colors group relative">
            <div className="font-syne text-[72px] font-extrabold text-white/[0.04] leading-none mb-6 group-hover:text-[#8B5CF6] group-hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all">02</div>
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[22px] mb-5">⏱️</div>
            <h3 className="font-syne text-[20px] font-bold mb-2.5">Real Simulation</h3>
            <p className="text-[15px] text-[#8899BB] leading-[1.7]">Answer timed questions in sequence, just like a real interview. No hints, no cheating. The pressure builds confidence.</p>
          </div>
          
          <div className="bg-[#060B18] p-12 hover:bg-[#0E1830] transition-colors group relative">
            <div className="font-syne text-[72px] font-extrabold text-white/[0.04] leading-none mb-6 group-hover:text-[#10F4A0] group-hover:drop-shadow-[0_0_30px_rgba(16,244,160,0.4)] transition-all">03</div>
            <div className="w-12 h-12 rounded-xl bg-[#10F4A0]/10 border border-[#10F4A0]/20 flex items-center justify-center text-[22px] mb-5">📊</div>
            <h3 className="font-syne text-[20px] font-bold mb-2.5">Get Your Report</h3>
            <p className="text-[15px] text-[#8899BB] leading-[1.7]">Receive a detailed score breakdown, your exact weak areas, and specific improvement tips. Actionable, not generic.</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;