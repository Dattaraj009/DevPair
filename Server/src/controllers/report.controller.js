import Report from "../models/Report.model.js";

/**
 * GET /api/reports/:sessionId
 * Get full report for a completed session
 */
export const getReportBySession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const report = await Report.findOne({ sessionId, userId })
            .populate('sessionId', 'role experience status completedAt')
            .populate('answers.questionId', 'difficulty');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/reports/my
 * Get all reports for current user
 */
export const getMyReports = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { limit = 10, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        const [reports, total] = await Promise.all([
            Report.find({ userId })
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip)
                .populate('sessionId', 'role experience completedAt'),
            Report.countDocuments({ userId })
        ]);

        res.status(200).json({
            success: true,
            data: reports,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/reports/weakareas
 * Get aggregated weak areas for user
 */
export const getWeakAreas = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Aggregate all weak areas from user's reports
        const reports = await Report.find({ userId }).select('weakAreas');
        
        const weakAreaCounts = {};
        reports.forEach(report => {
            report.weakAreas.forEach(area => {
                weakAreaCounts[area] = (weakAreaCounts[area] || 0) + 1;
            });
        });

        // Sort by frequency
        const sortedWeakAreas = Object.entries(weakAreaCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10) // Top 10
            .map(([area, count]) => ({ area, count }));

        res.status(200).json({
            success: true,
            data: sortedWeakAreas
        });
    } catch (error) {
        next(error);
    }
};