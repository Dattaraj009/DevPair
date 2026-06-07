import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import {
  Search, Users, TrendingUp, Calendar, ChevronDown,
  ChevronUp, Loader2, Eye, Filter, X
} from 'lucide-react';

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers', page, sortBy, sortOrder, searchTerm],
    queryFn: async () => {
      let url = `/admin/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      
      const res = await api.get(url);
      return res.data.data;
    }
  });

  const users = usersData?.users || [];
  const totalPages = Math.ceil((usersData?.total || 0) / limit);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-syne text-3xl md:text-4xl font-extrabold">
              User <span className="text-[#00E5FF]">Management</span>
            </h1>
            <p className="text-[#8899BB] text-sm mt-2 font-mono">
              {usersData?.total || 0} total users
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#0E1830] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A5A80]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page
                }}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-[#4A5A80] focus:outline-none focus:border-[#00E5FF]/50"
              />
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-[#8899BB] hover:border-[#00E5FF]/30 hover:text-white transition-all"
            >
              <Filter size={20} />
              Sort
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Sort Options */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5"
            >
              <button
                onClick={() => handleSort('createdAt')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  sortBy === 'createdAt'
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'bg-white/5 text-[#8899BB] hover:bg-white/10'
                }`}
              >
                Registration Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              
              <button
                onClick={() => handleSort('totalInterviews')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  sortBy === 'totalInterviews'
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'bg-white/5 text-[#8899BB] hover:bg-white/10'
                }`}
              >
                Total Interviews {sortBy === 'totalInterviews' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>

              <button
                onClick={() => handleSort('avgScore')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  sortBy === 'avgScore'
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'bg-white/5 text-[#8899BB] hover:bg-white/10'
                }`}
              >
                Average Score {sortBy === 'avgScore' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </motion.div>
          )}
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-[#4A5A80] mx-auto mb-4" />
            <p className="text-[#4A5A80] text-lg">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-[#0E1830] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase text-[#4A5A80]">User</th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase text-[#4A5A80]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-mono uppercase text-[#4A5A80]">Joined</th>
                    <th className="px-6 py-4 text-center text-xs font-mono uppercase text-[#4A5A80]">Interviews</th>
                    <th className="px-6 py-4 text-center text-xs font-mono uppercase text-[#4A5A80]">Avg Score</th>
                    <th className="px-6 py-4 text-center text-xs font-mono uppercase text-[#4A5A80]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <UserRow
                      key={user._id}
                      user={user}
                      index={index}
                      onViewDetails={() => setSelectedUser(user)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onViewDetails={() => setSelectedUser(user)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-mono text-[#8899BB]">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

// ─── USER ROW (Desktop) ─────────────────────────────────────────────────────

const UserRow = ({ user, index, onViewDetails }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-[#10F4A0]';
    if (score >= 50) return 'text-[#FFB840]';
    return 'text-[#FF4466]';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/5 transition-all"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center font-bold text-black">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="font-semibold">{user.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-[#8899BB] text-sm">{user.email}</td>
      <td className="px-6 py-4 text-[#8899BB] text-sm font-mono">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg text-sm font-bold">
          {user.totalInterviews || 0}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-lg font-bold font-mono ${getScoreColor(user.avgScore || 0)}`}>
          {user.avgScore ? `${user.avgScore.toFixed(1)}%` : 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={onViewDetails}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 transition-all"
        >
          <Eye size={16} />
          View
        </button>
      </td>
    </motion.tr>
  );
};

// ─── USER CARD (Mobile) ─────────────────────────────────────────────────────

const UserCard = ({ user, onViewDetails }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-[#10F4A0]';
    if (score >= 50) return 'text-[#FFB840]';
    return 'text-[#FF4466]';
  };

  return (
    <div className="bg-[#0E1830] border border-white/5 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center font-bold text-black text-lg">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-xs text-[#8899BB]">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-1">Interviews</p>
          <p className="text-lg font-bold text-[#00E5FF]">{user.totalInterviews || 0}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-1">Avg Score</p>
          <p className={`text-lg font-bold ${getScoreColor(user.avgScore || 0)}`}>
            {user.avgScore ? `${user.avgScore.toFixed(1)}%` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-1">Joined</p>
          <p className="text-xs text-[#8899BB] font-mono">{formatDate(user.createdAt)}</p>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 transition-all"
      >
        <Eye size={16} />
        View Details
      </button>
    </div>
  );
};

// ─── USER DETAILS MODAL ─────────────────────────────────────────────────────

const UserDetailsModal = ({ user, onClose }) => {
  const { data: interviewsData, isLoading } = useQuery({
    queryKey: ['userInterviews', user._id],
    queryFn: async () => {
      const res = await api.get(`/admin/users/${user._id}/interviews`);
      return res.data.data;
    }
  });

  const interviews = interviewsData || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-[#10F4A0]';
    if (score >= 50) return 'text-[#FFB840]';
    return 'text-[#FF4466]';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0E1830] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0E1830] border-b border-white/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center font-bold text-black text-lg">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-syne text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-[#8899BB]">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={24} className="text-[#8899BB]" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 grid grid-cols-3 gap-4 border-b border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-2">Total Interviews</p>
            <p className="text-3xl font-syne font-bold text-[#00E5FF]">{user.totalInterviews || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-2">Average Score</p>
            <p className={`text-3xl font-syne font-bold ${getScoreColor(user.avgScore || 0)}`}>
              {user.avgScore ? `${user.avgScore.toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-2">Member Since</p>
            <p className="text-sm font-mono text-[#8899BB]">
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Interview History */}
        <div className="p-6">
          <h3 className="font-syne text-xl font-bold mb-4">Interview History</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00E5FF]" />
            </div>
          ) : interviews.length === 0 ? (
            <p className="text-center py-12 text-[#4A5A80]">No interviews yet</p>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-[#00E5FF]/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#A78BFA] rounded-lg text-xs font-bold uppercase">
                        {interview.role}
                      </span>
                      <span className="text-xs text-[#4A5A80] font-mono">
                        {interview.experience}
                      </span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(interview.totalScore || 0)}`}>
                      {interview.totalScore || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8899BB]">
                    <span className="flex items-center gap-2">
                      <Calendar size={12} />
                      {formatDate(interview.completedAt || interview.startedAt)}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      interview.status === 'completed' ? 'bg-[#10F4A0]/10 text-[#10F4A0]' :
                      interview.status === 'in_progress' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' :
                      'bg-[#8899BB]/10 text-[#8899BB]'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagementPage;