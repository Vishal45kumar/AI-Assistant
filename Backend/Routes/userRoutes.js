import express from "express"
import { askToAssistant, getCurrentUser, updateAssistant } from "../controller/userController.js"
import isAuth from "../middlewares/isAuth.js"
import multer from "multer"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()
userRouter.get("/current",isAuth,getCurrentUser)
userRouter.put("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter