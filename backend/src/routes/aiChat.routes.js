import Router from "express";
import { getChatHistory, studentChat } from "../controllers/aiChat.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js"

const router = Router();

// 🧑‍🎓 Student chat with AI (JWT protected)
router.post("/chat", verifyJWT, studentChat);
router.get("/history/:studentId", verifyJWT, getChatHistory);

export default router;
