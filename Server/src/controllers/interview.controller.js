




// import * as interviewService from "../services/interview.service.js";
import * as interviewService from "../services/interview.service.js"
import { emitToUser } from "../sockets/interview.Socket.js";

export const startInterview = async (req, res, next) => {
    try {
        const { role, experience } = req.body;
        const userId = req.user._id;

        if (!role || !experience) {
            return res.status(400).json({ 
                success: false, 
                message: "role and experience are required" 
            });
        }

        const session = await interviewService.startInterview(userId, role, experience);

        emitToUser(userId.toString(), 'interview:started', {
            sessionId: session._id,
            questionCount: session.questions.length
        });

        res.status(201).json({
            success: true,
            message: "Interview session created successfully",
            data: {
                sessionId: session._id,
                role: session.role,
                experience: session.experience,
                questions: session.questions,
                currentQuestionIndex: session.currentQuestionIndex,
                status: session.status,
                startedAt: session.startedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export const submitAnswer = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { questionId, userAnswer } = req.body;
        const userId = req.user._id;

        if (!questionId) {
            return res.status(400).json({ 
                success: false, 
                message: "questionId is required" 
            });
        }

        const result = await interviewService.submitAnswer(
            userId, 
            sessionId, 
            questionId, 
            userAnswer || ""
        );

        emitToUser(userId.toString(), 'answer:evaluated', {
            sessionId,
            questionId,
            rating: result.rating,
            feedback: result.feedback
        });

        res.status(200).json({
            success: true,
            message: "Answer submitted and evaluated",
            data: {
                rating: result.rating,
                feedback: result.feedback,
                tip: result.tip
            }
        });
    } catch (error) {
        next(error);
    }
};

export const completeInterview = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const { session, report } = await interviewService.endInterview(userId, sessionId);

        emitToUser(userId.toString(), 'interview:completed', {
            sessionId: session._id,
            totalScore: report.totalScore,
            reportId: report._id
        });

        res.status(200).json({
            success: true,
            message: "Interview completed successfully",
            data: {
                session: {
                    id: session._id,
                    status: session.status,
                    completedAt: session.completedAt
                },
                report: {
                    id: report._id,
                    totalScore: report.totalScore,
                    strengths: report.strengths,
                    weakAreas: report.weakAreas,
                    overallFeedback: report.overallFeedback,
                    answeredQuestions: report.answers.length
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getInterviewSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const session = await interviewService.getSessionById(userId, sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found"
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        next(error);
    }
};

export const getMyInterviews = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { status, limit = 10, page = 1, role } = req.query;

        const sessions = await interviewService.getUserSessions(userId, {
            status,
            limit: parseInt(limit),
            page: parseInt(page),
            role
        });

        res.status(200).json({
            success: true,
            data: sessions.data,
            pagination: sessions.pagination
        });
    } catch (error) {
        next(error);
    }
};

export const getMyStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const stats = await interviewService.getUserStats(userId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

export const abandonInterview = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const session = await interviewService.abandonSession(userId, sessionId);

        res.status(200).json({
            success: true,
            message: "Interview marked as abandoned",
            data: session
        });
    } catch (error) {
        next(error);
    }
};