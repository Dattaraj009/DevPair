







import express from "express";
import protect from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

import { 
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    updateProfile,
    changePassword
} from "../controllers/auth.controller.js";

const router = express.Router();

// Email + Password Auth
router.post("/register", authLimiter, registerWithEmail);
router.post("/login", authLimiter, loginWithEmail);
router.post("/logout", logout);

// Google Auth
router.post("/google", authLimiter, loginWithGoogle);

// Get current user
router.get("/me", protect, (req, res) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            currentStreak: user.currentStreak || 0,  
            longestStreak: user.longestStreak || 0  
        },
    });
});

// ✅ NEW: Profile management
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

// Admin test route
router.get("/admin-test", protect, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin",
    });
});

export default router;