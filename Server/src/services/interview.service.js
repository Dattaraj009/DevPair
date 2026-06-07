



// import InterviewSession from "../models/Interview.model.js";
// import Question from "../models/Question.model.js";
// import Report from "../models/Report.model.js";
// import { evaluateAnswer } from "./ai.service.js";

// export const startInterview = async (userId, role, experience) => {
//     const questions = await Question.aggregate([
//         { 
//             $match: { 
//                 role: { $in: [role] },
//                 experienceLevel: experience,
//                 isActive: true 
//             } 
//         },
//         { $sample: { size: 10 } }
//     ]);

//     if (questions.length < 10) {
//         throw new Error(`Not enough questions for ${role} (${experience}). Found ${questions.length}/10.`);
//     }

//     const session = await InterviewSession.create({
//         userId,
//         role,
//         experience,
//         questions: questions.map(q => q._id),
//         status: 'in_progress'
//     });

//     const populatedSession = await InterviewSession.findById(session._id)
//         .populate('questions', 'questionText difficulty skillTags');

//     return populatedSession;
// };

// export const submitAnswer = async (userId, sessionId, questionId, userAnswer) => {
//     const session = await InterviewSession.findOne({ _id: sessionId, userId });
//     if (!session || session.status !== 'in_progress') {
//         throw new Error("Invalid or completed session");
//     }

//     const question = await Question.findById(questionId);
//     if (!question) throw new Error("Question not found");

//     const isSkipped = !userAnswer || userAnswer.trim().length < 5;

//     let aiResult;
//     let avgScore;

//     if (isSkipped) {
//         aiResult = {
//             correctness: 0,
//             clarity: 0,
//             depth: 0,
//             feedback: 'Question was skipped - no answer provided',
//             tip: 'Try to answer all questions to get better practice and feedback'
//         };
//         avgScore = 0;
//         userAnswer = '';
//     } else {
//         aiResult = await evaluateAnswer(
//             question.questionText, 
//             question.expectedAnswer, 
//             userAnswer.trim()
//         );
//         avgScore = Math.round((aiResult.correctness + aiResult.clarity + aiResult.depth) / 3);
//     }

//     let report = await Report.findOne({ sessionId });
    
//     if (!report) {
//         report = await Report.create({ 
//             sessionId, 
//             userId, 
//             role: session.role,
//             experience: session.experience,
//             answers: [] 
//         });
//     }

//     const existingAnswerIndex = report.answers.findIndex(
//         ans => ans.questionId.toString() === questionId.toString()
//     );

//     const answerData = {
//         questionId,
//         questionText: question.questionText,
//         skillTags: question.skillTags,
//         userAnswer,
//         scores: {
//             correctness: aiResult.correctness,
//             clarity: aiResult.clarity,
//             depth: aiResult.depth
//         },
//         answerScore: avgScore,
//         feedback: aiResult.feedback,
//         tip: aiResult.tip,
//         isSkipped: isSkipped
//     };

//     if (existingAnswerIndex >= 0) {
//         report.answers[existingAnswerIndex] = answerData;
//     } else {
//         report.answers.push(answerData);
//     }

//     await report.save();

//     return { 
//         success: true, 
//         feedback: aiResult.feedback, 
//         rating: avgScore,
//         tip: aiResult.tip
//     };
// };

// export const endInterview = async (userId, sessionId) => {
//     const session = await InterviewSession.findOneAndUpdate(
//         { _id: sessionId, userId },
//         { status: 'completed', completedAt: new Date() },
//         { new: true }
//     );

//     if (!session) throw new Error("Session not found");

//     const report = await Report.findOne({ sessionId });
    
//     if (report && report.answers.length > 0) {
//         const totalRating = report.answers.reduce((acc, ans) => acc + ans.answerScore, 0);
//         report.totalScore = Math.round((totalRating / report.answers.length) * 10);

//         const weakTopics = new Set();
//         const strongTopics = new Set();
        
//         report.answers.forEach(ans => {
//             if (!ans.isSkipped) {
//                 if (ans.answerScore < 5) {
//                     ans.skillTags.forEach(tag => weakTopics.add(tag));
//                 } else if (ans.answerScore >= 7) {
//                     ans.skillTags.forEach(tag => strongTopics.add(tag));
//                 }
//             }
//         });

//         report.weakAreas = Array.from(weakTopics);
//         report.strengths = Array.from(strongTopics);
//         report.overallFeedback = generateOverallFeedback(report.totalScore, report.weakAreas);
        
//         await report.save();
//     }

//     return { session, report };
// };

// export const getSessionById = async (userId, sessionId) => {
//     const session = await InterviewSession.findOne({ 
//         _id: sessionId, 
//         userId 
//     }).populate('questions', 'questionText difficulty skillTags');

//     return session;
// };

// export const getUserSessions = async (userId, options = {}) => {
//     const { status, limit = 10, page = 1, role } = options;
    
//     const query = { userId };
//     if (status) query.status = status;
//     if (role) query.role = role;

//     const skip = (page - 1) * limit;

//     const [interviews, total] = await Promise.all([
//         InterviewSession.find(query)
//             .sort({ completedAt: -1, startedAt: -1 })
//             .limit(limit)
//             .skip(skip)
//             .select('role experience status startedAt completedAt questions'),
//         InterviewSession.countDocuments(query)
//     ]);

//     const interviewsWithScores = await Promise.all(
//         interviews.map(async (interview) => {
//             const report = await Report.findOne({ sessionId: interview._id }).select('totalScore');
//             return {
//                 ...interview.toObject(),
//                 totalScore: report?.totalScore
//             };
//         })
//     );

//     return { 
//         data: interviewsWithScores,
//         pagination: {
//             total,
//             page: parseInt(page),
//             pages: Math.ceil(total / limit)
//         }
//     };
// };

// export const getUserStats = async (userId) => {
//     const interviews = await InterviewSession.find({ userId });
//     const completedInterviews = interviews.filter(i => i.status === 'completed');

//     const reports = await Report.find({ userId }).select('totalScore weakAreas');

//     const totalInterviews = interviews.length;
//     const completedCount = completedInterviews.length;
    
//     const averageScore = reports.length > 0
//         ? reports.reduce((sum, r) => sum + (r.totalScore || 0), 0) / reports.length
//         : 0;

//     const bestScore = reports.length > 0
//         ? Math.max(...reports.map(r => r.totalScore || 0))
//         : 0;

//     const weakAreasMap = {};
//     reports.forEach(report => {
//         report.weakAreas?.forEach(area => {
//             weakAreasMap[area] = (weakAreasMap[area] || 0) + 1;
//         });
//     });

//     const topWeakAreas = Object.entries(weakAreasMap)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([area]) => area);

//     return {
//         totalInterviews,
//         completedInterviews: completedCount,
//         averageScore,
//         bestScore,
//         topWeakAreas
//     };
// };

// export const abandonSession = async (userId, sessionId) => {
//     const session = await InterviewSession.findOneAndUpdate(
//         { _id: sessionId, userId, status: 'in_progress' },
//         { status: 'abandoned', completedAt: new Date() },
//         { new: true }
//     );

//     if (!session) {
//         throw new Error("Session not found or already completed");
//     }

//     return session;
// };

// const generateOverallFeedback = (totalScore, weakAreas) => {
//     if (totalScore >= 80) {
//         return `Excellent performance! ${weakAreas.length > 0 ? `Focus on improving: ${weakAreas.join(', ')}` : 'Keep up the great work!'}`;
//     } else if (totalScore >= 60) {
//         return `Good effort! Work on: ${weakAreas.join(', ')}`;
//     } else {
//         return `Needs improvement. Focus heavily on: ${weakAreas.join(', ')}`;
//     }
// };




// // ✅ ADD THIS FUNCTION
// export const updateUserStreak = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) return;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const lastDate = user.lastInterviewDate ? new Date(user.lastInterviewDate) : null;
  
//   if (lastDate) {
//     lastDate.setHours(0, 0, 0, 0);
//     const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

//     if (daysDiff === 0) {
//       // Same day, don't update
//       return;
//     } else if (daysDiff === 1) {
//       // Consecutive day, increment streak
//       user.currentStreak += 1;
//     } else {
//       // Streak broken, reset
//       user.currentStreak = 1;
//     }
//   } else {
//     // First interview ever
//     user.currentStreak = 1;
//   }

//   // Update longest streak
//   if (user.currentStreak > user.longestStreak) {
//     user.longestStreak = user.currentStreak;
//   }

//   user.lastInterviewDate = today;
//   await user.save();
// };





import InterviewSession from "../models/Interview.model.js";
import Question from "../models/Question.model.js";
import Report from "../models/Report.model.js";
import User from "../models/User.model.js";  // ✅ ADD THIS IMPORT
import { evaluateAnswer } from "./ai.service.js";

export const startInterview = async (userId, role, experience) => {
    const questions = await Question.aggregate([
        { 
            $match: { 
                role: { $in: [role] },
                experienceLevel: experience,
                isActive: true 
            } 
        },
        { $sample: { size: 10 } }
    ]);

    if (questions.length < 10) {
        throw new Error(`Not enough questions for ${role} (${experience}). Found ${questions.length}/10.`);
    }

    const session = await InterviewSession.create({
        userId,
        role,
        experience,
        questions: questions.map(q => q._id),
        status: 'in_progress'
    });

    const populatedSession = await InterviewSession.findById(session._id)
        .populate('questions', 'questionText difficulty skillTags');

    return populatedSession;
};

export const submitAnswer = async (userId, sessionId, questionId, userAnswer) => {
    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session || session.status !== 'in_progress') {
        throw new Error("Invalid or completed session");
    }

    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const isSkipped = !userAnswer || userAnswer.trim().length < 5;

    let aiResult;
    let avgScore;

    if (isSkipped) {
        aiResult = {
            correctness: 0,
            clarity: 0,
            depth: 0,
            feedback: 'Question was skipped - no answer provided',
            tip: 'Try to answer all questions to get better practice and feedback'
        };
        avgScore = 0;
        userAnswer = '';
    } else {
        aiResult = await evaluateAnswer(
            question.questionText, 
            question.expectedAnswer, 
            userAnswer.trim()
        );
        avgScore = Math.round((aiResult.correctness + aiResult.clarity + aiResult.depth) / 3);
    }

    let report = await Report.findOne({ sessionId });
    
    if (!report) {
        report = await Report.create({ 
            sessionId, 
            userId, 
            role: session.role,
            experience: session.experience,
            answers: [] 
        });
    }

    const existingAnswerIndex = report.answers.findIndex(
        ans => ans.questionId.toString() === questionId.toString()
    );

    const answerData = {
        questionId,
        questionText: question.questionText,
        skillTags: question.skillTags,
        userAnswer,
        scores: {
            correctness: aiResult.correctness,
            clarity: aiResult.clarity,
            depth: aiResult.depth
        },
        answerScore: avgScore,
        feedback: aiResult.feedback,
        tip: aiResult.tip,
        isSkipped: isSkipped
    };

    if (existingAnswerIndex >= 0) {
        report.answers[existingAnswerIndex] = answerData;
    } else {
        report.answers.push(answerData);
    }

    await report.save();

    return { 
        success: true, 
        feedback: aiResult.feedback, 
        rating: avgScore,
        tip: aiResult.tip
    };
};

// ✅ UPDATED endInterview - Now calls updateUserStreak
export const endInterview = async (userId, sessionId) => {
    const session = await InterviewSession.findOneAndUpdate(
        { _id: sessionId, userId },
        { status: 'completed', completedAt: new Date() },
        { new: true }
    );

    if (!session) throw new Error("Session not found");

    const report = await Report.findOne({ sessionId });
    
    if (report && report.answers.length > 0) {
        const totalRating = report.answers.reduce((acc, ans) => acc + ans.answerScore, 0);
        report.totalScore = Math.round((totalRating / report.answers.length) * 10);

        const weakTopics = new Set();
        const strongTopics = new Set();
        
        report.answers.forEach(ans => {
            if (!ans.isSkipped) {
                if (ans.answerScore < 5) {
                    ans.skillTags.forEach(tag => weakTopics.add(tag));
                } else if (ans.answerScore >= 7) {
                    ans.skillTags.forEach(tag => strongTopics.add(tag));
                }
            }
        });

        report.weakAreas = Array.from(weakTopics);
        report.strengths = Array.from(strongTopics);
        report.overallFeedback = generateOverallFeedback(report.totalScore, report.weakAreas);
        
        await report.save();
    }

    // ✅ UPDATE USER STREAK AFTER COMPLETING INTERVIEW
    await updateUserStreak(userId);

    return { session, report };
};

export const getSessionById = async (userId, sessionId) => {
    const session = await InterviewSession.findOne({ 
        _id: sessionId, 
        userId 
    }).populate('questions', 'questionText difficulty skillTags');

    return session;
};

export const getUserSessions = async (userId, options = {}) => {
    const { status, limit = 10, page = 1, role } = options;
    
    const query = { userId };
    if (status) query.status = status;
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const [interviews, total] = await Promise.all([
        InterviewSession.find(query)
            .sort({ completedAt: -1, startedAt: -1 })
            .limit(limit)
            .skip(skip)
            .select('role experience status startedAt completedAt questions'),
        InterviewSession.countDocuments(query)
    ]);

    const interviewsWithScores = await Promise.all(
        interviews.map(async (interview) => {
            const report = await Report.findOne({ sessionId: interview._id }).select('totalScore');
            return {
                ...interview.toObject(),
                totalScore: report?.totalScore
            };
        })
    );

    return { 
        data: interviewsWithScores,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getUserStats = async (userId) => {
    const interviews = await InterviewSession.find({ userId });
    const completedInterviews = interviews.filter(i => i.status === 'completed');

    const reports = await Report.find({ userId }).select('totalScore weakAreas');

    const totalInterviews = interviews.length;
    const completedCount = completedInterviews.length;
    
    const averageScore = reports.length > 0
        ? reports.reduce((sum, r) => sum + (r.totalScore || 0), 0) / reports.length
        : 0;

    const bestScore = reports.length > 0
        ? Math.max(...reports.map(r => r.totalScore || 0))
        : 0;

    const weakAreasMap = {};
    reports.forEach(report => {
        report.weakAreas?.forEach(area => {
            weakAreasMap[area] = (weakAreasMap[area] || 0) + 1;
        });
    });

    const topWeakAreas = Object.entries(weakAreasMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([area]) => area);

    return {
        totalInterviews,
        completedInterviews: completedCount,
        averageScore,
        bestScore,
        topWeakAreas
    };
};

export const abandonSession = async (userId, sessionId) => {
    const session = await InterviewSession.findOneAndUpdate(
        { _id: sessionId, userId, status: 'in_progress' },
        { status: 'abandoned', completedAt: new Date() },
        { new: true }
    );

    if (!session) {
        throw new Error("Session not found or already completed");
    }

    return session;
};

const generateOverallFeedback = (totalScore, weakAreas) => {
    if (totalScore >= 80) {
        return `Excellent performance! ${weakAreas.length > 0 ? `Focus on improving: ${weakAreas.join(', ')}` : 'Keep up the great work!'}`;
    } else if (totalScore >= 60) {
        return `Good effort! Work on: ${weakAreas.join(', ')}`;
    } else {
        return `Needs improvement. Focus heavily on: ${weakAreas.join(', ')}`;
    }
};

// ✅ NEW FUNCTION - Update user streak
export const updateUserStreak = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastInterviewDate ? new Date(user.lastInterviewDate) : null;
    
    if (lastDate) {
        lastDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
            // Same day, don't update
            return;
        } else if (daysDiff === 1) {
            // Consecutive day, increment streak
            user.currentStreak += 1;
        } else {
            // Streak broken, reset
            user.currentStreak = 1;
        }
    } else {
        // First interview ever
        user.currentStreak = 1;
    }

    // Update longest streak
    if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
    }

    user.lastInterviewDate = today;
    await user.save();
};