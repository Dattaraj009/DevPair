






import express from 'express';
import {
    startInterview,
    submitAnswer,
    completeInterview,
    getInterviewSession,
    getMyInterviews,
    getMyStats,
    abandonInterview
} from "../controllers/interview.controller.js"
import protect from '../middlewares/auth.middleware.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/:sessionId/answer', protect, aiLimiter, submitAnswer);
router.post('/:sessionId/complete', protect, completeInterview);
router.get('/:sessionId', protect, getInterviewSession);
router.get('/my/all', protect, getMyInterviews);
router.get('/my/stats', protect, getMyStats);
router.patch('/:sessionId/abandon', protect, abandonInterview);

export default router;