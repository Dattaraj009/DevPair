

// import React, { useState } from 'react'; // ✅ FIXED: Added React import for cloneElement
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';

// import api from '../../api/axios';
// import { 
//   Trophy, TrendingUp, Target, Clock, CheckCircle2, 
//   XCircle, AlertCircle, Lightbulb, ChevronDown, 
//   ChevronUp, RotateCcw, Home, Zap, Award, Star, Loader2
// } from 'lucide-react';

// const ReportPage = () => {
//   const { sessionId } = useParams();
//   const navigate = useNavigate();
//   const [expandedQuestion, setExpandedQuestion] = useState(null);

//   // Fetch report data
//   const { data: reportData, isLoading, isError } = useQuery({
//     queryKey: ['report', sessionId],
//     queryFn: async () => {
//       const res = await api.get(`/reports/${sessionId}`);
//       return res.data.data;
//     },
//     enabled: !!sessionId,
//     retry: 1
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-16 h-16 text-[#00E5FF] animate-spin mx-auto mb-4" />
//           <p className="text-[#8899BB] font-mono">Generating your IntervIQa report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !reportData) {
//     return (
//       <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
//         <div className="text-center p-8 bg-[#0E1830] border border-white/5 rounded-2xl">
//           <AlertCircle className="w-16 h-16 text-[#FF4466] mx-auto mb-4" />
//           <p className="text-white font-bold mb-2">Report Not Found</p>
//           <p className="text-[#8899BB] text-sm mb-6">We couldn't retrieve the data for this session.</p>
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="px-6 py-2 bg-[#00E5FF] text-black font-bold rounded-lg hover:opacity-90 transition-all"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { 
//     totalScore = 0, 
//     answers = [], 
//     strengths = [], 
//     weakAreas = [], 
//     overallFeedback = "Keep practicing to see your detailed feedback here.", 
//     role = "Developer", 
//     experience = "N/A" 
//   } = reportData;
  
//   const getScoreColor = (score) => {
//     if (score >= 70) return { text: 'text-[#10F4A0]', bg: 'bg-[#10F4A0]/10', border: 'border-[#10F4A0]/30' };
//     if (score >= 50) return { text: 'text-[#FFB840]', bg: 'bg-[#FFB840]/10', border: 'border-[#FFB840]/30' };
//     return { text: 'text-[#FF4466]', bg: 'bg-[#FF4466]/10', border: 'border-[#FF4466]/30' };
//   };

//   const getScoreMessage = (score) => {
//     if (score >= 90) return { emoji: '🏆', message: 'Outstanding Performance!' };
//     if (score >= 70) return { emoji: '🎉', message: 'Great Job!' };
//     if (score >= 50) return { emoji: '👍', message: 'Good Effort!' };
//     return { emoji: '💪', message: 'Keep Practicing!' };
//   };

//   const scoreColor = getScoreColor(totalScore);
//   const scoreMessage = getScoreMessage(totalScore);
  
//   // Calculate Avg Score safely
//   const averageAnswerScore = answers.length > 0 
//     ? Math.round(answers.reduce((sum, a) => sum + (a.answerScore || 0), 0) / answers.length) 
//     : 0;

//   return (
//     <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24 pb-20">
//       <div className="max-w-5xl mx-auto">
        
//         {/* Hero Score Section */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 mb-6">
//             <span className="text-[#A78BFA] font-mono text-xs uppercase tracking-widest">
//               {role} · {experience}
//             </span>
//           </div>

//           <h1 className="font-syne text-4xl md:text-6xl font-extrabold mb-4">
//             {scoreMessage.emoji} {scoreMessage.message}
//           </h1>
          
//           <div className="relative inline-block mb-6">
//             <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${scoreColor.bg} border-4 ${scoreColor.border} flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(0,229,255,0.1)]`}>
//               <div className="text-center">
//                 <div className={`font-syne text-6xl md:text-8xl font-extrabold ${scoreColor.text}`}>
//                   {totalScore}
//                 </div>
//                 <div className="text-[#4A5A80] text-sm font-mono">/ 100</div>
//               </div>
//             </div>
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-full flex items-center justify-center"
//             >
//               <Trophy className="w-8 h-8 text-white" />
//             </motion.div>
//           </div>

//           <p className="text-[#8899BB] max-w-2xl mx-auto leading-relaxed">
//             {overallFeedback}
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//           <StatCard icon={<CheckCircle2 />} label="Questions" value={answers.length} color="cyan" />
//           <StatCard icon={<TrendingUp />} label="Avg Score" value={`${averageAnswerScore}/10`} color="violet" />
//           <StatCard icon={<Target />} label="Weak Areas" value={weakAreas.length} color="yellow" />
//           <StatCard icon={<Star />} label="Strengths" value={strengths.length} color="green" />
//         </div>

//         {/* Strengths & Weaknesses */}
//         <div className="grid md:grid-cols-2 gap-6 mb-10">
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0E1830] border border-white/5 rounded-2xl p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 rounded-xl bg-[#10F4A0]/10 flex items-center justify-center"><Trophy className="w-5 h-5 text-[#10F4A0]" /></div>
//               <h3 className="font-syne text-xl font-bold">Your Strengths</h3>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {strengths.length > 0 ? strengths.map((s, i) => (
//                 <span key={i} className="px-4 py-2 bg-[#10F4A0]/10 border border-[#10F4A0]/30 text-[#10F4A0] rounded-lg text-sm font-semibold">✓ {s}</span>
//               )) : <p className="text-[#4A5A80] text-sm italic">Keep answering to reveal strengths.</p>}
//             </div>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0E1830] border border-white/5 rounded-2xl p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 rounded-xl bg-[#FF4466]/10 flex items-center justify-center"><Target className="w-5 h-5 text-[#FF4466]" /></div>
//               <h3 className="font-syne text-xl font-bold">Areas to Improve</h3>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {weakAreas.length > 0 ? weakAreas.map((w, i) => (
//                 <span key={i} className="px-4 py-2 bg-[#FF4466]/10 border border-[#FF4466]/30 text-[#FF4466] rounded-lg text-sm font-semibold">⚠ {w}</span>
//               )) : <p className="text-[#4A5A80] text-sm italic">Excellent performance across all areas!</p>}
//             </div>
//           </motion.div>
//         </div>

//         {/* Detailed Breakdown */}
//         <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 md:p-8 mb-10 shadow-xl">
//           <h3 className="font-syne text-2xl font-bold mb-6 flex items-center gap-3">
//             <Award className="w-6 h-6 text-[#00E5FF]" /> Detailed Breakdown
//           </h3>
//           <div className="space-y-4">
//             {answers.map((answer, index) => (
//               <QuestionCard
//                 key={index}
//                 question={answer}
//                 index={index}
//                 expanded={expandedQuestion === index}
//                 onToggle={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-4 justify-center">
//           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105 transition-all">
//             <Home size={20} /> Back to Dashboard
//           </button>
//           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-8 py-3 border-2 border-[#8B5CF6] text-[#8B5CF6] font-syne font-bold rounded-xl hover:bg-[#8B5CF6]/10 hover:scale-105 transition-all">
//             <RotateCcw size={20} /> Retake Interview
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── HELPERS & SUBCOMPONENTS ───────────────────────────────────────────────

// const StatCard = ({ icon, label, value, color }) => {
//   const colors = {
//     cyan: 'text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/10',
//     violet: 'text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/10',
//     yellow: 'text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/10',
//     green: 'text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/10',
//   };

//   return (
//     <div className={`p-6 rounded-2xl border ${colors[color]} group hover:-translate-y-1 transition-all`}>
//       <div className="flex items-center justify-between mb-3">
//         <div className="p-2 bg-white/5 rounded-lg">
//           {React.cloneElement(icon, { className: 'w-5 h-5' })}
//         </div>
//       </div>
//       <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest mb-1">{label}</p>
//       <h4 className="text-2xl font-syne font-extrabold">{value}</h4>
//     </div>
//   );
// };

// const QuestionCard = ({ question, index, expanded, onToggle }) => {
//   const { questionText, userAnswer, scores, answerScore, feedback, tip, skillTags, isSkipped } = question;
  
//   const getScoreColor = (score) => {
//     if (score >= 7) return { text: 'text-[#10F4A0]', bg: 'bg-[#10F4A0]/10', icon: CheckCircle2 };
//     if (score >= 5) return { text: 'text-[#FFB840]', bg: 'bg-[#FFB840]/10', icon: AlertCircle };
//     return { text: 'text-[#FF4466]', bg: 'bg-[#FF4466]/10', icon: XCircle };
//   };

//   const scoreStyle = getScoreColor(answerScore);
//   const ScoreIcon = scoreStyle.icon;

//   return (
//     <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-[#00E5FF]/20 transition-all">
//       <button onClick={onToggle} className="w-full p-5 flex items-center justify-between text-left">
//         <div className="flex items-center gap-4 flex-1">
//           <div className={`w-10 h-10 rounded-lg ${scoreStyle.bg} ${scoreStyle.text} flex items-center justify-center font-bold text-sm`}>
//             {isSkipped ? '—' : answerScore}
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-medium text-white mb-1">Question {index + 1}</p>
//             <p className="text-xs text-[#8899BB] line-clamp-1">{questionText}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           {!isSkipped && <ScoreIcon className={`w-5 h-5 ${scoreStyle.text}`} />}
//           {expanded ? <ChevronUp className="w-5 h-5 text-[#4A5A80]" /> : <ChevronDown className="w-5 h-5 text-[#4A5A80]" />}
//         </div>
//       </button>

//       <AnimatePresence>
//         {expanded && (
//           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 p-5 space-y-4">
//             <div>
//               <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest mb-2">Question</p>
//               <p className="text-white leading-relaxed">{questionText}</p>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {skillTags?.map((tag, i) => (
//                   <span key={i} className="text-[10px] text-[#8899BB] bg-white/10 px-2 py-1 rounded">#{tag}</span>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest mb-2">Your Answer</p>
//               <p className="text-[#8899BB] bg-black/30 p-4 rounded-lg font-mono text-sm leading-relaxed border border-white/5">
//                 {isSkipped ? <span className="text-[#FF4466] italic">Question skipped</span> : (userAnswer || 'No answer provided')}
//               </p>
//             </div>

//             {!isSkipped && scores && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
//                 <ScoreBar label="Correctness" value={scores.correctness} />
//                 <ScoreBar label="Clarity" value={scores.clarity} />
//                 <ScoreBar label="Depth" value={scores.depth} />
//               </div>
//             )}

//             {feedback && (
//               <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-lg p-4">
//                 <p className="text-[10px] text-[#00E5FF] font-mono uppercase tracking-widest mb-2">AI Feedback</p>
//                 <p className="text-white text-sm leading-relaxed">{feedback}</p>
//               </div>
//             )}

//             {tip && (
//               <div className="flex items-start gap-3 bg-[#FFB840]/5 border border-[#FFB840]/20 rounded-lg p-4">
//                 <Lightbulb className="w-5 h-5 text-[#FFB840] flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-[10px] text-[#FFB840] font-mono uppercase tracking-widest mb-1">Pro Tip</p>
//                   <p className="text-[#FFB840] text-sm leading-relaxed">{tip}</p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// const ScoreBar = ({ label, value }) => (
//   <div>
//     <div className="flex justify-between items-center mb-2">
//       <span className="text-[10px] text-[#4A5A80] font-mono uppercase">{label}</span>
//       <span className="text-xs font-bold text-[#00E5FF]">{value}/10</span>
//     </div>
//     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
//       <motion.div
//         initial={{ width: 0 }}
//         animate={{ width: `${(value / 10) * 100}%` }}
//         transition={{ duration: 1 }}
//         className={`h-full rounded-full ${value >= 7 ? 'bg-[#10F4A0]' : value >= 5 ? 'bg-[#FFB840]' : 'bg-[#FF4466]'}`}
//       />
//     </div>
//   </div>
// );

// export default ReportPage;











import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import api from '../../api/axios';
// import { 
//   Trophy, TrendingUp, Target, Clock, CheckCircle2, 
//   XCircle, AlertCircle, Lightbulb, ChevronDown, 
//   ChevronUp, RotateCcw, Home, Zap, Award, Star, Loader2, Play
// } from 'lucide-react';

import { 
  Trophy, TrendingUp, Target, Clock, CheckCircle2, 
  XCircle, AlertCircle, Lightbulb, ChevronDown, 
  ChevronUp, RotateCcw, Home, Zap, Award, Star, Loader2, Play, BarChart3, User
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ReportPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Fetch report data
  const { data: reportData, isLoading, isError } = useQuery({
    queryKey: ['report', sessionId],
    queryFn: async () => {
      const res = await api.get(`/reports/${sessionId}`);
      return res.data.data;
    },
    enabled: !!sessionId,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00E5FF] blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF] relative z-10" />
          </div>
          <p className="text-[#8899BB] font-mono text-sm tracking-[0.2em] uppercase animate-pulse">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (isError || !reportData) {
    return (
      <div className="w-full h-[calc(100vh-72px)] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10 bg-[#0B1224] border border-white/5 rounded-[24px] shadow-2xl max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-[#FF4466] mx-auto mb-6 opacity-80" />
          <h2 className="font-syne text-2xl font-bold text-white mb-2">Report Not Found</h2>
          <p className="text-[#8899BB] text-sm mb-8 leading-relaxed">We couldn't retrieve the data for this session. It may have expired or been deleted.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-bold rounded-xl hover:bg-[#00E5FF] hover:text-black transition-all duration-300"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const { 
    totalScore = 0, 
    answers = [], 
    strengths = [], 
    weakAreas = [], 
    overallFeedback = "Keep practicing to see your detailed feedback here.", 
    role = "Developer", 
    experience = "N/A" 
  } = reportData;
  
  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-[#10F4A0]', bg: 'bg-[#10F4A0]/10', border: 'border-[#10F4A0]/30', shadow: 'shadow-[0_0_50px_rgba(16,244,160,0.15)]' };
    if (score >= 50) return { text: 'text-[#FFB840]', bg: 'bg-[#FFB840]/10', border: 'border-[#FFB840]/30', shadow: 'shadow-[0_0_50px_rgba(255,184,64,0.15)]' };
    return { text: 'text-[#FF4466]', bg: 'bg-[#FF4466]/10', border: 'border-[#FF4466]/30', shadow: 'shadow-[0_0_50px_rgba(255,68,102,0.15)]' };
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return { emoji: '🏆', message: 'Exceptional Performance!' };
    if (score >= 70) return { emoji: '🎉', message: 'Great Job!' };
    if (score >= 50) return { emoji: '👍', message: 'Solid Effort!' };
    return { emoji: '💪', message: 'Keep Practicing!' };
  };

  const scoreColor = getScoreColor(totalScore);
  const scoreMessage = getScoreMessage(totalScore);
  
  const averageAnswerScore = answers.length > 0 
    ? Math.round(answers.reduce((sum, a) => sum + (a.answerScore || 0), 0) / answers.length) 
    : 0;

  return (
    <div className="w-full text-[#EDF2FF] p-6 md:p-10">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-5xl mx-auto"
      >
        
        {/* Top Actions */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#8899BB] hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10">
              <Home size={16} /> Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                <span className="text-[#A78BFA] font-mono text-[10px] uppercase tracking-widest font-bold">
                  {role} Developer
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
                 <span className="text-[#8899BB] font-mono text-[10px] uppercase tracking-widest font-bold">
                  {experience}
                 </span>
              </div>
            </div>
        </motion.div>

        {/* Hero Score Section */}
        <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[32px] p-10 md:p-16 text-center mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00E5FF]/[0.02] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#8B5CF6]/[0.02] rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <h1 className="font-syne text-3xl md:text-5xl font-extrabold mb-10">
              {scoreMessage.emoji} {scoreMessage.message}
            </h1>
            
            <div className="relative inline-block mb-10">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${scoreColor.bg} border-4 ${scoreColor.border} flex items-center justify-center mx-auto ${scoreColor.shadow} relative z-10 backdrop-blur-sm`}>
                <div className="text-center">
                  <div className={`font-syne text-7xl md:text-8xl font-black ${scoreColor.text} tracking-tighter`}>
                    {totalScore}
                  </div>
                  <div className="text-[#4A5A80] text-sm font-mono font-bold tracking-widest uppercase mt-1">/ 100 Score</div>
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg z-20"
              >
                <Trophy className="w-8 h-8 text-white drop-shadow-md" />
              </motion.div>
            </div>

            <p className="text-[#8899BB] max-w-2xl mx-auto leading-relaxed text-lg bg-[#060B18]/50 p-6 rounded-2xl border border-white/5">
              "{overallFeedback}"
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<CheckCircle2 />} label="Questions" value={answers.length} color="cyan" />
          <StatCard icon={<TrendingUp />} label="Avg Score" value={`${averageAnswerScore}/10`} color="violet" />
          <StatCard icon={<Target />} label="Weak Areas" value={weakAreas.length} color="yellow" />
          <StatCard icon={<Star />} label="Strengths" value={strengths.length} color="green" />
        </motion.div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#10F4A0]/10 flex items-center justify-center"><Trophy className="w-6 h-6 text-[#10F4A0]" /></div>
              <h3 className="font-syne text-2xl font-bold">Your Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {strengths.length > 0 ? strengths.map((s, i) => (
                <span key={i} className="px-4 py-2.5 bg-[#10F4A0]/5 border border-[#10F4A0]/20 text-[#10F4A0] rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2">
                  <CheckCircle2 size={14}/> {s}
                </span>
              )) : <p className="text-[#4A5A80] text-sm italic py-2">Keep answering questions to reveal strengths.</p>}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#FF4466]/10 flex items-center justify-center"><Target className="w-6 h-6 text-[#FF4466]" /></div>
              <h3 className="font-syne text-2xl font-bold">Areas to Improve</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {weakAreas.length > 0 ? weakAreas.map((w, i) => (
                <span key={i} className="px-4 py-2.5 bg-[#FF4466]/5 border border-[#FF4466]/20 text-[#FF4466] rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2">
                  <AlertCircle size={14}/> {w}
                </span>
              )) : <p className="text-[#4A5A80] text-sm italic py-2">Excellent performance across all areas!</p>}
            </div>
          </motion.div>
        </div>

        {/* Detailed Breakdown */}
        <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-6 md:p-10 mb-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-32 bg-gradient-to-r from-transparent to-[#00E5FF]/[0.02]" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
            <div>
              <h3 className="font-syne text-3xl font-extrabold flex items-center gap-3">
                 Detailed Breakdown
              </h3>
              <p className="text-[#8899BB] font-mono text-[11px] uppercase tracking-widest font-bold mt-2">
                 // Review your answers and AI feedback
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {answers.map((answer, index) => (
              <QuestionCard
                key={index}
                question={answer}
                index={index}
                expanded={expandedQuestion === index}
                onToggle={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex justify-center items-center gap-2 px-8 py-4 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:-translate-y-1 transition-all"
          >
             Start New Session <Play size={18} fill="currentColor" />
          </button>
          <button 
            onClick={() => navigate('/progress')} 
            className="flex justify-center items-center gap-2 px-8 py-4 border-2 border-white/10 bg-white/5 text-white font-syne font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            <BarChart3 size={18} /> View All Progress
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─── HELPERS & SUBCOMPONENTS ───────────────────────────────────────────────

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    cyan: 'text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/20',
    violet: 'text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/20',
    yellow: 'text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/20',
    green: 'text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/20',
  };

  return (
    <div className={`p-6 rounded-[20px] bg-[#060B18] border ${colors[color]} group hover:-translate-y-1 transition-all shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
      </div>
      <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-1">{label}</p>
      <h4 className="text-3xl font-syne font-extrabold text-white">{value}</h4>
    </div>
  );
};

const QuestionCard = ({ question, index, expanded, onToggle }) => {
  const { questionText, userAnswer, scores, answerScore, feedback, tip, skillTags, isSkipped } = question;
  
  const getScoreColor = (score) => {
    if (score >= 8) return { text: 'text-[#10F4A0]', bg: 'bg-[#10F4A0]/10', border: 'border-[#10F4A0]/30', icon: CheckCircle2 };
    if (score >= 5) return { text: 'text-[#FFB840]', bg: 'bg-[#FFB840]/10', border: 'border-[#FFB840]/30', icon: AlertCircle };
    return { text: 'text-[#FF4466]', bg: 'bg-[#FF4466]/10', border: 'border-[#FF4466]/30', icon: XCircle };
  };

  const scoreStyle = getScoreColor(answerScore);
  const ScoreIcon = scoreStyle.icon;

  return (
    <div className={`bg-[#060B18] border rounded-2xl overflow-hidden transition-all duration-300 ${expanded ? 'border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.05)]' : 'border-white/5 hover:border-white/20'}`}>
      <button 
        onClick={onToggle} 
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-5 flex-1 pr-4">
          <div className={`w-12 h-12 rounded-xl ${scoreStyle.bg} border ${scoreStyle.border} ${scoreStyle.text} flex items-center justify-center font-bold text-lg shrink-0`}>
            {isSkipped ? '—' : answerScore}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-mono font-bold text-[#4A5A80] uppercase tracking-widest mb-1">
              Question {String(index + 1).padStart(2, '0')}
            </p>
            <p className={`text-sm font-medium transition-colors ${expanded ? 'text-white' : 'text-[#8899BB] group-hover:text-white line-clamp-1'}`}>
              {questionText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0 border-l border-white/5 pl-4">
          {!isSkipped && <ScoreIcon className={`w-5 h-5 ${scoreStyle.text}`} />}
          <div className={`p-1.5 rounded-lg transition-colors ${expanded ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'bg-white/5 text-[#4A5A80]'}`}>
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="border-t border-white/5 p-6 md:p-8 bg-gradient-to-b from-white/[0.02] to-transparent space-y-8"
          >
            {/* Tags */}
            {skillTags && skillTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillTags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-[#8899BB] border border-white/10 bg-[#0B1224] px-3 py-1.5 rounded-lg font-mono uppercase tracking-wider font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Answer Display */}
            <div>
              <p className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                <User size={14}/> Transcript
              </p>
              <div className="bg-[#0B1224] border border-white/5 p-5 rounded-xl">
                <p className="text-[#EDF2FF] font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {isSkipped ? <span className="text-[#FF4466] italic flex items-center gap-2"><XCircle size={16}/> Question skipped</span> : (userAnswer || 'No transcript available.')}
                </p>
              </div>
            </div>

            {/* AI Scoring Breakdown */}
            {!isSkipped && scores && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                <ScoreBar label="Correctness" value={scores.correctness} color="#10F4A0" />
                <ScoreBar label="Clarity" value={scores.clarity} color="#00E5FF" />
                <ScoreBar label="Depth" value={scores.depth} color="#8B5CF6" />
              </div>
            )}

            {/* Feedback & Tip */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {feedback && (
                <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-[40px]"/>
                  <p className="text-[11px] text-[#00E5FF] font-mono uppercase tracking-widest mb-3 font-bold flex items-center gap-2 relative z-10">
                    <Zap size={14}/> AI Evaluation
                  </p>
                  <p className="text-white text-sm leading-relaxed relative z-10">{feedback}</p>
                </div>
              )}

              {tip && (
                <div className="bg-[#FFB840]/5 border border-[#FFB840]/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB840]/10 rounded-full blur-[40px]"/>
                  <p className="text-[11px] text-[#FFB840] font-mono uppercase tracking-widest mb-3 font-bold flex items-center gap-2 relative z-10">
                    <Lightbulb size={14}/> Pro Tip
                  </p>
                  <p className="text-white text-sm leading-relaxed relative z-10">{tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScoreBar = ({ label, value, color }) => (
  <div className="bg-[#0B1224] p-4 rounded-xl border border-white/5">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[11px] text-[#8899BB] font-mono uppercase tracking-wider font-bold">{label}</span>
      <span className="text-sm font-black" style={{ color }}>{value}<span className="text-[#4A5A80] text-xs font-medium">/10</span></span>
    </div>
    <div className="h-1.5 bg-[#060B18] rounded-full overflow-hidden border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / 10) * 100}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full rounded-full relative"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-white/20 blur-[2px]"></div>
      </motion.div>
    </div>
  </div>
);

export default ReportPage;