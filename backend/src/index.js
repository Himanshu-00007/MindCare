import { app } from "./app.js"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./db/index.js"
await connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server listening successfully")
    })
})  
.catch((error)=>{
    console.log("mongodb connection failed",error);
})