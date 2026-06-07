// import Question from "../models/Question.model.js";
import Question from "../models/Question.model.js"
import { generateQuestion } from "./ai.service.js";

// Admin creates question parameters → AI generates content → save to DB
export const createQuestion = async (adminId, { role, difficulty, experienceLevel, skillTags }) => {
    // Pick one skillTag randomly to guide AI
    const skillTag = skillTags[Math.floor(Math.random() * skillTags.length)];

    // AI generates questionText + expectedAnswer
    const aiGenerated = await generateQuestion(role, difficulty, experienceLevel, skillTag);

    const question = await Question.create({
        questionText: aiGenerated.question,
        expectedAnswer: aiGenerated.expectedAnswer,
        skillTags: [aiGenerated.skillTag],
        role,
        difficulty,
        experienceLevel,
        createdBy: adminId,
    });

    return question;
};

export const getAllQuestions = async (filters = {}) => {
    const query = { isActive: true };

    if (filters.role) query.role = filters.role;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel;

    return await Question.find(query).populate("createdBy", "name email").sort({ createdAt: -1 });
};

export const updateQuestion = async (questionId, updateData) => {
    return await Question.findByIdAndUpdate(questionId, updateData, { new: true, runValidators: true });
};

export const deleteQuestion = async (questionId) => {
    // Soft delete — just set isActive: false
    return await Question.findByIdAndUpdate(questionId, { isActive: false }, { new: true });
};








//  Bulk generate multiple questions
export const bulkGenerateQuestions = async (adminId, { role, difficulty, experienceLevel, count, topic }) => {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        try {
            // Generate question with AI (optionally focused on a topic)
            const aiGenerated = await generateQuestion(role, difficulty, experienceLevel, topic);
            
            const question = await Question.create({
                questionText: aiGenerated.question,
                expectedAnswer: aiGenerated.expectedAnswer,
                skillTags: aiGenerated.skillTags || [topic || 'General'],
                role: [role], // IMPORTANT: Wrap in array for your schema
                difficulty,
                experienceLevel,
                createdBy: adminId,
                isActive: true
            });
            
            questions.push(question);
        } catch (error) {
            console.error(`Failed to generate question ${i + 1}:`, error);
            // Continue generating other questions even if one fails
        }
    }
    
    return questions;
};