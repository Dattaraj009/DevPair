import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
    },
    questionText: { type: String, required: true },  // ✅ Snapshot
    skillTags: { type: [String], default: [] },      // ✅ For analysis
    userAnswer: { type: String, default: '' },
    scores: {
        correctness: { type: Number, default: 0 },
        clarity: { type: Number, default: 0 },
        depth: { type: Number, default: 0 }
    },
    answerScore: { type: Number, default: 0 },       // ✅ Average of 3 scores
    feedback: { type: String, default: '' },
    tip: { type: String, default: '' },              // ✅ From AI
    isSkipped: { type: Boolean, default: false }     // ✅ User skipped?
}, { _id: false });

const reportSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterviewSession',
        required: true,
        unique: true  // ✅ One report per session
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    answers: [answerSchema],
    
    // Computed after all answers
    totalScore: { type: Number, default: 0 },        // 0-100
    strengths: { type: [String], default: [] },      // ✅ ADDED
    weakAreas: { type: [String], default: [] },      // ✅ ADDED
    overallFeedback: { type: String, default: '' },  // ✅ ADDED
    
    // Metadata
    role: { type: String },
    experience: { type: String }
}, { timestamps: true });

reportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Report", reportSchema);