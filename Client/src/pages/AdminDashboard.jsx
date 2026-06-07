

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { 
  Users, FileQuestion, TrendingUp, Activity, 
  Plus, AlertCircle, Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  //  R API: Fetch admin stats
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
    retry: 1
  });

  //   Fetch recent activity
  const { data: activityData, isLoading: loadingActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const res = await api.get('/admin/recent-activity?limit=4');
      return res.data.data;
    },
    retry: 1
  });

  //  Fetch platform weak areas
  const { data: weakAreasData, isLoading: loadingWeakAreas } = useQuery({
    queryKey: ['platformWeakAreas'],
    queryFn: async () => {
      const res = await api.get('/admin/weak-areas?limit=3');
      return res.data.data;
    },
    retry: 1
  });

  // Use real data or fallback to defaults
  const stats = statsData || {
    totalUsers: 0,
    totalInterviews: 0,
    totalQuestions: 0,
    avgScore: 0,
    activeToday: 0,
  };

  const recentActivity = activityData || [];
  const topWeakAreas = weakAreasData || [];

  // Loading state
  if (loadingStats || loadingActivity || loadingWeakAreas) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
          <p className="text-[#8899BB] font-mono">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-8 pt-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="font-syne text-4xl font-extrabold tracking-tight">
            Admin <span className="text-[#00E5FF]">Command Center</span>
          </h1>
          <p className="text-[#8899BB] mt-2 font-mono text-xs uppercase tracking-widest">
            // Real-time platform metrics · {new Date().toLocaleDateString()}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/questions')}
          className="flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:bg-[#00f5ff] transition-all"
        >
          <Plus size={20} />
          Add New Question
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Users />} 
          label="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          color="cyan" 
        />
        <StatCard 
          icon={<Activity />} 
          label="Interviews" 
          value={stats.totalInterviews.toLocaleString()} 
          color="violet" 
        />
        <StatCard 
          icon={<FileQuestion />} 
          label="Question Bank" 
          value={stats.totalQuestions} 
          color="green" 
        />
        <StatCard 
          icon={<TrendingUp />} 
          label="Avg Score" 
          value={`${stats.avgScore.toFixed(1)}%`} 
          color="yellow" 
        />
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Activity */}
        <div className="lg:col-span-2 bg-[#0E1830] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-syne text-xl font-bold">Live Activity</h3>
                <p className="text-xs text-[#4A5A80] font-mono">
                  {stats.activeToday} developers active today
                </p>
              </div>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-center py-10 text-[#4A5A80]">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#FF4466]/10 flex items-center justify-center text-[#FF4466]">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-syne text-xl font-bold">Top Weak Areas</h3>
          </div>

          {topWeakAreas.length === 0 ? (
            <p className="text-center py-10 text-[#4A5A80]">No data yet</p>
          ) : (
            <div className="space-y-6">
              {topWeakAreas.map((area) => (
                <WeakAreaBar key={area.area} area={area} />
              ))}
            </div>
          )}
          
          <button 
            onClick={() => navigate('/admin/questions')}
            className="w-full mt-10 py-3 border border-[#00E5FF]/20 text-[#00E5FF] rounded-xl text-sm font-bold hover:bg-[#00E5FF]/5 transition-all"
          >
            Manage Question Bank
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, color }) => {
  const themes = {
    cyan: "text-[#00E5FF] bg-[#00E5FF]/5 border-[#00E5FF]/10",
    violet: "text-[#8B5CF6] bg-[#8B5CF6]/5 border-[#8B5CF6]/10",
    green: "text-[#10F4A0] bg-[#10F4A0]/5 border-[#10F4A0]/10",
    yellow: "text-[#FFB840] bg-[#FFB840]/5 border-[#FFB840]/10",
  };

  return (
    <div className={`p-6 rounded-2xl border ${themes[color]} shadow-lg group hover:-translate-y-1 transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-xs text-[#8899BB] font-mono uppercase tracking-widest mb-1">
        {label}
      </p>
      <h4 className="text-3xl font-syne font-extrabold">{value}</h4>
    </div>
  );
};

// ─── ACTIVITY CARD ──────────────────────────────────────────────────────────

const ActivityCard = ({ activity }) => {
  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-[#10F4A0]';
    if (status === 'in_progress') return 'text-[#00E5FF]';
    return 'text-[#FFB840]';
  };

  const userName = activity.userId?.name || 'Anonymous';
  const action = activity.status === 'completed' 
    ? `Completed ${activity.role} Interview`
    : `Started ${activity.role} Interview`;

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-[#00E5FF]/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center font-bold text-black text-sm">
          {userName[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="font-bold text-sm">{userName}</p>
          <p className="text-xs text-[#8899BB]">{action}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {activity.totalScore !== undefined && (
          <span className={`font-mono font-bold text-sm ${
            activity.totalScore > 70 ? 'text-[#10F4A0]' : 'text-[#FFB840]'
          }`}>
            {activity.totalScore}%
          </span>
        )}
        {activity.status === 'in_progress' && (
          <span className="text-[10px] font-mono text-[#00E5FF] animate-pulse uppercase tracking-widest">
            In Progress
          </span>
        )}
        <span className="text-[#4A5A80] text-[10px] font-mono">
          {formatTime(activity.completedAt || activity.startedAt)}
        </span>
      </div>
    </div>
  );
};

// ─── WEAK AREA BAR ──────────────────────────────────────────────────────────

const WeakAreaBar = ({ area }) => {
  const maxCount = 300; // Adjust based on your data scale
  const percentage = Math.min((area.count / maxCount) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-xs mb-2 font-mono uppercase tracking-tight">
        <span className="text-[#8899BB]">{area.area}</span>
        <span className="text-[#FF4466]">{area.count} users</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
          className="h-full bg-gradient-to-r from-[#FF4466] to-[#FFB840]" 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;