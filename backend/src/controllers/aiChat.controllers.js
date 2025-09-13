import Chat from "../models/chat.model.js";
import Student from "../models/student.model.js";
import axios from "axios";
import { mentalAidLibrary } from "../utils/mentalAidLibrary.js";

// 🔹 Suicidal keywords check
const suicideKeywords = [
  "kill myself", "end my life", "suicide", "i want to die", "cut myself", "worthless", "no reason to live"
];

function containsSuicidalText(text) {
  const t = text.toLowerCase();
  return suicideKeywords.some(k => t.includes(k));
}

// 🔹 Triage logic
async function triageStudent(student, messageText) {
  let level = "low";
  let reason = [];

  if (containsSuicidalText(messageText)) {
    level = "high";
    reason.push("suicidal language detected");
    return { level, reason: reason.join(", ") };
  }

  const scores = student.mental_health_score || {};
  if ((scores.phq9 >= 15) || (scores.gad7 >= 15)) {
    level = "high";
    reason.push("high PHQ/GAD scores");
    return { level, reason: reason.join(", ") };
  } else if ((scores.phq9 >= 10) || (scores.gad7 >= 10)) {
    level = "medium";
    reason.push("moderate PHQ/GAD scores");
  }

  return { level, reason: reason.join(", ") };
}

// 🔹 System prompt for AI
function buildSystemPrompt(student, triage) {
  return `You are a compassionate, brief mental-health first-aid assistant for college students.
- ${mentalAidLibrary.rules.join("\n- ")}

Goals:
- ${mentalAidLibrary.goals.join("\n- ")}

Coping techniques:
${Object.entries(mentalAidLibrary.techniques)
  .map(([k, v]) => `• ${k}: ${v}`)
  .join("\n")}

Escalation guidelines:
- High distress: ${mentalAidLibrary.escalation.high}
- Medium distress: ${mentalAidLibrary.escalation.medium}
- Low distress: ${mentalAidLibrary.escalation.low}

Keep responses supportive, non-judgemental, conversational, and under 140 words.
Offer “Would you like me to connect you to a counsellor?” if triage is medium or high.

Student context:
- preferred_language: ${student.preferred_language || "English"}
- institution: ${student.institution || "Unknown"}
- triage_level: ${triage.level}
`;
}

// 🔹 Call Gemini API
async function callGemini(prompt, conversationHistory = []) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not set");

  const historyText = conversationHistory.map(
    m => `${m.role === "user" ? "Student" : "AI"}: ${m.content}`
  ).join("\n");

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      contents: [
        { parts: [{ text: `${prompt}\n\nConversation history:\n${historyText}` }] }
      ]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const candidates = response.data.candidates;
  if (!candidates || !candidates.length) throw new Error("Gemini returned no candidates");

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

    // High-risk escalation
    if (triage.level === "high") {
      chat.lastTriage = { level: "high", reason: triage.reason, createdAt: new Date() };
      chat.escalatedToCounsellor = true;
      await chat.save();

      return res.status(200).json({
        reply: mentalAidLibrary.escalation.high,
        triage,
        escalated: true
      });
    }

    const systemPrompt = buildSystemPrompt(student, triage);
    const history = (chat.messages || []).slice(-6).map(m => ({
      role: m.sender === "student" ? "user" : "assistant",
      content: m.text
    }));

    const botReply = await callGemini(systemPrompt, history);

    chat.messages.push({ sender: "ai", text: botReply, meta: { triage: triage.level } });
    chat.lastTriage = { level: triage.level, reason: triage.reason, createdAt: new Date() };
    await chat.save();

    const suggestBooking = triage.level === "medium";

    return res.status(200).json({ reply: botReply, triage, suggestBooking });
  } catch (error) {
    console.error("chat error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error in chat", error: error.message });
  }
};

// 🔹 GET /chatbot/history
export const getChatHistory = async (req, res) => {
  try {
    const studentId = req.user._id; // JWT se directly
    if (!studentId) return res.status(400).json({ message: "studentId missing" });

    const chat = await Chat.findOne({ student: studentId }).populate("student", "name email institution");
    if (!chat) return res.status(404).json({ message: "No chat history found" });

    return res.status(200).json(chat);
  } catch (err) {
    console.error("history error:", err.message);
    return res.status(500).json({ message: "Error fetching history", error: err.message });
  }
};
