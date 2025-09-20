// controllers/chat.controller.js

import Chat from "../models/chat.model.js";
import Student from "../models/student.model.js";
import axios from "axios";
import { mentalAidLibrary, getRandomTechnique } from "../utils/mentalAidLibrary.js";

// 🔹 Suicidal keywords check
const suicideKeywords = [
  "kill myself", "end my life", "suicide", "i want to die", "cut myself", "worthless", "no reason to live"
];

function containsSuicidalText(text) {
  return suicideKeywords.some(k => text.toLowerCase().includes(k));
}

// 🔹 Determine triage level based on message + mental health scores
async function triageStudent(student, messageText) {
  const scores = student.mental_health_score || {};
  let level = "low";
  let reason = [];

  if (containsSuicidalText(messageText)) {
    return { level: "high", reason: "suicidal language detected" };
  }

  if ((scores.PHQ9 >= 15) || (scores.GAD7 >= 15)) {
    return { level: "high", reason: "high PHQ9/GAD7 scores" };
  } else if ((scores.PHQ9 >= 10) || (scores.GAD7 >= 10)) {
    level = "medium";
    reason.push("moderate PHQ9/GAD7 scores");
  }

  return { level, reason: reason.join(", ") };
}

// 🔹 Build AI system prompt
function buildSystemPrompt(student, triage) {
  let copingSection = "";

  if (triage.level === "medium" || triage.level === "high") {
    copingSection = `
Coping techniques:
${Object.entries(mentalAidLibrary.techniques).map(([k, v]) => `• ${k}: ${v}`).join("\n")}
`;
  }

  return `You are a compassionate mental health assistant for college students.
- ${mentalAidLibrary.rules.join("\n- ")}

Goals:
- ${mentalAidLibrary.goals.join("\n- ")}

${copingSection}Escalation:
- High distress: ${mentalAidLibrary.escalation.high.join(" | ")}
- Medium distress: ${mentalAidLibrary.escalation.medium.join(" | ")}
- Low distress: ${mentalAidLibrary.escalation.low.join(" | ")}

Instructions for AI:
- Respond in a supportive, empathetic, non-judgemental style (<140 words).
- Only provide mental health tips if the student shows stress or distress (medium/high triage).
- Do NOT provide coping tips for neutral or factual questions.
- Offer “Would you like me to connect you to a counsellor?” only if triage is medium or high.

Student info:
- Preferred language: ${student.preferred_language || "English"}
- Institution: ${student.institution || "Unknown"}
- Triage level: ${triage.level}`;
}

// 🔹 Call Gemini API
async function callGemini(prompt, history = []) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not set");

  const historyText = history.map(m => `${m.role === "user" ? "Student" : "AI"}: ${m.content}`).join("\n");

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    { contents: [{ parts: [{ text: `${prompt}\n\nConversation history:\n${historyText}` }] }] },
    { headers: { "Content-Type": "application/json" } }
  );

  const candidates = response.data.candidates;
  if (!candidates?.length) throw new Error("Gemini returned no candidates");

  return candidates[0].content.parts[0].text.trim();
}

// 🔹 POST /chatbot/chat
export const studentChat = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    const student = await Student.findById(studentId).select("-password -refreshToken");
    if (!student) return res.status(404).json({ message: "Student not found" });

    const triage = await triageStudent(student, message);

    let chat = await Chat.findOne({ student: studentId });
    if (!chat) chat = new Chat({ student: studentId, messages: [] });

    chat.messages.push({ sender: "student", text: message, meta: {} });

    // High triage: escalate immediately
    if (triage.level === "high") {
      chat.lastTriage = { level: "high", reason: triage.reason, createdAt: new Date() };
      chat.escalatedToCounsellor = true;
      await chat.save();

      return res.status(200).json({
        reply: mentalAidLibrary.escalation.high.join(" | "),
        triage,
        escalated: true
      });
    }

    const systemPrompt = buildSystemPrompt(student, triage);

    const history = chat.messages.slice(-6).map(m => ({
      role: m.sender === "student" ? "user" : "assistant",
      content: m.text
    }));

    let botReply = await callGemini(systemPrompt, history);

    // Only add tip if triage is medium or high
    if (triage.level === "medium" || triage.level === "high") {
      botReply += `\n\n💡 Tip: ${getRandomTechnique()}`;
    }

    chat.messages.push({ sender: "ai", text: botReply, meta: { triage: triage.level } });
    chat.lastTriage = { level: triage.level, reason: triage.reason, createdAt: new Date() };
    await chat.save();

    const suggestBooking = triage.level === "medium";

    return res.status(200).json({ reply: botReply, triage, suggestBooking });
  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error in chat", error: error.message });
  }
};

// 🔹 GET /chatbot/history
export const getChatHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    if (!studentId) return res.status(400).json({ message: "studentId missing" });

    const chat = await Chat.findOne({ student: studentId })
      .populate("student", "name email institution");

    return res.status(200).json(chat);
  } catch (err) {
    console.error("History error:", err.message);
    return res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};
