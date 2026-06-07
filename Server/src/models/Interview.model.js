import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'mern']
    },
    experience: {
        type: String,
        required: true,
        enum: ['fresher', 'junior', 'mid']
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    currentQuestionIndex: {  // ✅ ADDED
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['in_progress', 'completed', 'abandoned'],
        default: 'in_progress'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("InterviewSession", interviewSessionSchema);