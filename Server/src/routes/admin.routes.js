import {createQuestion , getAllQuestions, updateQuestion, deleteQuestion , toggleActiveQuestion,
    bulkGenerateQuestions,
    getAdminStats,
    getRecentActivity,
    getPlatformWeakAreas,
    getAllUsers,
    getUserInterviews,
    
    
} from "../controllers/admin.controller.js";
import express from "express";
import protect from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();


router.post("/question",protect, isAdmin, createQuestion);
router.get("/questions",protect, isAdmin, getAllQuestions);
router.put("/question/:id",protect, isAdmin, updateQuestion);
router.delete("/question/:id",protect, isAdmin, deleteQuestion);

router.patch("/question/:id", protect, isAdmin, toggleActiveQuestion);  // Toggle active/inactive
router.post("/questions/generate", protect, isAdmin, bulkGenerateQuestions); 


// In admin.routes.js or create admin.analytics.routes.js

router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/recent-activity', protect, isAdmin, getRecentActivity);
router.get('/weak-areas', protect, isAdmin, getPlatformWeakAreas);



router.get('/users', protect, isAdmin, getAllUsers);
router.get('/users/:userId/interviews', protect, isAdmin, getUserInterviews);

export default router;