import Router from "express";
import { getChatHistory, studentChat } from "../controllers/aiChat.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";

const router = Router();

// 🧑‍🎓 Student chat with AI (JWT protected)
router.post("/chat", verifyJWT, studentChat);

// ✅ History route now uses JWT, no need for :id param
router.get("/history", verifyJWT, getChatHistory);

export default router;
