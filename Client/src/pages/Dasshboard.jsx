

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import api from '../api/axios';
// import { 
//   Play, Trophy, TrendingUp, Target, Clock, 
//   Brain, Zap, ChevronRight, Calendar, Flame, Loader2
// } from 'lucide-react';

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [selectedRole, setSelectedRole] = useState('frontend');
//   const [selectedExperience, setSelectedExperience] = useState('junior');
  
//   // ✅ Fetch user's interview sessions
//   const { data: sessionsData, isLoading: loadingSessions } = useQuery({
//     queryKey: ['mySessions'],
//     queryFn: async () => {
//       const res = await api.get('/interviews/my/all?limit=3');
//       return res.data;
//     },
//     retry: 1
//   });

//   // ✅ Fetch weak areas
//   const { data: weakAreasData, isLoading: loadingWeakAreas } = useQuery({
//     queryKey: ['weakAreas'],
//     queryFn: async () => {
//       const res = await api.get('/reports/weakareas');
//       return res.data?.data || []; // Ensure we return an array
//     },
//     retry: 1
//   });

//   // ✅ Start interview mutation
//   // const startInterviewMutation = useMutation({
//   //   mutationFn: async (data) => {
//   //     const res = await api.post('/interviews/start', data);
//   //     return res.data;
//   //   },
//   //   onSuccess: (data) => {
//   //     toast.success('Interview started! Good luck! 🚀');
//   //     navigate(`/interview/${data?.data?.sessionId}`);
//   //   },
//   //   onError: (error) => {
//   //     toast.error(error.response?.data?.message || 'Failed to start interview');
//   //   }
//   // });
//   const startInterviewMutation = useMutation({
//   mutationFn: async (data) => {
//     console.log('🚀 Starting interview with:', data);
//     const res = await api.post('/interviews/start', data);
//     console.log('✅ API Response:', res.data);
//     return res.data;
//   },
//   onSuccess: (data) => {
//     console.log('✅ onSuccess triggered:', data);
//     console.log('📍 Session ID:', data?.data?.sessionId);
    
//     toast.success('Interview started! Good luck! 🚀');
//     const sessionId = data?.data?.sessionId;
    
//     if (!sessionId) {
//       console.error('❌ No sessionId in response!');
//       return;
//     }
    
//     console.log('🧭 Navigating to:', `/interview/${sessionId}`);
//     navigate(`/interview/${sessionId}`);
//   },
//   onError: (error) => {
//     console.error('❌ Error:', error);
//     toast.error(error.response?.data?.message || 'Failed to start interview');
//   }
// });

//   const startInterview = () => {
//     startInterviewMutation.mutate({
//       role: selectedRole,
//       experience: selectedExperience
//     });
//   };

//   // --- SAFE DATA PARSING ---
//   // Using optional chaining to prevent "Cannot read property of undefined" crashes
//   const recentInterviews = sessionsData?.data || [];
//   const totalInterviewsCount = sessionsData?.pagination?.total || 0;
  
//   const stats = {
//     totalInterviews: totalInterviewsCount,
//     averageScore: calculateAverageScore(recentInterviews),
//     streak: 5, 
//     weakTopics: Array.isArray(weakAreasData) ? weakAreasData.length : 0,
//     improvementRate: '+18%',
//   };

//   const weakAreas = (Array.isArray(weakAreasData) ? weakAreasData : [])
//     .slice(0, 3)
//     .map(area => ({
//       topic: area?.area || 'Unknown',
//       accuracy: Math.min(Math.round(((area?.count || 0) / 10) * 100), 100),
//       trend: 'improving'
//     }));

//   // --- RENDER LOGIC ---

//   // 1. Show loader if initial data is fetching
//   if (loadingSessions || loadingWeakAreas) {
//     return (
//       <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
//           <p className="text-[#8899BB] font-mono animate-pulse">LOADING INTERVIQA...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Welcome Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//           <div>
//             <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight">
//               Good morning, <span className="text-[#00E5FF]">Developer 👋</span>
//             </h1>
//             <p className="text-[#8899BB] mt-2 font-mono text-xs uppercase tracking-widest">
//               // Level up your MERN skills for IntervIQa
//             </p>
//           </div>
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#FFB840] to-[#FF4466] rounded-xl shadow-[0_0_20px_rgba(255,184,64,0.2)] self-start"
//           >
//             <Flame className="w-5 h-5 text-white animate-pulse" />
//             <span className="font-syne font-bold text-white uppercase text-sm tracking-tighter">
//               {stats.streak} Day Streak
//             </span>
//           </motion.div>
//         </div>

//         {/* Hero Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <StatCard icon={<Target />} label="Total Interviews" value={stats.totalInterviews} color="cyan" trend="+2 this week" />
//           <StatCard icon={<TrendingUp />} label="Avg Score" value={`${stats.averageScore}%`} color="green" trend={stats.improvementRate} />
//           <StatCard icon={<Brain />} label="Weak Topics" value={stats.weakTopics} color="yellow" trend="Focus areas" />
//           <StatCard icon={<Trophy />} label="Best Score" value={getBestScore(recentInterviews)} color="violet" trend="Keep it up!" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* START INTERVIEW CARD */}
//           <div className="lg:col-span-2 bg-[#0E1830] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-[100px]" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-4 mb-8">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
//                   <Play className="w-6 h-6 text-black fill-current" />
//                 </div>
//                 <div>
//                   <h2 className="font-syne text-2xl font-bold">Start New Session</h2>
//                   <p className="text-[#8899BB] text-xs font-mono uppercase tracking-widest mt-1">Configure your experience</p>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8 mb-10">
//                 <div className="space-y-4">
//                   <label className="text-[11px] font-mono text-[#4A5A80] uppercase tracking-widest block font-bold">// Target Role</label>
//                   {['frontend', 'backend', 'mern'].map((role) => (
//                     <button
//                       key={role}
//                       onClick={() => setSelectedRole(role)}
//                       className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${
//                         selectedRole === role ? 'border-[#00E5FF] bg-[#00E5FF]/5 text-[#00E5FF]' : 'border-white/5 text-[#8899BB] hover:border-white/20'
//                       }`}
//                     >
//                       <span className="font-syne font-bold capitalize text-sm">{role} Developer</span>
//                       <ChevronRight className={`w-4 h-4 transition-transform ${selectedRole === role ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
//                     </button>
//                   ))}
//                 </div>

//                 <div className="space-y-4">
//                   <label className="text-[11px] font-mono text-[#4A5A80] uppercase tracking-widest block font-bold">// Experience Level</label>
//                   {[
//                     { val: 'fresher', label: 'Fresher (0-1 yr)' },
//                     { val: 'junior', label: 'Junior (1-3 yrs)' },
//                     { val: 'mid', label: 'Mid (3-5 yrs)' },
//                   ].map((exp) => (
//                     <button
//                       key={exp.val}
//                       onClick={() => setSelectedExperience(exp.val)}
//                       className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group ${
//                         selectedExperience === exp.val ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#A78BFA]' : 'border-white/5 text-[#8899BB] hover:border-white/20'
//                       }`}
//                     >
//                       <span className="font-syne font-bold text-sm">{exp.label}</span>
//                       <ChevronRight className={`w-4 h-4 transition-transform ${selectedExperience === exp.val ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.99 }}
//                 onClick={startInterview}
//                 disabled={startInterviewMutation.isPending}
//                 className="w-full py-4 bg-[#00E5FF] text-black font-syne font-extrabold text-lg rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
//               >
//                 {startInterviewMutation.isPending ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" />}
//                 {startInterviewMutation.isPending ? 'Starting...' : 'Start Interview Now'}
//               </motion.button>
//             </div>
//           </div>

//           {/* WEAK AREAS */}
//           <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-8 shadow-2xl">
//             <div className="flex items-center gap-4 mb-8">
//               <div className="w-10 h-10 rounded-xl bg-[#FF4466]/10 flex items-center justify-center text-[#FF4466]"><Target size={20} /></div>
//               <h3 className="font-syne text-xl font-bold">Weak Areas</h3>
//             </div>
//             {weakAreas.length === 0 ? (
//               <p className="text-[#4A5A80] text-center py-10">No data yet.</p>
//             ) : (
//               <div className="space-y-8">
//                 {weakAreas.map((area, idx) => (
//                   <div key={area.topic}>
//                     <div className="flex justify-between text-xs mb-3 font-mono">
//                       <span className="text-[#8899BB] uppercase">{area.topic}</span>
//                       <span className="text-[#FFB840] font-bold">{area.accuracy}%</span>
//                     </div>
//                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
//                       <motion.div initial={{ width: 0 }} animate={{ width: `${area.accuracy}%` }} className={`h-full ${area.accuracy < 40 ? 'bg-[#FF4466]' : 'bg-[#FFB840]'}`} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RECENT HISTORY */}
//         <div className="mt-8 bg-[#0E1830] border border-white/5 rounded-2xl p-8 shadow-2xl">
//           <div className="flex items-center justify-between mb-8">
//             <h3 className="font-syne text-xl font-bold text-white">Recent Interviews</h3>
//             <button onClick={() => navigate('/progress')} className="text-[#00E5FF] text-xs font-mono uppercase font-bold hover:underline">View History →</button>
//           </div>
//           {recentInterviews.length === 0 ? (
//             <p className="text-center py-10 text-[#4A5A80]">No interviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {recentInterviews.map((interview) => (
//                 <InterviewCard key={interview._id} interview={interview} onClick={() => navigate(`/report/${interview._id}`)} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- HELPERS ---
// const StatCard = ({ icon, label, value, color, trend }) => {
//   const themes = {
//     cyan: "text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/10",
//     violet: "text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/10",
//     yellow: "text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/10",
//     green: "text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/10",
//   };
//   return (
//     <div className={`p-6 rounded-2xl border ${themes[color]} group hover:-translate-y-1 transition-all`}>
//       <div className="p-3 bg-white/5 rounded-xl w-fit mb-4">{icon}</div>
//       <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-1">{label}</p>
//       <h4 className="text-3xl font-syne font-extrabold">{value}</h4>
//     </div>
//   );
// };

// const InterviewCard = ({ interview, onClick }) => {
//   const score = interview?.totalScore || 0;
//   return (
//     <div onClick={onClick} className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-[#00E5FF]/20 transition-all cursor-pointer">
//       <div className="text-2xl font-syne font-extrabold mb-4">{score}%</div>
//       <p className="text-sm font-bold capitalize">{interview?.role} Developer</p>
//       <div className="flex items-center gap-2 text-[10px] text-[#8899BB] font-mono mt-2 uppercase">
//         <Clock size={12} /> {interview?.status || 'Completed'}
//       </div>
//     </div>
//   );
// };

// const calculateAverageScore = (interviews) => {
//   if (!Array.isArray(interviews) || interviews.length === 0) return 0;
//   const total = interviews.reduce((sum, i) => sum + (i?.totalScore || 0), 0);
//   return Math.round(total / interviews.length);
// };

// const getBestScore = (interviews) => {
//   if (!Array.isArray(interviews) || interviews.length === 0) return '0%';
//   const scores = interviews.map(i => i?.totalScore || 0);
//   const best = Math.max(...scores);
//   return `${best}%`;
// };

// export default DashboardPage;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Trophy, TrendingUp, Target, Clock, 
  Brain, Zap, ChevronRight, Calendar, Flame, Loader2, CheckCircle2, ArrowUpRight
} from 'lucide-react';

// Animation variants for staggered loading
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user for personalized greeting
  const [selectedRole, setSelectedRole] = useState('frontend');
  const [selectedExperience, setSelectedExperience] = useState('junior');
  
  // Fetch user's interview sessions
  const { data: sessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ['mySessions'],
    queryFn: async () => {
      const res = await api.get('/interviews/my/all?limit=3');
      return res.data;
    },
    retry: 1
  });

  // Fetch weak areas
  const { data: weakAreasData, isLoading: loadingWeakAreas } = useQuery({
    queryKey: ['weakAreas'],
    queryFn: async () => {
      const res = await api.get('/reports/weakareas');
      return res.data?.data || []; 
    },
    retry: 1
  });

  // Start interview mutation
  const startInterviewMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/interviews/start', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Interview started! Good luck! 🚀');
      const sessionId = data?.data?.sessionId;
      if (sessionId) navigate(`/interview/${sessionId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    }
  });

  const startInterview = () => {
    startInterviewMutation.mutate({
      role: selectedRole,
      experience: selectedExperience
    });
  };

  // --- SAFE DATA PARSING ---
  const recentInterviews = sessionsData?.data || [];
  const totalInterviewsCount = sessionsData?.pagination?.total || 0;
  
  const stats = {
    totalInterviews: totalInterviewsCount,
    averageScore: calculateAverageScore(recentInterviews),
    streak: user?.currentStreak || 0, 
    weakTopics: Array.isArray(weakAreasData) ? weakAreasData.length : 0,
    improvementRate: '+18%',
  };

  const weakAreas = (Array.isArray(weakAreasData) ? weakAreasData : [])
    .slice(0, 3)
    .map(area => ({
      topic: area?.area || 'Unknown',
      accuracy: Math.min(Math.round(((area?.count || 0) / 10) * 100), 100),
      trend: 'improving'
    }));

  // --- RENDER LOGIC ---

  if (loadingSessions || loadingWeakAreas) {
    return (
      <div className="w-full h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00E5FF] blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF] relative z-10" />
          </div>
          <p className="text-[#8899BB] font-mono text-sm tracking-[0.2em] uppercase animate-pulse">Initializing Workspace...</p>
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
        
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight">
              Good morning, <span className="text-[#00E5FF]">{user?.name?.split(' ')[0] || 'Developer'}</span> <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} className="inline-block origin-bottom-right">👋</motion.span>
            </h1>
            <p className="text-[#8899BB] mt-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold">
              // Level up your MERN skills for IntervIQa
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#FFB840]/10 to-[#FF4466]/10 border border-[#FFB840]/20 rounded-xl shadow-[0_0_20px_rgba(255,184,64,0.1)] backdrop-blur-md self-start"
          >
            <Flame className="w-5 h-5 text-[#FFB840] animate-pulse" />
            <span className="font-syne font-bold text-white uppercase text-sm tracking-tighter">
              {stats.streak} Day Streak
            </span>
          </motion.div>
        </motion.div>

        {/* Hero Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard icon={<Target />} label="Total Interviews" value={stats.totalInterviews} color="cyan" trend="+2 this week" />
          <StatCard icon={<TrendingUp />} label="Avg Score" value={`${stats.averageScore}%`} color="green" trend={stats.improvementRate} />
          <StatCard icon={<Brain />} label="Weak Topics" value={stats.weakTopics} color="yellow" trend="Focus areas" />
          <StatCard icon={<Trophy />} label="Best Score" value={getBestScore(recentInterviews)} color="violet" trend="Keep it up!" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* START INTERVIEW CARD */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0B1224] border border-white/5 rounded-[24px] p-8 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/[0.03] rounded-full blur-[120px] group-hover:bg-[#00E5FF]/[0.05] transition-colors duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                  <Play className="w-6 h-6 text-black fill-current ml-1" />
                </div>
                <div>
                  <h2 className="font-syne text-3xl font-bold">Start New Session</h2>
                  <p className="text-[#8899BB] text-[11px] font-mono uppercase tracking-[0.2em] mt-1 font-bold">Configure your experience</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Role Selector */}
                <div className="space-y-3">
                  <label className="text-[11px] font-mono text-[#4A5A80] uppercase tracking-widest block font-bold mb-4">// Target Role</label>
                  {['frontend', 'backend', 'mern'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between group/btn ${
                        selectedRole === role 
                          ? 'border-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.1)]' 
                          : 'border-white/5 bg-white/[0.02] text-[#8899BB] hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <span className={`font-syne font-bold capitalize text-sm transition-colors ${selectedRole === role ? 'text-[#00E5FF]' : 'text-white'}`}>
                        {role} Developer
                      </span>
                      {selectedRole === role ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Experience Selector */}
                <div className="space-y-3">
                  <label className="text-[11px] font-mono text-[#4A5A80] uppercase tracking-widest block font-bold mb-4">// Experience Level</label>
                  {[
                    { val: 'fresher', label: 'Fresher (0-1 yr)' },
                    { val: 'junior', label: 'Junior (1-3 yrs)' },
                    { val: 'mid', label: 'Mid (3-5 yrs)' },
                  ].map((exp) => (
                    <button
                      key={exp.val}
                      onClick={() => setSelectedExperience(exp.val)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between group/btn ${
                        selectedExperience === exp.val 
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                          : 'border-white/5 bg-white/[0.02] text-[#8899BB] hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <span className={`font-syne font-bold text-sm transition-colors ${selectedExperience === exp.val ? 'text-[#A78BFA]' : 'text-white'}`}>
                        {exp.label}
                      </span>
                      {selectedExperience === exp.val ? (
                        <CheckCircle2 className="w-5 h-5 text-[#A78BFA]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={startInterview}
                disabled={startInterviewMutation.isPending}
                className="w-full py-5 bg-[#00E5FF] text-black font-syne font-extrabold text-lg rounded-xl shadow-[0_10px_30px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wide transition-all"
              >
                {startInterviewMutation.isPending ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" />}
                {startInterviewMutation.isPending ? 'Initializing Core...' : 'Deploy Interview Engine'}
              </motion.button>
            </div>
          </motion.div>

          <div className="space-y-8">
            {/* WEAK AREAS */}
            <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[24px] p-8 shadow-2xl h-fit">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#FF4466]/10 border border-[#FF4466]/20 flex items-center justify-center text-[#FF4466]">
                  <Target size={20} />
                </div>
                <h3 className="font-syne text-xl font-bold">Focus Areas</h3>
              </div>
              {weakAreas.length === 0 ? (
                <div className="py-10 text-center">
                  <Brain className="w-10 h-10 text-[#4A5A80] mx-auto mb-3 opacity-50" />
                  <p className="text-[#4A5A80] font-medium text-sm">Complete more interviews to generate insights.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {weakAreas.map((area, idx) => (
                    <div key={area.topic} className="group">
                      <div className="flex justify-between text-xs mb-3 font-mono">
                        <span className="text-[#8899BB] uppercase font-bold tracking-wider">{area.topic}</span>
                        <span className={`font-bold ${area.accuracy < 40 ? 'text-[#FF4466]' : 'text-[#FFB840]'}`}>{area.accuracy}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#060B18] rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${area.accuracy}%` }} 
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                          className={`h-full relative ${area.accuracy < 40 ? 'bg-gradient-to-r from-[#FF4466]/50 to-[#FF4466]' : 'bg-gradient-to-r from-[#FFB840]/50 to-[#FFB840]'}`} 
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ filter: 'blur(4px)' }}></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <motion.div variants={itemVariants} className="mt-8 bg-[#0B1224] border border-white/5 rounded-[24px] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 className="font-syne text-xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-[#8B5CF6]" size={20}/> Recent Activity
            </h3>
            <button onClick={() => navigate('/progress')} className="flex items-center gap-1 text-[#00E5FF] text-[11px] font-mono uppercase font-bold hover:text-white transition-colors group">
              View History <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
            </button>
          </div>
          {recentInterviews.length === 0 ? (
            <div className="py-12 text-center bg-[#060B18]/50 rounded-xl border border-white/5 border-dashed">
              <p className="text-[#4A5A80] font-medium">No interviews recorded yet. Start your first session above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentInterviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} onClick={() => navigate(`/report/${interview._id}`)} />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- HELPERS ---

const StatCard = ({ icon, label, value, color, trend }) => {
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
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-syne font-extrabold text-white group-hover:scale-105 origin-left transition-transform duration-300">{value}</h4>
        {trend && (
          <span className="text-[10px] font-bold text-[#10F4A0] bg-[#10F4A0]/10 px-2 py-1 rounded-md mb-1">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

const InterviewCard = ({ interview, onClick }) => {
  const score = interview?.totalScore || 0;
  
  // Determine color based on score
  const scoreColor = score >= 80 ? 'text-[#10F4A0]' : score >= 50 ? 'text-[#FFB840]' : 'text-[#FF4466]';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick} 
      className="p-6 bg-[#060B18] border border-white/5 rounded-2xl hover:border-[#00E5FF]/30 transition-all cursor-pointer group shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8B5CF6] to-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`text-3xl font-syne font-extrabold ${scoreColor}`}>
          {score}%
        </div>
        <div className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-mono text-[#8899BB] uppercase tracking-wider font-bold">
          {interview?.experience || 'Junior'}
        </div>
      </div>
      
      <p className="text-lg font-bold text-white capitalize mb-1">{interview?.role} Developer</p>
      <div className="flex items-center gap-2 text-[11px] text-[#4A5A80] font-mono mt-4 uppercase font-bold">
        <Clock size={12} className="text-[#00E5FF]" /> 
        {new Date(interview?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </motion.div>
  );
};

const calculateAverageScore = (interviews) => {
  if (!Array.isArray(interviews) || interviews.length === 0) return 0;
  const total = interviews.reduce((sum, i) => sum + (i?.totalScore || 0), 0);
  return Math.round(total / interviews.length);
};

const getBestScore = (interviews) => {
  if (!Array.isArray(interviews) || interviews.length === 0) return '0%';
  const scores = interviews.map(i => i?.totalScore || 0);
  const best = Math.max(...scores);
  return `${best}%`;
};

export default DashboardPage;