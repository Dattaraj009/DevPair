




import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";
import bcrypt from "bcrypt";
import admin from "../config/firebase.js";

const registerWithEmailService = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        authProvider: "local"
    });
    return user;
};

const loginWithEmailService = async ({ email, password }) => {
    // Check User model first
    let account = await User.findOne({ email }).select("+password");

    // If not found, check Admin model
    if (!account) {
        account = await Admin.findOne({ email }).select("+password");
    }

    // Not found in either model
    if (!account) {
        throw new Error("User not found");
    }

    // Only check authProvider for User accounts (Admin has no authProvider)
    if (account.authProvider && account.authProvider !== "local") {
        throw new Error("Invalid email and password");
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
        throw new Error("Invalid email and password");
    }

    return account;
};

const loginWithGoogleService = async ({ idToken }) => {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture } = decodedToken;

    if (!email) {
        throw new Error("Google account have no email");
    }

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name: name || "Google User",
            email,
            avatar: picture,
            authProvider: "google",
            isVerified: true
        });
    }
    return user;
};

// ✅ NEW: Update profile service
const updateProfileService = async (userId, updates) => {
    const user = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

// ✅ NEW: Change password service
const changePasswordService = async (userId, currentPassword, newPassword) => {
    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw new Error("User not found");
    }

    // Check if user uses email auth
    if (user.authProvider !== 'local') {
        throw new Error('Password change is only available for email accounts');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return true;
};

export { 
    registerWithEmailService, 
    loginWithEmailService, 
    loginWithGoogleService,
    updateProfileService,
    changePasswordService
};