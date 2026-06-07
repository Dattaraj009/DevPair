// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// // import { useAuth } from '../context/AuthContext';
// import { useAuth } from '../../context/AuthContext';
// // import api from '../api/axios';
// import api from '../../api/axios';
// import {
//   User, Mail, Calendar, Shield, Trophy, TrendingUp,
//   Edit2, Save, X, Loader2, Lock, Eye, EyeOff
// } from 'lucide-react';

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
  
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [newName, setNewName] = useState(user?.name || '');
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });

//   // Fetch user stats
//   const { data: statsData } = useQuery({
//     queryKey: ['myStats'],
//     queryFn: async () => {
//       const res = await api.get('/interviews/my/stats');
//       return res.data.data;
//     }
//   });

//   // Update name mutation
//   const updateNameMutation = useMutation({
//     mutationFn: async (name) => {
//       const res = await api.patch('/auth/profile', { name });
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success('Name updated successfully');
//       setIsEditingName(false);
//       queryClient.invalidateQueries(['user']);
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update name');
//     }
//   });

//   // Change password mutation
//   const changePasswordMutation = useMutation({
//     mutationFn: async (data) => {
//       const res = await api.patch('/auth/change-password', data);
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success('Password changed successfully');
//       setIsChangingPassword(false);
//       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to change password');
//     }
//   });

//   const handleUpdateName = () => {
//     if (!newName.trim()) {
//       toast.error('Name cannot be empty');
//       return;
//     }
//     updateNameMutation.mutate(newName);
//   };

//   const handleChangePassword = () => {
//     if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
//       toast.error('All fields are required');
//       return;
//     }
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('New passwords do not match');
//       return;
//     }
//     if (passwordData.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }
//     changePasswordMutation.mutate({
//       currentPassword: passwordData.currentPassword,
//       newPassword: passwordData.newPassword
//     });
//   };

//   const stats = statsData || {
//     totalInterviews: 0,
//     completedInterviews: 0,
//     averageScore: 0,
//     bestScore: 0
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const isGoogleAuth = user?.authProvider === 'google';

//   return (
//     <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
//             Your <span className="text-[#00E5FF]">Profile</span>
//           </h1>
//           <p className="text-[#8899BB] font-mono text-xs uppercase tracking-widest">
//             // Manage your account and view your stats
//           </p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-8 mb-8 shadow-2xl">
//           <div className="flex items-start gap-6 mb-8">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center text-black font-bold text-3xl flex-shrink-0">
//               {user?.name?.[0]?.toUpperCase() || 'U'}
//             </div>
            
//             <div className="flex-1">
//               {/* Name */}
//               <div className="mb-4">
//                 {isEditingName ? (
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="text"
//                       value={newName}
//                       onChange={(e) => setNewName(e.target.value)}
//                       className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                       placeholder="Your name"
//                     />
//                     <button
//                       onClick={handleUpdateName}
//                       disabled={updateNameMutation.isPending}
//                       className="p-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 transition-all disabled:opacity-50"
//                     >
//                       {updateNameMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
//                     </button>
//                     <button
//                       onClick={() => {
//                         setIsEditingName(false);
//                         setNewName(user?.name || '');
//                       }}
//                       className="p-2 bg-white/5 text-[#8899BB] rounded-lg hover:bg-white/10 transition-all"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3">
//                     <h2 className="font-syne text-2xl font-bold">{user?.name}</h2>
//                     <button
//                       onClick={() => setIsEditingName(true)}
//                       className="p-1.5 hover:bg-white/5 rounded-lg transition-all"
//                     >
//                       <Edit2 size={16} className="text-[#8899BB]" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Account Info */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3 text-sm">
//                   <Mail size={16} className="text-[#4A5A80]" />
//                   <span className="text-[#8899BB]">{user?.email}</span>
//                 </div>
                
//                 <div className="flex items-center gap-3 text-sm">
//                   <Calendar size={16} className="text-[#4A5A80]" />
//                   <span className="text-[#8899BB]">
//                     Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3 text-sm">
//                   <Shield size={16} className="text-[#4A5A80]" />
//                   <span className="text-[#8899BB] capitalize">
//                     {isGoogleAuth ? 'Google Account' : 'Email Account'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Summary */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
//             <StatBox icon={<Trophy />} label="Total" value={stats.totalInterviews} color="cyan" />
//             <StatBox icon={<TrendingUp />} label="Avg Score" value={`${stats.averageScore.toFixed(1)}%`} color="green" />
//             <StatBox icon={<Trophy />} label="Best" value={`${stats.bestScore}%`} color="violet" />
//             <StatBox icon={<Trophy />} label="Completed" value={stats.completedInterviews} color="yellow" />
//           </div>
//         </div>

//         {/* Security Section */}
//         {!isGoogleAuth && (
//           <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-8 shadow-2xl">
//             <div className="flex items-center gap-3 mb-6">
//               <Lock className="w-6 h-6 text-[#00E5FF]" />
//               <h3 className="font-syne text-xl font-bold">Security</h3>
//             </div>

//             {!isChangingPassword ? (
//               <button
//                 onClick={() => setIsChangingPassword(true)}
//                 className="flex items-center gap-2 px-6 py-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl hover:bg-[#00E5FF]/20 transition-all font-bold"
//               >
//                 <Lock size={18} />
//                 Change Password
//               </button>
//             ) : (
//               <div className="space-y-4">
//                 {/* Current Password */}
//                 <div>
//                   <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Current Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.current ? 'text' : 'password'}
//                       value={passwordData.currentPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                       className="w-full px-4 py-3 pr-12 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                       placeholder="Enter current password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899BB] hover:text-white"
//                     >
//                       {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">New Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.new ? 'text' : 'password'}
//                       value={passwordData.newPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                       className="w-full px-4 py-3 pr-12 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                       placeholder="Enter new password (min 6 chars)"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899BB] hover:text-white"
//                     >
//                       {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Confirm New Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.confirm ? 'text' : 'password'}
//                       value={passwordData.confirmPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                       className="w-full px-4 py-3 pr-12 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
//                       placeholder="Confirm new password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899BB] hover:text-white"
//                     >
//                       {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     onClick={handleChangePassword}
//                     disabled={changePasswordMutation.isPending}
//                     className="flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-black font-bold rounded-xl hover:bg-[#00f5ff] transition-all disabled:opacity-50"
//                   >
//                     {changePasswordMutation.isPending ? (
//                       <>
//                         <Loader2 size={18} className="animate-spin" />
//                         Changing...
//                       </>
//                     ) : (
//                       <>
//                         <Save size={18} />
//                         Change Password
//                       </>
//                     )}
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       setIsChangingPassword(false);
//                       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//                     }}
//                     className="px-6 py-3 border border-white/10 text-[#8899BB] rounded-xl hover:bg-white/5 transition-all font-bold"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {isGoogleAuth && (
//           <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6">
//             <p className="text-[#8899BB] text-sm text-center">
//               You're signed in with Google. Password management is handled by your Google account.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── STAT BOX ───────────────────────────────────────────────────────────────

// const StatBox = ({ icon, label, value, color }) => {
//   const colors = {
//     cyan: 'text-[#00E5FF] bg-[#00E5FF]/5',
//     green: 'text-[#10F4A0] bg-[#10F4A0]/5',
//     violet: 'text-[#8B5CF6] bg-[#8B5CF6]/5',
//     yellow: 'text-[#FFB840] bg-[#FFB840]/5'
//   };

//   return (
//     <div className={`p-4 rounded-xl ${colors[color]}`}>
//       <div className="flex items-center justify-center mb-2">
//         {icon}
//       </div>
//       <p className="text-[10px] text-[#4A5A80] font-mono uppercase text-center mb-1">
//         {label}
//       </p>
//       <p className="text-xl font-syne font-bold text-center">{value}</p>
//     </div>
//   );
// };

// export default ProfilePage;




import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  User, Mail, Calendar, Shield, Trophy, TrendingUp,
  Edit2, Save, X, Loader2, Lock, Eye, EyeOff, Target
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

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ['myStats'],
    queryFn: async () => {
      const res = await api.get('/interviews/my/stats');
      return res.data.data;
    }
  });

  // Update name mutation
  const updateNameMutation = useMutation({
    mutationFn: async (name) => {
      const res = await api.patch('/auth/profile', { name });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Name updated successfully');
      setIsEditingName(false);
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update name');
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.patch('/auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const handleUpdateName = () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateNameMutation.mutate(newName);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const stats = statsData || {
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isGoogleAuth = user?.authProvider === 'google';

  return (
    <div className="w-full text-[#EDF2FF] p-6 md:p-10">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-4xl mx-auto"
      >
        
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12 text-center md:text-left">
          <h1 className="font-syne text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Your <span className="text-[#00E5FF]">Profile</span>
          </h1>
          <p className="text-[#8899BB] font-mono text-[11px] uppercase tracking-[0.2em] font-bold">
            // Manage your account and view overall stats
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[32px] p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/[0.02] rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mb-10 relative z-10">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] p-[3px] shadow-xl relative z-10">
                <div className="w-full h-full rounded-full bg-[#060B18] flex items-center justify-center text-[#00E5FF] font-syne font-black text-5xl tracking-tighter">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              {/* Name Section */}
              <div className="mb-6 h-12 flex items-center justify-center md:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-5 py-2.5 bg-[#060B18] border border-[#00E5FF]/30 rounded-xl text-white font-bold focus:outline-none focus:border-[#00E5FF] focus:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all"
                      placeholder="Your name"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={updateNameMutation.isPending}
                      className="p-3 bg-[#00E5FF] text-black rounded-xl hover:bg-[#00f5ff] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {updateNameMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
                    </button>
                    <button
                      onClick={() => { setIsEditingName(false); setNewName(user?.name || ''); }}
                      className="p-3 bg-white/5 border border-white/10 text-[#8899BB] rounded-xl hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <h2 className="font-syne text-3xl md:text-4xl font-extrabold">{user?.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-lg text-[#8899BB] hover:text-[#00E5FF] transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Account Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#060B18]/50 p-5 rounded-2xl border border-white/5 inline-flex w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-[#4A5A80] text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-2"><Mail size={12}/> Email</span>
                  <span className="text-[#EDF2FF] font-medium text-sm">{user?.email}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[#4A5A80] text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-2"><Calendar size={12}/> Joined</span>
                  <span className="text-[#EDF2FF] font-medium text-sm">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[#4A5A80] text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-2"><Shield size={12}/> Auth</span>
                  <span className="text-[#EDF2FF] font-medium text-sm capitalize">
                    {isGoogleAuth ? 'Google Account' : 'Email & Password'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary - Now integrated into the card seamlessly */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5 relative z-10">
            <StatBox icon={<Target className="text-[#00E5FF]"/>} label="Total Sessions" value={stats.totalInterviews} color="cyan" />
            <StatBox icon={<TrendingUp className="text-[#10F4A0]"/>} label="Avg Score" value={`${(stats.averageScore || 0).toFixed(1)}%`} color="green" />
            <StatBox icon={<Trophy className="text-[#8B5CF6]"/>} label="Best Score" value={`${stats.bestScore || 0}%`} color="violet" />
            <StatBox icon={<Shield className="text-[#FFB840]"/>} label="Completed" value={stats.completedInterviews} color="yellow" />
          </div>
        </motion.div>

        {/* Security Section */}
        {!isGoogleAuth && (
          <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#00E5FF]" />
                </div>
                <div>
                  <h3 className="font-syne text-2xl font-bold">Security & Password</h3>
                  <p className="text-[#4A5A80] text-sm mt-1">Keep your account secure</p>
                </div>
              </div>

              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="hidden md:flex items-center gap-2 px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 hover:border-white/20 transition-all font-bold text-sm"
                >
                  <Edit2 size={16} /> Update Password
                </button>
              )}
            </div>

            <AnimatePresence>
              {isChangingPassword ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-5 overflow-hidden pt-4 border-t border-white/5"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <div>
                        <label className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-2 block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-5 py-3.5 bg-[#060B18] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5A80] hover:text-[#00E5FF] transition-colors"
                          >
                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-2 block">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-5 py-3.5 bg-[#060B18] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                            placeholder="Min. 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5A80] hover:text-[#00E5FF] transition-colors"
                          >
                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#4A5A80] font-mono uppercase tracking-widest font-bold mb-2 block">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-5 py-3.5 bg-[#060B18] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A5A80] hover:text-[#00E5FF] transition-colors"
                          >
                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual spacer/instructions for desktop */}
                    <div className="hidden md:flex flex-col justify-center items-center p-8 bg-[#060B18]/50 rounded-xl border border-white/5 border-dashed">
                       <Shield className="w-12 h-12 text-[#4A5A80] mb-4 opacity-50" />
                       <p className="text-[#8899BB] text-center text-sm font-medium">Use a strong password combining letters, numbers, and symbols to secure your IntervIQa account.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-white/5">
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00E5FF] text-black font-bold rounded-xl hover:bg-[#00f5ff] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                    >
                      {changePasswordMutation.isPending ? (
                        <><Loader2 size={18} className="animate-spin" /> Updating...</>
                      ) : (
                        <><Save size={18} /> Save New Password</>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex-1 sm:flex-none px-8 py-3.5 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="md:hidden">
                   <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all font-bold text-sm"
                  >
                    <Edit2 size={16} /> Update Password
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {isGoogleAuth && (
          <motion.div variants={itemVariants} className="bg-[#0B1224] border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              {/* Google G icon approximation */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <h3 className="font-syne text-xl font-bold mb-2">Google Managed Account</h3>
            <p className="text-[#8899BB] text-sm max-w-md">
              You're signed in securely via Google. Password and security management is handled directly through your Google account settings.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// ─── STAT BOX ───────────────────────────────────────────────────────────────

const StatBox = ({ icon, label, value, color }) => {
  const colors = {
    cyan: 'bg-gradient-to-br from-[#00E5FF]/10 to-transparent border-[#00E5FF]/20',
    green: 'bg-gradient-to-br from-[#10F4A0]/10 to-transparent border-[#10F4A0]/20',
    violet: 'bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border-[#8B5CF6]/20',
    yellow: 'bg-gradient-to-br from-[#FFB840]/10 to-transparent border-[#FFB840]/20'
  };

  return (
    <div className={`p-5 rounded-2xl border bg-[#060B18] ${colors[color]} relative overflow-hidden group`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#0B1224] rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="text-[10px] text-[#8899BB] font-mono uppercase tracking-widest font-bold">
          {label}
        </p>
      </div>
      <p className="text-3xl font-syne font-black text-white mt-3 group-hover:translate-x-1 transition-transform">{value}</p>
    </div>
  );
};

export default ProfilePage;