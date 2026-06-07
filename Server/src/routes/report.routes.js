import express from 'express';
// import { p from '../middleware/authMiddleware.js';
import protect from '../middlewares/auth.middleware.js';
// import { 
//     getReportBySession, 
//     getMyReports, 
//     getWeakAreas 
// } from '../controllers/reportController.js';
import { getReportBySession, getMyReports , getWeakAreas } from '../controllers/report.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * GET /api/reports/weakareas
 * Get user's top weak areas (aggregated)
 * Must be BEFORE /:sessionId to avoid route conflict
 */
router.get('/weakareas', getWeakAreas);

/**
 * GET /api/reports/my
 * Get all reports for current user
 * Query: ?limit=10&page=1
 */
router.get('/my', getMyReports);

/**
 * GET /api/reports/:sessionId
 * Get full report for a specific session
 */
router.get('/:sessionId', getReportBySession);

export default router;