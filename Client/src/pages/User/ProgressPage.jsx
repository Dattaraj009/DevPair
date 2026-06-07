// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// // import api from '../api/axios';
// import api from '../../api/axios';
// import {
//   Calendar, TrendingUp, Target, Trophy, Clock,
//   Filter, ChevronDown, ChevronUp, Loader2, Eye,
//   BarChart3, Award
// } from 'lucide-react';

// const ProgressPage = () => {
//   const navigate = useNavigate();
  
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [page, setPage] = useState(1);
//   const limit = 6;

//   // Fetch user's interviews
//   const { data: interviewsData, isLoading } = useQuery({
//     queryKey: ['myInterviews', page, roleFilter, statusFilter],
//     queryFn: async () => {
//       let url = `/interviews/my/all?page=${page}&limit=${limit}`;
//       if (roleFilter !== 'all') url += `&role=${roleFilter}`;
//       if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      
//       const res = await api.get(url);
//       return res.data;
//     }
//   });

//   // Fetch user stats
//   const { data: statsData } = useQuery({
//     queryKey: ['myStats'],
//     queryFn: async () => {
//       const res = await api.get('/interviews/my/stats');
//       return res.data.data;
//     }
//   });

//   const interviews = interviewsData?.data || [];
//   const totalPages = Math.ceil((interviewsData?.pagination?.total || 0) / limit);
//   const stats = statsData || {
//     totalInterviews: 0,
//     completedInterviews: 0,
//     averageScore: 0,
//     bestScore: 0,
//     topWeakAreas: []
//   };

//   return (
//     <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
//             Your <span className="text-[#00E5FF]">Progress</span>
//           </h1>
//           <p className="text-[#8899BB] font-mono text-xs uppercase tracking-widest">
//             // Track your interview performance over time
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <StatCard
//             icon={<Calendar />}
//             label="Total Interviews"
//             value={stats.totalInterviews}
//             color="cyan"
//           />
//           <StatCard
//             icon={<TrendingUp />}
//             label="Avg Score"
//             value={`${stats.averageScore.toFixed(1)}%`}
//             color="green"
//           />
//           <StatCard
//             icon={<Trophy />}
//             label="Best Score"
//             value={`${stats.bestScore}%`}
//             color="violet"
//           />
//           <StatCard
//             icon={<Target />}
//             label="Completed"
//             value={stats.completedInterviews}
//             color="yellow"
//           />
//         </div>

//         {/* Weak Areas */}
//         {stats.topWeakAreas && stats.topWeakAreas.length > 0 && (
//           <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 mb-10">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-10 h-10 rounded-xl bg-[#FF4466]/10 flex items-center justify-center">
//                 <Target className="w-5 h-5 text-[#FF4466]" />
//               </div>
//               <h3 className="font-syne text-xl font-bold">Your Top Weak Areas</h3>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               {stats.topWeakAreas.map((area, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: i * 0.1 }}
//                   className="px-4 py-2 bg-[#FF4466]/10 border border-[#FF4466]/30 text-[#FF4466] rounded-lg text-sm font-semibold"
//                 >
//                   ⚠ {area}
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <h3 className="font-syne text-lg font-bold">Interview History</h3>
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-[#8899BB] hover:border-[#00E5FF]/30 hover:text-white transition-all"
//             >
//               <Filter size={18} />
//               Filters
//               {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//             </button>
//           </div>

//           {showFilters && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5"
//             >
//               <div>
//                 <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Role</label>
//                 <select
//                   value={roleFilter}
//                   onChange={(e) => {
//                     setRoleFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="frontend">Frontend</option>
//                   <option value="backend">Backend</option>
//                   <option value="mern">MERN Stack</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="completed">Completed</option>
//                   <option value="in_progress">In Progress</option>
//                   <option value="abandoned">Abandoned</option>
//                 </select>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Interview List */}
//         {isLoading ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
//           </div>
//         ) : interviews.length === 0 ? (
//           <div className="text-center py-20">
//             <BarChart3 className="w-16 h-16 text-[#4A5A80] mx-auto mb-4" />
//             <p className="text-[#4A5A80] text-lg mb-4">No interviews found</p>
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="text-[#00E5FF] hover:underline"
//             >
//               Start your first interview
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               {interviews.map((interview, index) => (
//                 <InterviewCard
//                   key={interview._id}
//                   interview={interview}
//                   index={index}
//                   onClick={() => navigate(`/report/${interview._id}`)}
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
                
//                 <span className="px-4 py-2 text-sm font-mono text-[#8899BB]">
//                   Page {page} of {totalPages}
//                 </span>

//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── STAT CARD ──────────────────────────────────────────────────────────────

// const StatCard = ({ icon, label, value, color }) => {
//   const themes = {
//     cyan: "text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/10",
//     violet: "text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/10",
//     yellow: "text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/10",
//     green: "text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/10",
//   };

//   return (
//     <div className={`p-6 rounded-2xl border ${themes[color]} group hover:-translate-y-1 transition-all`}>
//       <div className="p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
//         {icon}
//       </div>
//       <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest mb-1">
//         {label}
//       </p>
//       <h4 className="text-3xl font-syne font-extrabold">{value}</h4>
//     </div>
//   );
// };

// // ─── INTERVIEW CARD ─────────────────────────────────────────────────────────

// const InterviewCard = ({ interview, index, onClick }) => {
//   const getScoreColor = (score) => {
//     if (score >= 70) return 'text-[#10F4A0]';
//     if (score >= 50) return 'text-[#FFB840]';
//     return 'text-[#FF4466]';
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       completed: { bg: 'bg-[#10F4A0]/10', text: 'text-[#10F4A0]', label: 'Completed' },
//       in_progress: { bg: 'bg-[#00E5FF]/10', text: 'text-[#00E5FF]', label: 'In Progress' },
//       abandoned: { bg: 'bg-[#8899BB]/10', text: 'text-[#8899BB]', label: 'Abandoned' }
//     };
//     return badges[status] || badges.abandoned;
//   };

//   const formatDate = (date) => {
//     const d = new Date(date);
//     const now = new Date();
//     const diffMs = now - d;
//     const diffMins = Math.floor(diffMs / 60000);
    
//     if (diffMins < 60) return `${diffMins}m ago`;
//     const diffHours = Math.floor(diffMins / 60);
//     if (diffHours < 24) return `${diffHours}h ago`;
//     const diffDays = Math.floor(diffHours / 24);
//     if (diffDays < 7) return `${diffDays}d ago`;
    
//     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const statusBadge = getStatusBadge(interview.status);
//   const score = interview.totalScore || 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1 }}
//       onClick={onClick}
//       className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 hover:border-[#00E5FF]/20 transition-all cursor-pointer group"
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
//             <span className="text-[#A78BFA] font-mono text-xs font-bold uppercase tracking-widest">
//               {interview.role}
//             </span>
//           </div>
//           <span className={`px-3 py-1 rounded-lg ${statusBadge.bg} ${statusBadge.text} text-xs font-bold`}>
//             {statusBadge.label}
//           </span>
//         </div>
//       </div>

//       {/* Score */}
//       {interview.status === 'completed' && (
//         <div className="mb-4">
//           <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-2">Final Score</p>
//           <div className="flex items-baseline gap-2">
//             <span className={`text-5xl font-syne font-extrabold ${getScoreColor(score)}`}>
//               {score}
//             </span>
//             <span className="text-[#4A5A80] text-lg">/100</span>
//           </div>
//         </div>
//       )}

//       {/* Details */}
//       <div className="space-y-2 mb-4">
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-[#4A5A80]">Experience</span>
//           <span className="text-white font-semibold capitalize">{interview.experience}</span>
//         </div>
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-[#4A5A80]">Questions</span>
//           <span className="text-white font-semibold">{interview.questions?.length || 10}</span>
//         </div>
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-[#4A5A80]">Date</span>
//           <span className="text-[#8899BB] font-mono text-xs">
//             {formatDate(interview.completedAt || interview.startedAt)}
//           </span>
//         </div>
//       </div>

//       {/* View Button */}
//       {interview.status === 'completed' && (
//         <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl font-bold hover:bg-[#00E5FF]/20 transition-all group-hover:bg-[#00E5FF]/20">
//           <Eye size={18} />
//           View Report
//         </button>
//       )}

//       {interview.status === 'in_progress' && (
//         <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFB840]/10 text-[#FFB840] rounded-xl font-bold hover:bg-[#FFB840]/20 transition-all">
//           <Clock size={18} />
//           Resume Interview
//         </button>
//       )}
//     </motion.div>
//   );
// };

// export default ProgressPage;



















import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import {
  Calendar, TrendingUp, Target, Trophy, Clock,
  Filter, ChevronDown, ChevronUp, Loader2, Eye,
  BarChart3, AlertCircle, PlayCircle, ArrowRight
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

const ProgressPage = () => {
  const navigate = useNavigate();
  
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  // Fetch user's interviews
  const { data: interviewsData, isLoading } = useQuery({
    queryKey: ['myInterviews', page, roleFilter, statusFilter],
    queryFn: async () => {
      let url = `/interviews/my/all?page=${page}&limit=${limit}`;
      if (roleFilter !== 'all') url += `&role=${roleFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      
      const res = await api.get(url);
      return res.data;
    }
  });

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ['myStats'],
    queryFn: async () => {
      const res = await api.get('/interviews/my/stats');
      return res.data.data;
    }
  });

  const interviews = interviewsData?.data || [];
  const totalPages = Math.ceil((interviewsData?.pagination?.total || 0) / limit);
  const stats = statsData || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    topWeakAreas: []
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00E5FF] blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF] relative z-10" />
          </div>
          <p className="text-[#8899BB] font-mono text-sm tracking-[0.2em] uppercase animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-[#EDF2FF] p-6 md:p-10">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Your <span className="text-[#00E5FF]">Progress</span>
          </h1>
          <p className="text-[#8899BB] font-mono text-[11px] uppercase tracking-[0.2em] font-bold">
            // Track your interview performance over time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard icon={<Calendar />} label="Total Interviews" value={stats.totalInterviews} color="cyan" />
          <StatCard icon={<TrendingUp />} label="Avg Score" value={`${(stats.averageScore || 0).toFixed(1)}%`} color="green" />
          <StatCard icon={<Trophy />} label="Best Score" value={`${stats.bestScore || 0}%`} color="violet" />
          <StatCard icon={<Target />} label="Completed" value={stats.completedInterviews} color="yellow" />
        </motion.div>

        {/* Weak Areas */}
        {stats.topWeakAreas && stats.topWeakAreas.length > 0 && (
          <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-8 mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF4466]/[0.02] rounded-full blur-[100px]" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#FF4466]/10 border border-[#FF4466]/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#FF4466]" />
              </div>
              <h3 className="font-syne text-2xl font-bold">Priority Focus Areas</h3>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              {stats.topWeakAreas.map((area, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-2.5 bg-[#FF4466]/10 border border-[#FF4466]/20 text-[#FF4466] rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2"
                >
                  <Target size={14} /> {area}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-syne text-xl font-bold flex items-center gap-3">
              <Clock className="text-[#8B5CF6]" size={20}/> Session History
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 border rounded-xl font-bold text-sm transition-all duration-300 ${
                showFilters 
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' 
                  : 'bg-white/5 border-white/10 text-[#8899BB] hover:text-white hover:bg-white/10'
              }`}
            >
              <Filter size={16} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/5 overflow-hidden"
              >
                <div>
                  <label className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-3 block">Filter by Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                    className="w-full px-5 py-3.5 bg-[#060B18] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#00E5FF]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="mern">MERN Stack</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-3 block">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="w-full px-5 py-3.5 bg-[#060B18] border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#00E5FF]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Interview List */}
        {interviews.length === 0 ? (
          <motion.div variants={itemVariants} className="text-center py-24 bg-[#0B1224] border border-white/5 rounded-[24px] border-dashed">
            <BarChart3 className="w-16 h-16 text-[#4A5A80] mx-auto mb-6 opacity-50" />
            <p className="text-[#8899BB] text-lg mb-6 font-medium">No interviews match your current filters.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              Start New Interview <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {interviews.map((interview, index) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  index={index}
                  onClick={() => navigate(`/report/${interview._id}`)}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2.5 bg-[#0B1224] border border-white/10 rounded-xl text-sm font-bold text-white hover:border-[#00E5FF]/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-[11px] font-mono tracking-widest uppercase font-bold text-[#8899BB] bg-[#0B1224] rounded-lg border border-white/5">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 bg-[#0B1224] border border-white/10 rounded-xl text-sm font-bold text-white hover:border-[#00E5FF]/50 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color }) => {
  const themes = {
    cyan: "text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/20 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]",
    violet: "text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/20 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
    yellow: "text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/20 group-hover:shadow-[0_0_25px_rgba(255,184,64,0.15)]",
    green: "text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/20 group-hover:shadow-[0_0_25px_rgba(16,244,160,0.15)]",
  };

  return (
    <div className={`p-6 rounded-[20px] bg-[#0B1224] border border-white/5 hover:border-white/10 group transition-all duration-300 relative overflow-hidden`}>
      <div className={`p-3 rounded-xl w-fit mb-6 transition-colors duration-300 ${themes[color]}`}>
        {icon}
      </div>
      <p className="text-[11px] text-[#4A5A80] font-mono uppercase font-bold tracking-widest mb-2">{label}</p>
      <h4 className="text-3xl font-syne font-extrabold text-white group-hover:scale-105 origin-left transition-transform duration-300">{value}</h4>
    </div>
  );
};

// ─── INTERVIEW CARD ─────────────────────────────────────────────────────────

const InterviewCard = ({ interview, index, onClick }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-[#10F4A0]';
    if (score >= 50) return 'text-[#FFB840]';
    return 'text-[#FF4466]';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-[#10F4A0]/10', text: 'text-[#10F4A0]', border: 'border-[#10F4A0]/20', label: 'Completed' },
      in_progress: { bg: 'bg-[#00E5FF]/10', text: 'text-[#00E5FF]', border: 'border-[#00E5FF]/20', label: 'In Progress' },
      abandoned: { bg: 'bg-[#8899BB]/10', text: 'text-[#8899BB]', border: 'border-[#8899BB]/20', label: 'Abandoned' }
    };
    return badges[status] || badges.abandoned;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusBadge = getStatusBadge(interview.status);
  const score = interview.totalScore || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-[#0B1224] border border-white/5 rounded-2xl p-6 hover:border-[#00E5FF]/30 transition-all cursor-pointer group relative overflow-hidden shadow-lg"
    >
      {/* Decorative Side Gradient on Hover */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8B5CF6] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="px-3 py-1 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          <span className="text-[#A78BFA] font-mono text-[10px] font-bold uppercase tracking-widest">
            {interview.role}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-lg border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} text-[10px] font-bold uppercase tracking-wider`}>
          {statusBadge.label}
        </span>
      </div>

      {/* Score Area */}
      <div className="mb-6">
        <p className="text-[10px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-1">
          {interview.status === 'completed' ? 'Final Score' : 'Current Progress'}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-syne font-extrabold ${getScoreColor(score)}`}>
            {score}
          </span>
          {interview.status === 'completed' && <span className="text-[#4A5A80] text-lg font-bold">/100</span>}
          {interview.status !== 'completed' && <span className="text-[#4A5A80] text-lg font-bold">%</span>}
        </div>
      </div>

      {/* Details Row */}
      <div className="space-y-3 mb-6 p-4 bg-[#060B18] rounded-xl border border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#4A5A80] font-mono uppercase tracking-wider font-bold">Experience</span>
          <span className="text-white font-semibold capitalize">{interview.experience}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#4A5A80] font-mono uppercase tracking-wider font-bold">Date</span>
          <span className="text-[#8899BB] font-mono">
            {formatDate(interview.completedAt || interview.startedAt || Date.now())}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {interview.status === 'completed' && (
        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00E5FF]/5 text-[#00E5FF] rounded-xl font-bold text-sm hover:bg-[#00E5FF] hover:text-black transition-all">
          <Eye size={16} /> View Full Report
        </button>
      )}

      {interview.status === 'in_progress' && (
        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FFB840]/10 text-[#FFB840] rounded-xl font-bold text-sm hover:bg-[#FFB840] hover:text-black transition-all">
          <PlayCircle size={16} /> Resume Session
        </button>
      )}
      
      {interview.status === 'abandoned' && (
        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 text-[#8899BB] rounded-xl font-bold text-sm transition-all" disabled>
          Session Closed
        </button>
      )}
    </motion.div>
  );
};

export default ProgressPage;