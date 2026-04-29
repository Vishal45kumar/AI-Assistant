import express from "express"
import { Login, logout, signUp } from "../controller/AuthController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.get("/logout", logout);

export default authRouter;