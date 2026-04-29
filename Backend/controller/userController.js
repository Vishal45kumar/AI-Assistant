
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/UserModel.js"
import moment from "moment"

export const getCurrentUser = async(req,res)=>{
    try{
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(502).json({
                message:"user not found"
            })
        }
         return res.status(200).json(user);
    }catch(error){
        return res.status(400).json({
            message:"Get current user error"
        })
    }
}

export const updateAssistant = async (req,res)=>{
    try{
        const {assistantName,imageUrl} = req.body;
        let assistantImage ="";
        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path)//if user chooses image from device upload it on cloudinary
        }else{
            assistantImage=imageUrl // if user chooses already given images set it to public folder only
        }
        const user = await User.findByIdAndUpdate(req.userId,{assistantName,assistantImage},
            {new:true}).select("-password")
            return res.status(200).json(user)
        
    }catch(error){
            return res.status(400).json({
              message: "Update assistant error",
            });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body
        const user = await User.findById(req.userId)
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        user.history.push(command)
        await user.save()
        const userName = user.name
        const assistantName = user.assistantName

        let result
        try {
            result = await geminiResponse(command, assistantName, userName)
        } catch (geminiError) {
            console.error("Gemini API error:", geminiError.message)
            return res.status(502).json({ message: "Gemini API failed, please try again." })
        }

        if (!result) {
            return res.status(400).json({ message: "Empty response from Gemini" })
        }

        // Strip markdown code fences if Gemini wraps in ```json ... ```
        const cleaned = result.replace(/```json|```/g, "").trim()

        const jsonMatch = cleaned.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            console.error("No JSON found in Gemini response:", result)
            return res.status(400).json({ message: "Sorry, I couldn't understand that." })
        }

        let gemResult
        try {
            gemResult = JSON.parse(jsonMatch[0])
        } catch (parseError) {
            console.error("JSON parse error:", parseError.message, "Raw:", jsonMatch[0])
            return res.status(400).json({ message: "Failed to parse assistant response." })
        }

        console.log(gemResult)
        const type = gemResult.type

        switch (type) {
            case "get_date":
                return res.json({ type, userInput: gemResult.userInput, response: `Current date is ${moment().format("YYYY-MM-DD")}` })
            case "get_time":
                return res.json({ type, userInput: gemResult.userInput, response: `Current time is ${moment().format("hh:mm A")}` })
            case "get_day":
                return res.json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format("dddd")}` })
            case "get_month":
                return res.json({ type, userInput: gemResult.userInput, response: `Current month is ${moment().format("MMMM")}` })
            case "google_search":
            case "youtube_search":
            case "youtube_play":
            case "general":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "whatsapp_open":
            case "weather_show":
                return res.json({ type, userInput: gemResult.userInput, response: gemResult.response })
            default:
                return res.status(400).json({ response: "I didn't understand that command." })
        }
    } catch (error) {
        console.error("askToAssistant error:", error)
        return res.status(500).json({ message: "Ask assistant error" })
    }
}

