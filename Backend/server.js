import express from "express"
import dotenv from "dotenv"
dotenv.config();
import { connectDb } from "./config/db.js"
import authRouter from "./Routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./Routes/userRoutes.js";
import geminiResponse from "./gemini.js";


const app = express() // we use all the functions of express via app variable
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {origin : "http://localhost:5173",
    credentials:true}
))

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

//to check whether gemini api works or not
// app.get("/",async (req,res)=>{
//     let prompt = req.query.prompt
//     let data = await geminiResponse(prompt)
//     res.json(data)
// })

app.listen(port,()=>{
    connectDb();
    console.log(`Server started on http://localhost:${port}`);
})