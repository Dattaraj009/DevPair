




import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { io } from 'socket.io-client';
import {
    Clock, ChevronRight, Send, AlertCircle,
    CheckCircle2, Lightbulb, Loader2, SkipForward,
    Zap, TrendingUp
} from 'lucide-react';

const InterviewPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(120);
    const [timerActive, setTimerActive] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const socketRef = useRef(null);
    const timerRef = useRef(null);
    const isSubmittingRef = useRef(false); // ✅ FIX: Prevent double submission

    const { data: session, isLoading: loadingSession } = useQuery({
        queryKey: ['interview', sessionId],
        queryFn: async () => {
            const res = await api.get(`/interviews/${sessionId}`);
            return res.data.data;
        },
        enabled: !!sessionId,
        onError: (error) => {
            toast.error('Failed to load interview session');
            navigate('/dashboard');
        }
    });

    const submitAnswerMutation = useMutation({
        mutationFn: async (answerData) => {
            const res = await api.post(`/interviews/${sessionId}/answer`, answerData);
            return res.data.data;
        },
        onSuccess: (data) => {
            setCurrentFeedback(data);
            setShowFeedback(true);

            setTimeout(() => {
                setShowFeedback(false);
                moveToNextQuestion();
            }, 5000);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit answer');
            isSubmittingRef.current = false; // ✅ FIX: Unlock on error
            setTimerActive(true);
        }
    });

    const completeInterviewMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/interviews/${sessionId}/complete`);
            return res.data.data;
        },
        onSuccess: (data) => {
            console.log('✅ Interview completed successfully:', data);
            toast.success('Interview completed! 🎉');
            setTimeout(() => {
                navigate(`/report/${sessionId}`);
            }, 100);
        },
        onError: (error) => {
            console.error('❌ Complete interview error:', error);
            toast.error('Failed to complete interview');
        }
    });

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            withCredentials: true
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🔌 Socket connected');
            socket.emit('join:interview', sessionId);
        });

        socket.on('answer:evaluated', (data) => {
            console.log('📨 Real-time feedback:', data);
        });

        socket.on('interview:completed', (data) => {
            console.log('✅ Interview completed:', data);
        });

        return () => {
            socket.disconnect();
        };
    }, [sessionId]);

    useEffect(() => {
        if (!timerActive) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timerActive, currentQuestionIndex]);

    const handleSubmit = (isAutoSubmit = false) => {
        // ✅ FIX: Check both mutation state AND lock ref
        if (submitAnswerMutation.isPending || isSubmittingRef.current) return;

        const currentQuestion = session?.questions[currentQuestionIndex];
        if (!currentQuestion) return;

        isSubmittingRef.current = true; // ✅ FIX: Lock to prevent double submission
        setTimerActive(false);

        submitAnswerMutation.mutate({
            questionId: currentQuestion._id,
            userAnswer: userAnswer.trim() || ''
        });

        if (!isAutoSubmit) {
            toast.loading('Evaluating your answer...', { id: 'eval' });
        }
    };

    const handleSkip = () => {
        // ✅ FIX: Check both mutation state AND lock ref
        if (submitAnswerMutation.isPending || isSubmittingRef.current) return;

        const currentQuestion = session?.questions[currentQuestionIndex];
        if (!currentQuestion) return;

        isSubmittingRef.current = true; // ✅ FIX: Lock
        setTimerActive(false);

        submitAnswerMutation.mutate({
            questionId: currentQuestion._id,
            userAnswer: ''
        });
    };

    const moveToNextQuestion = () => {
        isSubmittingRef.current = false; // ✅ FIX: Unlock for next question
        toast.dismiss('eval');

        const isLastQuestion = currentQuestionIndex >= (session?.questions.length - 1);

        if (isLastQuestion) {
            console.log('🏁 Last question answered, completing interview...');
            completeInterviewMutation.mutate();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserAnswer('');
            setTimeLeft(120);
            setTimerActive(true);
            setCurrentFeedback(null);
        }
    };

    if (loadingSession) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF] mx-auto mb-4" />
                    <p className="text-[#8899BB] font-mono text-sm">Loading interview...</p>
                </div>
            </div>
        );
    }

    if (!session || !session.questions || session.questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-[#FF4466] mx-auto mb-4" />
                    <p className="text-white font-bold mb-2">Session not found</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-[#00E5FF] text-sm hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = session.questions[currentQuestionIndex];

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF] mx-auto mb-4" />
                    <p className="text-[#8899BB] font-mono text-sm">Completing interview...</p>
                </div>
            </div>
        );
    }

    const progress = Math.round(((currentQuestionIndex + 1) / session.questions.length) * 100);
    const isLastQuestion = currentQuestionIndex >= session.questions.length - 1;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft <= 30) return 'text-[#FF4466]';
        if (timeLeft <= 60) return 'text-[#FFB840]';
        return 'text-[#00E5FF]';
    };

    return (
        <div className="min-h-screen bg-[#060B18] text-[#EDF2FF] p-4 md:p-8 pt-24">
            <div className="max-w-4xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-1.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30">
                                <span className="text-[#A78BFA] font-mono text-xs font-bold uppercase tracking-widest">
                                    {session.role}
                                </span>
                            </div>
                            <span className="text-[#4A5A80] font-mono text-sm">
                                Question {currentQuestionIndex + 1} / {session.questions.length}
                            </span>
                        </div>

                        <div className={`font-mono text-3xl font-bold ${getTimerColor()}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0E1830] border border-white/5 rounded-2xl p-8 mb-6 shadow-2xl"
                >
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                                <span className="text-[#00E5FF] text-xs font-mono uppercase font-bold">
                                    {currentQuestion.difficulty}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {currentQuestion.skillTags?.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="text-[#8899BB] text-xs font-mono">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <p className="text-xl leading-relaxed text-white font-medium">
                            {currentQuestion.questionText}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="text-[11px] font-mono text-[#4A5A80] uppercase tracking-widest block mb-3">
                            // Your Answer
                        </label>
                        <textarea
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={submitAnswerMutation.isPending}
                            placeholder="Type your answer here... Be specific and provide examples if possible."
                            className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-[#EDF2FF] font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-[#00E5FF]/50 transition-colors disabled:opacity-50"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-[#4A5A80] font-mono">
                                {userAnswer.length} characters
                            </span>
                            {userAnswer.length < 20 && userAnswer.length > 0 && (
                                <span className="text-[10px] text-[#FFB840] font-mono flex items-center gap-1">
                                    <AlertCircle size={12} /> Try to write at least 20 characters
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={handleSkip}
                            disabled={submitAnswerMutation.isPending}
                            className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-[#8899BB] hover:text-white hover:border-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipForward size={18} />
                            Skip Question
                        </button>

                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitAnswerMutation.isPending || !userAnswer.trim()}
                            className="flex items-center gap-2 px-8 py-3 bg-[#00E5FF] text-black font-syne font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitAnswerMutation.isPending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Evaluating...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    {isLastQuestion ? 'Complete Interview' : 'Submit & Continue'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                <div className="bg-[#0E1830]/50 border border-[#00E5FF]/10 rounded-xl p-5 flex items-start gap-4">
                    <Lightbulb className="w-5 h-5 text-[#FFB840] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-[#8899BB] mb-1">
                            <span className="font-bold text-white">Pro Tip:</span> Structure your answer with examples.
                            Mention use cases, advantages, and when you'd use this approach.
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {showFeedback && currentFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-8 right-8 max-w-md z-50"
                        >
                            <div className="bg-[#0E1830] border-2 border-[#00E5FF]/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentFeedback.rating >= 7 ? 'bg-[#10F4A0]/10 text-[#10F4A0]' :
                                            currentFeedback.rating >= 5 ? 'bg-[#FFB840]/10 text-[#FFB840]' :
                                                'bg-[#FF4466]/10 text-[#FF4466]'
                                        }`}>
                                        {currentFeedback.rating >= 7 ? <CheckCircle2 size={24} /> :
                                            currentFeedback.rating >= 5 ? <TrendingUp size={24} /> :
                                                <AlertCircle size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="font-syne text-3xl font-bold text-white">
                                                {currentFeedback.rating}
                                            </span>
                                            <span className="text-[#4A5A80] text-sm">/10</span>
                                        </div>
                                        <p className="text-sm text-[#8899BB] mb-3">
                                            {currentFeedback.feedback}
                                        </p>
                                        {currentFeedback.tip && (
                                            <div className="flex items-start gap-2 p-3 bg-[#FFB840]/5 border border-[#FFB840]/20 rounded-lg">
                                                <Zap className="w-4 h-4 text-[#FFB840] flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-[#FFB840]">{currentFeedback.tip}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={moveToNextQuestion}
                                    className="w-full py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] rounded-lg text-sm font-bold hover:bg-[#00E5FF]/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLastQuestion ? 'View Results' : 'Next Question'}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InterviewPage;