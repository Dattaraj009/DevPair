import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: false,
        trim: true
    },
    role: {
        type: [String], // Changed to Array as per Source 63
        required: true,
        enum: {
            values: ['frontend', 'backend', 'mern'],
            message: '{VALUE} is not supported'
         }
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    skillTags: {
        type: [String], // e.g. ["React", "Hooks"]
        required: true,
        index: true
    },
    expectedAnswer: {
        type: String,
        required: false, // Crucial for AI evaluation [cite: 44]
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['fresher', 'junior', 'mid']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // References your Admin model
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);