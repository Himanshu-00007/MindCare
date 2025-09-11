
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  messages: [
    {
      sender: { type: String, enum: ["student", "ai", "system"], required: true },
      text: { type: String, required: true },
      meta: { type: Object, default: {} }, // e.g., { urgency: 'low' }
      createdAt: { type: Date, default: Date.now }
    }
  ],
  lastTriage: {
    level: { type: String, enum: ["low", "medium", "high"], default: "low" },
    reason: { type: String },
    createdAt: Date
  },
  escalatedToCounsellor: { type: Boolean, default: false }
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
