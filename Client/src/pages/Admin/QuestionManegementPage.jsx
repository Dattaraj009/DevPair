import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import {
  Plus, Edit2, Trash2, Search, Filter, X, Loader2,
  Sparkles, ChevronDown, ChevronUp, Eye, EyeOff
} from 'lucide-react';

const QuestionManagementPage = () => {
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Fetch questions
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['adminQuestions', roleFilter, difficultyFilter],
    queryFn: async () => {
      let url = '/admin/questions';
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await api.get(url);
      return res.data.data;
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (questionId) => {
      await api.delete(`/admin/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminQuestions']);
      toast.success('Question deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete question');
    }
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ questionId, isActive }) => {
      await api.patch(`/admin/questions/${questionId}`, { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminQuestions']);
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const questions = questionsData || [];
  
  // Filter by search term
  const filteredQuestions = questions.filter(q =>
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.skillTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(questionId);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowAddModal(true);
  };

  const handleToggleActive = (question) => {
    toggleActiveMutation.mutate({ 
      questionId: question._id, 
      isActive: question.isActive 
    });
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-syne text-3xl md:text-4xl font-extrabold">
              Question <span className="text-[#00E5FF]">Management</span>
            </h1>
            <p className="text-[#8899BB] text-sm mt-2 font-mono">
              {filteredQuestions.length} questions total
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <Sparkles size={20} />
              Generate with AI
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingQuestion(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <Plus size={20} />
              Add Question
            </motion.button>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions or tags..."
                className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-[#4A5A80] focus:outline-none focus:border-[#00E5FF]/50"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-[#8899BB] hover:border-[#00E5FF]/30 hover:text-white transition-all"
            >
              <Filter size={20} />
              Filters
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5"
              >
                <div>
                  <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
                  >
                    <option value="all">All Roles</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mern">MERN Stack</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Difficulty</label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00E5FF]/50"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#4A5A80] text-lg mb-4">No questions found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-[#00E5FF] hover:underline"
            >
              Add your first question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question._id}
                question={question}
                index={index}
                expanded={expandedQuestion === question._id}
                onToggleExpand={() => setExpandedQuestion(
                  expandedQuestion === question._id ? null : question._id
                )}
                onEdit={() => handleEdit(question)}
                onDelete={() => handleDelete(question._id)}
                onToggleActive={() => handleToggleActive(question)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <QuestionFormModal
            question={editingQuestion}
            onClose={() => {
              setShowAddModal(false);
              setEditingQuestion(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries(['adminQuestions']);
              setShowAddModal(false);
              setEditingQuestion(null);
            }}
          />
        )}

        {showAIModal && (
          <AIGenerateModal
            onClose={() => setShowAIModal(false)}
            onSuccess={() => {
              queryClient.invalidateQueries(['adminQuestions']);
              setShowAIModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// ─── QUESTION CARD COMPONENT ────────────────────────────────────────────────

const QuestionCard = ({ question, index, expanded, onToggleExpand, onEdit, onDelete, onToggleActive, isDeleting }) => {
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return 'text-[#10F4A0] bg-[#10F4A0]/10';
    if (difficulty === 'medium') return 'text-[#FFB840] bg-[#FFB840]/10';
    return 'text-[#FF4466] bg-[#FF4466]/10';
  };

  return (
    <div className="bg-[#0E1830] border border-white/5 rounded-xl overflow-hidden hover:border-[#00E5FF]/20 transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#4A5A80] font-mono text-sm">#{index + 1}</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              {question.role.map((r, i) => (
                <span key={i} className="px-3 py-1 bg-[#8B5CF6]/10 text-[#A78BFA] rounded-lg text-xs font-bold uppercase">
                  {r}
                </span>
              ))}
              {!question.isActive && (
                <span className="px-3 py-1 bg-[#4A5A80]/10 text-[#4A5A80] rounded-lg text-xs font-bold uppercase">
                  Inactive
                </span>
              )}
            </div>
            
            <p className="text-white font-medium mb-3 leading-relaxed">
              {question.questionText}
            </p>

            <div className="flex flex-wrap gap-2">
              {question.skillTags.map((tag, i) => (
                <span key={i} className="text-xs text-[#00E5FF] bg-[#00E5FF]/5 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp size={20} className="text-[#8899BB]" /> : <ChevronDown size={20} className="text-[#8899BB]" />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/5"
            >
              <div className="mb-4">
                <p className="text-[10px] text-[#4A5A80] font-mono uppercase mb-2">Expected Answer</p>
                <p className="text-[#8899BB] text-sm leading-relaxed bg-black/30 p-4 rounded-lg">
                  {question.expectedAnswer}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg hover:bg-[#00E5FF]/20 transition-all"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                
                <button
                  onClick={onToggleActive}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#A78BFA] rounded-lg hover:bg-[#8B5CF6]/20 transition-all"
                >
                  {question.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  {question.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF4466]/10 text-[#FF4466] rounded-lg hover:bg-[#FF4466]/20 transition-all disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── QUESTION FORM MODAL ────────────────────────────────────────────────────

const QuestionFormModal = ({ question, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    questionText: question?.questionText || '',
    expectedAnswer: question?.expectedAnswer || '',
    role: question?.role || [],
    difficulty: question?.difficulty || 'medium',
    experienceLevel: question?.experienceLevel || 'junior',
    skillTags: question?.skillTags?.join(', ') || '',
    isActive: question?.isActive ?? true
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        role: data.role,
        skillTags: data.skillTags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (question) {
        await api.put(`/admin/questions/${question._id}`, payload);
      } else {
        await api.post('/admin/questions', payload);
      }
    },
    onSuccess: () => {
      toast.success(question ? 'Question updated' : 'Question created');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save question');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.role.length === 0) {
      toast.error('Please select at least one role');
      return;
    }
    mutation.mutate(formData);
  };

  const toggleRole = (role) => {
    setFormData(prev => ({
      ...prev,
      role: prev.role.includes(role)
        ? prev.role.filter(r => r !== role)
        : [...prev.role, role]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0E1830] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#0E1830] border-b border-white/5 p-6 flex items-center justify-between">
          <h2 className="font-syne text-2xl font-bold">
            {question ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={24} className="text-[#8899BB]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Question Text *</label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white resize-none focus:outline-none focus:border-[#00E5FF]/50"
              placeholder="What is the difference between..."
            />
          </div>

          {/* Expected Answer */}
          <div>
            <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Expected Answer *</label>
            <textarea
              value={formData.expectedAnswer}
              onChange={(e) => setFormData({ ...formData, expectedAnswer: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white resize-none focus:outline-none focus:border-[#00E5FF]/50"
              placeholder="The main difference is..."
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Roles * (Select multiple)</label>
            <div className="flex gap-3">
              {['frontend', 'backend', 'mern'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${
                    formData.role.includes(role)
                      ? 'bg-[#00E5FF] text-black'
                      : 'bg-white/5 text-[#8899BB] hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Experience */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
              </select>
            </div>
          </div>

          {/* Skill Tags */}
          <div>
            <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Skill Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.skillTags}
              onChange={(e) => setFormData({ ...formData, skillTags: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              placeholder="React, Hooks, State Management"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-black/30"
            />
            <label htmlFor="isActive" className="text-sm text-white">
              Active (visible in interviews)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 bg-[#00E5FF] text-black font-bold rounded-xl hover:bg-[#00f5ff] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              question ? 'Update Question' : 'Create Question'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── AI GENERATE MODAL ──────────────────────────────────────────────────────

const AIGenerateModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    role: 'frontend',
    difficulty: 'medium',
    experienceLevel: 'junior',
    count: 5,
    topic: ''
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/admin/questions/generate', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Generated ${data.data?.length || formData.count} questions!`);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate questions');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0E1830] border border-white/10 rounded-2xl max-w-2xl w-full"
      >
        <div className="border-b border-white/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="font-syne text-2xl font-bold">AI Question Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={24} className="text-[#8899BB]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mern">MERN Stack</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Experience</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              >
                <option value="fresher">Fresher</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#4A5A80] font-mono uppercase mb-2 block">Topic (Optional)</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., React Hooks, MongoDB Aggregation, Node.js Streams"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF]/50"
            />
            <p className="text-xs text-[#4A5A80] mt-2">Leave blank to generate general questions</p>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating {formData.count} questions...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate {formData.count} Questions
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default QuestionManagementPage;