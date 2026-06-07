import * as questionService from "../services/question.service.js";
import User from "../models/User.model.js";
import InterviewSession from "../models/Interview.model.js"
import Question from "../models/Question.model.js";
import Report from "../models/Report.model.js";

export const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.user._id, req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel } = req.query;
    const questions = await questionService.getAllQuestions({ role, difficulty, experienceLevel });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(req.params.id, req.body);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await questionService.deleteQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }
    res.status(200).json({ success: true, message: "Question deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





// Toggle active status
export const toggleActiveQuestion = async (req, res) => {
  try {
    const { isActive } = req.body;
    const question = await questionService.updateQuestion(req.params.id, { isActive });

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: `Question ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: question
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Bulk generate questions with AI
export const bulkGenerateQuestions = async (req, res) => {
  try {
    const { role, difficulty, experienceLevel, count = 5, topic } = req.body;

    if (!role || !difficulty || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "role, difficulty, and experienceLevel are required"
      });
    }

    if (count < 1 || count > 20) {
      return res.status(400).json({
        success: false,
        message: "count must be between 1 and 20"
      });
    }

    const questions = await questionService.bulkGenerateQuestions(
      req.user._id,
      { role, difficulty, experienceLevel, count, topic }
    );

    res.status(201).json({
      success: true,
      message: `Successfully generated ${questions.length} questions`,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalInterviews, totalQuestions, completedInterviews] = await Promise.all([
      User.countDocuments(),
      InterviewSession.countDocuments(),
      Question.countDocuments(),
      InterviewSession.countDocuments({ status: 'completed' })
    ]);

    // Calculate average score from reports
    const reports = await Report.find({ totalScore: { $exists: true } }).select('totalScore');
    const avgScore = reports.length > 0
      ? reports.reduce((sum, r) => sum + r.totalScore, 0) / reports.length
      : 0;

    // Count active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await InterviewSession.countDocuments({
      startedAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInterviews,
        totalQuestions,
        avgScore,
        activeToday
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const activities = await InterviewSession.find()
      .sort({ completedAt: -1, startedAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .lean();

    // Get scores from reports
    const activitiesWithScores = await Promise.all(
      activities.map(async (activity) => {
        const report = await Report.findOne({ sessionId: activity._id }).select('totalScore');
        return {
          ...activity,
          totalScore: report?.totalScore
        };
      })
    );

    res.json({ success: true, data: activitiesWithScores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlatformWeakAreas = async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const weakAreas = await Report.aggregate([
      { $unwind: '$weakAreas' },
      {
        $group: {
          _id: '$weakAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          area: '$_id',
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: weakAreas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Build search query
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email createdAt')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    // Get stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const interviews = await InterviewSession.find({ userId: user._id, status: 'completed' });
        const reports = await Report.find({ userId: user._id }).select('totalScore');

        const totalInterviews = interviews.length;
        const avgScore = reports.length > 0
          ? reports.reduce((sum, r) => sum + (r.totalScore || 0), 0) / reports.length
          : 0;

        return {
          ...user,
          totalInterviews,
          avgScore
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await InterviewSession.find({ userId })
      .sort({ completedAt: -1, startedAt: -1 })
      .lean();

    // Get scores from reports
    const interviewsWithScores = await Promise.all(
      interviews.map(async (interview) => {
        const report = await Report.findOne({ sessionId: interview._id }).select('totalScore');
        return {
          ...interview,
          totalScore: report?.totalScore || 0
        };
      })
    );

    res.json({ success: true, data: interviewsWithScores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};