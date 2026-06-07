import Groq from "groq-sdk";
import env from "dotenv";
env.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Clients ───────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Prompt Builders ───────────────────────────────────────────────────────
const buildGenerationPrompt = (role, difficulty, experience, skillTag) => ({
    system: `You are a senior technical interviewer with 10+ years of experience interviewing
developers. Generate technical interview questions that reflect real hiring standards.`,
    user: `Generate 1 ${difficulty} question for a ${role} developer with ${experience}
experience. Topic must be from: ${skillTag}. Return JSON only:
{ "question": "...", "expectedAnswer": "...", "skillTag": "..." }`,
});

const buildEvaluationPrompt = (questionText, expectedAnswer, userAnswer) => ({
    system: `You are an expert technical interviewer. Evaluate candidate answers objectively
and provide structured feedback. Return only valid JSON.`,
    user: `Question: ${questionText}
Expected Answer: ${expectedAnswer}
Candidate's Answer: ${userAnswer}
Return: { "correctness": 0-10, "clarity": 0-10, "depth": 0-10,
  "feedback": "...", "tip": "...", "weakArea": "skill tag if weak" }`,
});

// ─── Groq Caller ───────────────────────────────────────────────────────────
const callGroq = async (system, user) => {
    const response = await groq.chat.completions.create({
        // model: "llama-3.1-70b-versatile",
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
};

// ─── Gemini Caller (Fallback) ──────────────────────────────────────────────
const callGemini = async (system, user) => {
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`${system}\n\n${user}`);
    return result.response.text();
};

// ─── JSON Parser ───────────────────────────────────────────────────────────
const parseJSON = (text) => {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
};

// ─── AI Caller with Fallback ───────────────────────────────────────────────
const callAI = async (system, user) => {
    try {
        const text = await callGroq(system, user);
        return parseJSON(text);
    } catch (groqError) {
        console.warn("Groq failed, falling back to Gemini:", groqError.message);
        try {
            const text = await callGemini(system, user);
            return parseJSON(text);
        } catch (geminiError) {
            throw new Error(`Both AI providers failed. Groq: ${groqError.message} | Gemini: ${geminiError.message}`);
        }
    }
};

// ─── Public Functions ──────────────────────────────────────────────────────

/**
 * Generate a question using AI
 * @param {string} role - frontend | backend | mern
 * @param {string} difficulty - easy | medium | hard
 * @param {string} experience - fresher | junior | mid
 * @param {string} skillTag - e.g. "React Hooks"
 * @returns {{ question, expectedAnswer, skillTag }}
 */
export const generateQuestion = async (role, difficulty, experience, skillTag) => {
    const { system, user } = buildGenerationPrompt(role, difficulty, experience, skillTag);
    return await callAI(system, user);
};

/**
 * Evaluate a user's answer using AI
 * @param {string} questionText
 * @param {string} expectedAnswer
 * @param {string} userAnswer
 * @returns {{ correctness, clarity, depth, feedback, tip, weakArea }}
 */
export const evaluateAnswer = async (questionText, expectedAnswer, userAnswer) => {
    const { system, user } = buildEvaluationPrompt(questionText, expectedAnswer, userAnswer);
    return await callAI(system, user);
};