import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        select: false,
        // required: true,
        // minlength: 6
    },

    authProvider: {
        type: String,
        enum: ['local', 'google'],
        required: true
    },
    providerId: {
        type: String
    },

    role: {
        type: String,
        enum: ['user'],
        default: 'user'

    },
    interviewStats: {
        totalInterviews: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        }
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastInterviewDate: {
        type: Date,
        default: null
    }


},
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
