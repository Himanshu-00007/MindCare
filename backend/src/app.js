import  express from "express"
import  cors from "cors"
import cookieParser from "cookie-parser";
const app=express();
app.use(cors());
app.use(express.json({limit:"16kb"})) 
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
import router from "./routes/student.routes.js"
app.use("/api/v1/students",router);


import counsellorRouter from "./routes/counsellor.routes.js"
app.use("/api/v1/counsellors",counsellorRouter);

import aiChatRouter from "./routes/aiChat.routes.js";
app.use("/api/v1/chatbot",aiChatRouter);
export {app};