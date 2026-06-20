




// import {
//     registerWithEmailService,
//     loginWithEmailService,
//     loginWithGoogleService,
//     updateProfileService,
//     changePasswordService
// } from "../services/auth.service.js";
// import generateToken from "../utils/jwt.util.js";

// const registerWithEmail = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const user = await registerWithEmailService({
//             name,
//             email,
//             password,
//         });

//         const token = generateToken(res, user._id, user.role);

//         res.status(200).json({
//             success: true,
//             message: "User registered successfully",
//             user,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const loginWithEmail = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await loginWithEmailService({
//             email,
//             password,
//         });

//         generateToken(res, user._id, user.role);

//         res.status(200).json({
//             success: true,
//             message: "User logged in successfully",
//             user,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const loginWithGoogle = async (req, res) => {
//     try {
//         const { idToken } = req.body;

//         if (!idToken) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Google id token is required",
//             });
//         }

//         const user = await loginWithGoogleService({
//             idToken,
//         });

//         generateToken(res, user._id, user.role);

//         res.status(200).json({
//             success: true,
//             message: "Google login successfully",
//             user,
//         });
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const logout = async (req, res) => {
//     try {
//         res.cookie("jwt", "", {
//             httpOnly: true,
//             expires: new Date(0),
//         });
//         res.status(200).json({
//             success: true,
//             message: "User logged out successfully",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // ✅ NEW: Update profile
// const updateProfile = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const userId = req.user._id;

//         if (!name || name.trim().length === 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Name is required' 
//             });
//         }

//         const user = await updateProfileService(userId, { name: name.trim() });

//         res.json({
//             success: true,
//             message: 'Profile updated successfully',
//             data: user
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ NEW: Change password
// const changePassword = async (req, res) => {
//     try {
//         const { currentPassword, newPassword } = req.body;
//         const userId = req.user._id;

//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Current password and new password are required'
//             });
//         }

//         if (newPassword.length < 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'New password must be at least 6 characters'
//             });
//         }

//         await changePasswordService(userId, currentPassword, newPassword);

//         res.json({
//             success: true,
//             message: 'Password changed successfully'
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export { 
//     registerWithEmail, 
//     loginWithEmail, 
//     loginWithGoogle, 
//     logout,
//     updateProfile,
//     changePassword
// };



import {
    registerWithEmailService,
    loginWithEmailService,
    loginWithGoogleService,
    updateProfileService,
    changePasswordService
} from "../services/auth.service.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util.js";
import jwt from "jsonwebtoken";

const registerWithEmail = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerWithEmailService({
            name,
            email,
            password,
        });

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
            accessToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginWithEmailService({ email, password });
        
        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginWithGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ success: false, message: "Google id token is required" });
        
        const user = await loginWithGoogleService({ idToken });
        const accessToken = signAccessToken(user._id, user.role);
        const refreshToken = signRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Google login successfully",
            user,
            accessToken
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ success: false, message: "Refresh token required" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { newAccessToken, user } = await refreshService(decoded.userId);
        
        res.status(200).json({ success: true, accessToken: newAccessToken, user });
    } catch (error) {
        return res.status(403).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name is required' 
            });
        }

        const user = await updateProfileService(userId, { name: name.trim() });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        await changePasswordService(userId, currentPassword, newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { 
    registerWithEmail, 
    loginWithEmail, 
    loginWithGoogle, 
    logout,
    updateProfile,
    changePassword
};